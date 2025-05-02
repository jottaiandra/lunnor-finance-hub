
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Transaction } from "@/types";
import { FinanceContextType } from "./finance/types";
import { initialState, financeReducer } from "./finance/reducer";
import { 
  fetchTransactions, 
  addTransaction,
  updateTransaction,
  deleteTransaction,
  generateRecurringTransactions,
  getFilteredTransactions
} from "./finance/transactionService";
import {
  fetchGoals,
  addGoal,
  updateGoal,
  deleteGoal
} from "./finance/goalService";
import { 
  fetchNotifications, 
  fetchAlerts, 
  markAlertRead, 
  markNotificationRead, 
  hasUnreadNotifications 
} from "./finance/notificationService";
import {
  getTotalIncome,
  getTotalExpense,
  getCurrentBalance
} from "./finance/statsService";

const FinanceContext = createContext<FinanceContextType>({
  state: initialState,
  dispatch: () => {},
  getFilteredTransactions: () => [],
  getTotalIncome: () => 0,
  getTotalExpense: () => 0,
  getCurrentBalance: () => 0,
  fetchTransactions: async () => {},
  fetchGoals: async () => {},
  fetchAlerts: async () => {},
  fetchNotifications: async () => {},
  addTransaction: async () => {},
  updateTransaction: async () => {},
  deleteTransaction: async () => {},
  addGoal: async () => {},
  updateGoal: async () => {},
  deleteGoal: async () => {},
  markAlertRead: async () => {},
  markNotificationRead: async () => {},
  hasUnreadNotifications: () => false
});

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  const handleAddGoal = async (goalData: Omit<any, "id">) => {
    if (!user) return;
    await addGoal(goalData, user.id, dispatch);
  };

  const handleUpdateGoal = async (goalData: any) => {
    if (!user) return;
    await updateGoal(goalData, user.id, dispatch);
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

  // Set up real-time subscriptions when user is authenticated
  useEffect(() => {
    if (user) {
      // Log that we're loading data for this user
      console.log("Loading data for user:", user.id);
      
      // Load initial data
      handleFetchTransactions();
      handleFetchGoals();
      handleFetchAlerts();
      handleFetchNotifications();
      
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

  return (
    <FinanceContext.Provider
      value={{
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
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
