
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { processNotification } from "../whatsappService";
import { getCurrentBalance } from "../statsService";

export function useRealtimeSubscriptions(user: any, state: any, methods: any) {
  useEffect(() => {
    if (!user) {
      console.log("No authenticated user, skipping data fetch");
      
      // Reset state when user is not authenticated
      methods.dispatch({ type: "SET_TRANSACTIONS", payload: [] });
      methods.dispatch({ type: "SET_GOALS", payload: [] });
      methods.dispatch({ type: "SET_ALERTS", payload: [] });
      methods.dispatch({ type: "SET_NOTIFICATIONS", payload: [] });
      return;
    }

    // Log that we're loading data for this user
    console.log("Loading data for user:", user.id);
    
    // Load initial data - execute only once
    const fetchInitialData = async () => {
      try {
        await methods.fetchTransactions();
        await methods.fetchGoals();
        await methods.fetchAlerts();
        await methods.fetchNotifications();
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    
    fetchInitialData();
    
    // Check for upcoming expenses and send WhatsApp notification if needed
    const checkUpcomingExpenses = async () => {
      try {
        const today = new Date();
        const threeDaysLater = new Date();
        threeDaysLater.setDate(today.getDate() + 3);
        
        const upcomingExpenses = state.transactions.filter(t => 
          t.type === 'expense' && 
          new Date(t.date) >= today && 
          new Date(t.date) <= threeDaysLater
        );
        
        if (upcomingExpenses.length > 0) {
          const total = upcomingExpenses.reduce((sum, exp) => sum + exp.amount, 0);
          await processNotification(user.id, 'upcoming_expense', {
            count: upcomingExpenses.length,
            valor: total,
            nome: user.email?.split('@')[0] || 'Usuário'
          });
        }
      } catch (error) {
        console.error("Error checking upcoming expenses:", error);
      }
    };
    
    // Check balance threshold and send notification if necessary
    const checkBalanceThreshold = async () => {
      try {
        const balance = getCurrentBalance(state.transactions);
        // Default threshold is 1000, but this could be configurable
        const threshold = 1000; 
        
        if (balance < threshold) {
          await processNotification(user.id, 'low_balance', {
            valor: balance,
            nome: user.email?.split('@')[0] || 'Usuário'
          });
        }
      } catch (error) {
        console.error("Error checking balance threshold:", error);
      }
    };
    
    // Run initial checks with delay to ensure data is loaded
    const checkTimeout = setTimeout(() => {
      checkUpcomingExpenses();
      checkBalanceThreshold();
    }, 2000);
    
    // Set up real-time subscriptions for updates
    const transactionsChannel = supabase
      .channel('public:transactions')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${user.id}` }, 
        (payload) => {
          console.log('Mudança em transações:', payload);
          methods.fetchTransactions();
        }
      )
      .subscribe();
      
    const goalsChannel = supabase
      .channel('public:goals')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'goals', filter: `user_id=eq.${user.id}` }, 
        (payload) => {
          console.log('Mudança em metas:', payload);
          methods.fetchGoals();
        }
      )
      .subscribe();
      
    const alertsChannel = supabase
      .channel('public:alerts')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'alerts', filter: `user_id=eq.${user.id}` }, 
        (payload) => {
          console.log('Mudança em alertas:', payload);
          methods.fetchAlerts();
        }
      )
      .subscribe();
      
    const notificationsChannel = supabase
      .channel('public:notifications')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, 
        (payload) => {
          console.log('Mudança em notificações:', payload);
          methods.fetchNotifications();
        }
      )
      .subscribe();
    
    // Clean up subscriptions when unmounting
    return () => {
      clearTimeout(checkTimeout);
      supabase.removeChannel(transactionsChannel);
      supabase.removeChannel(goalsChannel);
      supabase.removeChannel(alertsChannel);
      supabase.removeChannel(notificationsChannel);
    };
  }, [user]); // Removi dependências que causavam loops - only depend on user

  return null;
}
