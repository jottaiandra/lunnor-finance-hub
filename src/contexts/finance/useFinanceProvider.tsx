import { useReducer, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Goal, Transaction } from "@/types";
import { initialState, financeReducer } from "./reducer";
import { 
  fetchTransactions, 
  addTransaction,
  updateTransaction,
  deleteTransaction,
  generateRecurringTransactions,
  getFilteredTransactions
} from "./transactionService";
import {
  fetchGoals,
  addGoal,
  updateGoal,
  deleteGoal
} from "./goalService";
import { 
  fetchNotifications, 
  fetchAlerts, 
  markAlertRead, 
  markNotificationRead, 
  hasUnreadNotifications 
} from "./notificationService";
import {
  getTotalIncome,
  getTotalExpense,
  getCurrentBalance
} from "./statsService";
import { processNotification } from "./whatsappService";

export function useFinanceProvider() {
  const [state, dispatch] = useReducer(financeReducer, initialState);
  const { user } = useAuth();

  // Handle transaction functions
  const handleFetchTransactions = async () => {
    if (!user) return;
    await fetchTransactions(user.id, dispatch);
  };

  const handleAddTransaction = async (transactionData: Omit<Transaction, "id">) => {
    if (!user) return;
    const newTransaction = await addTransaction(transactionData, user.id, dispatch);
    
    // Send WhatsApp notification
    if (newTransaction) {
      const eventType = newTransaction.type === 'income' ? 'new_income' : 'new_expense';
      await processNotification(user.id, eventType, {
        descricao: newTransaction.description,
        valor: newTransaction.amount,
        categoria: newTransaction.category,
        data: newTransaction.date,
        nome: user.email?.split('@')[0] || 'Usuário'
      });
    }
    
    // If this is a recurring transaction, generate future occurrences
    if (newTransaction?.isRecurrent && newTransaction?.recurrenceFrequency) {
      const newTransactions = await generateRecurringTransactions(newTransaction, user.id, dispatch);
      
      if (newTransactions && newTransactions.length > 0) {
        dispatch({ 
          type: "SET_TRANSACTIONS", 
          payload: [...state.transactions, ...newTransactions] 
        });
      }
    }
  };

  const handleUpdateTransaction = async (transaction: Transaction, updateOptions?: { updateAllFuture?: boolean }) => {
    if (!user) return;
    await updateTransaction(transaction, user.id, dispatch, updateOptions);
    
    // Send WhatsApp notification for transaction updates
    await processNotification(user.id, 'transaction_updated', {
      descricao: transaction.description,
      valor: transaction.amount,
      categoria: transaction.category,
      data: transaction.date,
      nome: user.email?.split('@')[0] || 'Usuário'
    });
  };

  const handleDeleteTransaction = async (id: string, deleteOptions?: { deleteAllFuture?: boolean }) => {
    if (!user) return;
    await deleteTransaction(id, user.id, dispatch, deleteOptions);
  };

  // Handle goal functions
  const handleFetchGoals = async () => {
    if (!user) return;
    await fetchGoals(user.id, dispatch);
  };

  const handleAddGoal = async (goal: Omit<Goal, "id">): Promise<Goal | null> => {
    if (!user) return null;
    try {
      // Make sure addGoal returns the actual goal object
      const newGoal = await addGoal(goal, user.id, dispatch);
      
      // Send WhatsApp notification for new goal
      if (newGoal && typeof newGoal === 'object') {
        await processNotification(user.id, 'goal_updated', {
          titulo: newGoal.title || 'Nova Meta',
          progresso: 0,
          nome: user.email?.split('@')[0] || 'Usuário'
        });
      }
      
      return newGoal;
    } catch (error) {
      console.error("Error in handleAddGoal:", error);
      return null;
    }
  };

  const handleUpdateGoal = async (goal: Goal): Promise<Goal | null> => {
    if (!user) return null;
    try {
      // Make sure updateGoal returns the actual goal object
      const updatedGoal = await updateGoal(goal, user.id, dispatch);
      
      // Send WhatsApp notification for goal updates
      if (updatedGoal && typeof updatedGoal === 'object') {
        const current = updatedGoal.current || 0;
        const target = updatedGoal.target || 1;
        const progress = Math.round((current / target) * 100);
        
        // If goal is achieved, send achievement notification
        if (current >= target) {
          await processNotification(user.id, 'goal_achieved', {
            titulo: updatedGoal.title || 'Meta',
            progresso: progress,
            nome: user.email?.split('@')[0] || 'Usuário'
          });
        } else {
          // Otherwise send regular update notification
          await processNotification(user.id, 'goal_updated', {
            titulo: updatedGoal.title || 'Meta',
            progresso: progress,
            nome: user.email?.split('@')[0] || 'Usuário'
          });
        }
      }
      
      return updatedGoal;
    } catch (error) {
      console.error("Error in handleUpdateGoal:", error);
      return null;
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (!user) return;
    await deleteGoal(id, user.id, dispatch);
  };

  // Handle notification functions
  const handleFetchNotifications = async () => {
    if (!user) return;
    await fetchNotifications(user.id, dispatch);
  };

  const handleFetchAlerts = async () => {
    if (!user) return;
    await fetchAlerts(user.id, dispatch);
  };

  const handleMarkAlertRead = async (id: string) => {
    if (!user) return;
    await markAlertRead(id, user.id, dispatch);
  };

  const handleMarkNotificationRead = async (id: string) => {
    if (!user) return;
    await markNotificationRead(id, user.id, dispatch);
  };

  const handleHasUnreadNotifications = () => {
    return hasUnreadNotifications(state.notifications);
  };

  // Handle stats functions
  const handleGetFilteredTransactions = () => {
    return getFilteredTransactions(state);
  };

  const handleGetTotalIncome = (period?: 'today' | 'week' | 'month' | 'year') => {
    return getTotalIncome(state.transactions, period);
  };

  const handleGetTotalExpense = (period?: 'today' | 'week' | 'month' | 'year') => {
    return getTotalExpense(state.transactions, period);
  };

  const handleGetCurrentBalance = () => {
    return getCurrentBalance(state.transactions);
  };

  // Set up real-time subscriptions and data monitoring
  useEffect(() => {
    if (user) {
      // Log that we're loading data for this user
      console.log("Loading data for user:", user.id);
      
      // Load initial data
      handleFetchTransactions();
      handleFetchGoals();
      handleFetchAlerts();
      handleFetchNotifications();
      
      // Check for upcoming expenses and send WhatsApp notification if needed
      const checkUpcomingExpenses = async () => {
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
      };
      
      // Check balance threshold and send notification if necessary
      const checkBalanceThreshold = async () => {
        const balance = getCurrentBalance(state.transactions);
        // Default threshold is 1000, but this could be configurable
        const threshold = 1000; 
        
        if (balance < threshold) {
          await processNotification(user.id, 'low_balance', {
            valor: balance,
            nome: user.email?.split('@')[0] || 'Usuário'
          });
        }
      };
      
      // Run initial checks
      setTimeout(() => {
        checkUpcomingExpenses();
        checkBalanceThreshold();
      }, 2000); // Delay to ensure data is loaded
      
      // Set up real-time subscriptions for updates
      const transactionsChannel = supabase
        .channel('public:transactions')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${user.id}` }, 
          (payload) => {
            console.log('Mudança em transações:', payload);
            handleFetchTransactions();
          }
        )
        .subscribe();
        
      const goalsChannel = supabase
        .channel('public:goals')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'goals', filter: `user_id=eq.${user.id}` }, 
          (payload) => {
            console.log('Mudança em metas:', payload);
            handleFetchGoals();
          }
        )
        .subscribe();
        
      const alertsChannel = supabase
        .channel('public:alerts')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'alerts', filter: `user_id=eq.${user.id}` }, 
          (payload) => {
            console.log('Mudança em alertas:', payload);
            handleFetchAlerts();
          }
        )
        .subscribe();
        
      const notificationsChannel = supabase
        .channel('public:notifications')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, 
          (payload) => {
            console.log('Mudança em notificações:', payload);
            handleFetchNotifications();
          }
        )
        .subscribe();
      
      // Clean up subscriptions when unmounting
      return () => {
        supabase.removeChannel(transactionsChannel);
        supabase.removeChannel(goalsChannel);
        supabase.removeChannel(alertsChannel);
        supabase.removeChannel(notificationsChannel);
      };
    } else {
      console.log("No authenticated user, skipping data fetch");
      
      // Reset state when user is not authenticated
      dispatch({ type: "SET_TRANSACTIONS", payload: [] });
      dispatch({ type: "SET_GOALS", payload: [] });
      dispatch({ type: "SET_ALERTS", payload: [] });
      dispatch({ type: "SET_NOTIFICATIONS", payload: [] });
    }
  }, [user]);

  return {
    state,
    dispatch,
    getFilteredTransactions: handleGetFilteredTransactions,
    getTotalIncome: handleGetTotalIncome,
    getTotalExpense: handleGetTotalExpense,
    getCurrentBalance: handleGetCurrentBalance,
    fetchTransactions: handleFetchTransactions,
    fetchGoals: handleFetchGoals,
    fetchAlerts: handleFetchAlerts,
    fetchNotifications: handleFetchNotifications,
    addTransaction: handleAddTransaction,
    updateTransaction: handleUpdateTransaction,
    deleteTransaction: handleDeleteTransaction,
    addGoal: handleAddGoal,
    updateGoal: handleUpdateGoal,
    deleteGoal: handleDeleteGoal,
    markAlertRead: handleMarkAlertRead,
    markNotificationRead: handleMarkNotificationRead,
    hasUnreadNotifications: handleHasUnreadNotifications
  };
}
