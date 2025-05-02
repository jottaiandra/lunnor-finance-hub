
import React, { createContext, useContext, useReducer, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Transaction, TransactionType, PaymentMethod, IncomeCategory, ExpenseCategory, Goal, Alert, Notification } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { addDays, addMonths, addWeeks, addYears, format } from "date-fns";

type State = {
  transactions: Transaction[];
  goals: Goal[];
  alerts: Alert[];
  notifications: Notification[];
  currentFilter: {
    startDate: Date | null;
    endDate: Date | null;
    type: string | null;
    category: string | null;
    searchTerm: string;
  };
  loading: {
    transactions: boolean;
    goals: boolean;
    alerts: boolean;
    notifications: boolean;
  };
  error: string | null;
};

type Action =
  | { type: "SET_TRANSACTIONS"; payload: Transaction[] }
  | { type: "SET_GOALS"; payload: Goal[] }
  | { type: "SET_ALERTS"; payload: Alert[] }
  | { type: "SET_NOTIFICATIONS"; payload: Notification[] }
  | { type: "ADD_TRANSACTION"; payload: Transaction }
  | { type: "UPDATE_TRANSACTION"; payload: Transaction }
  | { type: "DELETE_TRANSACTION"; payload: string }
  | { type: "ADD_GOAL"; payload: Goal }
  | { type: "UPDATE_GOAL"; payload: Goal }
  | { type: "DELETE_GOAL"; payload: string }
  | { type: "MARK_ALERT_READ"; payload: string }
  | { type: "MARK_NOTIFICATION_READ"; payload: string }
  | { type: "SET_FILTER"; payload: Partial<State["currentFilter"]> }
  | { type: "SET_LOADING"; payload: { key: 'transactions' | 'goals' | 'alerts' | 'notifications', value: boolean } }
  | { type: "SET_ERROR"; payload: string | null };

const initialState: State = {
  transactions: [],
  goals: [],
  alerts: [],
  notifications: [],
  currentFilter: {
    startDate: null,
    endDate: null,
    type: null,
    category: null,
    searchTerm: ""
  },
  loading: {
    transactions: false,
    goals: false,
    alerts: false,
    notifications: false
  },
  error: null
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_TRANSACTIONS":
      return {
        ...state,
        transactions: action.payload
      };
    case "SET_GOALS":
      return {
        ...state,
        goals: action.payload
      };
    case "SET_ALERTS":
      return {
        ...state,
        alerts: action.payload
      };
    case "SET_NOTIFICATIONS":
      return {
        ...state,
        notifications: action.payload
      };
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [...state.transactions, action.payload]
      };
    case "UPDATE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((transaction) =>
          transaction.id === action.payload.id ? action.payload : transaction
        )
      };
    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter(
          (transaction) => transaction.id !== action.payload
        )
      };
    case "ADD_GOAL":
      return {
        ...state,
        goals: [...state.goals, action.payload]
      };
    case "UPDATE_GOAL":
      return {
        ...state,
        goals: state.goals.map((goal) =>
          goal.id === action.payload.id ? action.payload : goal
        )
      };
    case "DELETE_GOAL":
      return {
        ...state,
        goals: state.goals.filter((goal) => goal.id !== action.payload)
      };
    case "MARK_ALERT_READ":
      return {
        ...state,
        alerts: state.alerts.map((alert) =>
          alert.id === action.payload ? { ...alert, read: true } : alert
        )
      };
    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload ? { ...notification, isRead: true } : notification
        )
      };
    case "SET_FILTER":
      return {
        ...state,
        currentFilter: { ...state.currentFilter, ...action.payload }
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value
        }
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
};

const FinanceContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  getFilteredTransactions: () => Transaction[];
  getTotalIncome: (period?: 'today' | 'week' | 'month' | 'year') => number;
  getTotalExpense: (period?: 'today' | 'week' | 'month' | 'year') => number;
  getCurrentBalance: () => number;
  fetchTransactions: () => Promise<void>;
  fetchGoals: () => Promise<void>;
  fetchAlerts: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, "id">) => Promise<void>;
  updateTransaction: (transaction: Transaction, updateOptions?: { updateAllFuture?: boolean }) => Promise<void>;
  deleteTransaction: (id: string, deleteOptions?: { deleteAllFuture?: boolean }) => Promise<void>;
  addGoal: (goal: Omit<Goal, "id">) => Promise<void>;
  updateGoal: (goal: Goal) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  markAlertRead: (id: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  hasUnreadNotifications: () => boolean;
}>({
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
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user } = useAuth();
  
  // Função para converter a estrutura de dados do Supabase para o formato interno do app
  const mapTransactionFromDB = (item: any): Transaction => ({
    id: item.id,
    date: new Date(item.date),
    description: item.description,
    amount: Number(item.amount),
    category: item.category,
    paymentMethod: item.payment_method as PaymentMethod,
    type: item.type as TransactionType,
    contact: item.contact,
    isRecurrent: item.is_recurrent || false,
    recurrenceFrequency: item.recurrence_frequency,
    recurrenceInterval: item.recurrence_interval,
    recurrenceStartDate: item.recurrence_start_date ? new Date(item.recurrence_start_date) : undefined,
    recurrenceEndDate: item.recurrence_end_date ? new Date(item.recurrence_end_date) : undefined,
    parentTransactionId: item.parent_transaction_id,
    isOriginal: item.is_original !== false
  });

  // Improved mapGoalFromDB function with better error handling
  const mapGoalFromDB = (item: any): Goal => {
    try {
      if (!item || !item.id) {
        console.error("Received invalid goal data:", item);
        throw new Error("Dados inválidos de meta");
      }

      return {
        id: item.id,
        title: item.title || "",
        target: typeof item.target === 'number' ? item.target : Number(item.target) || 0,
        current: typeof item.current === 'number' ? item.current : Number(item.current) || 0,
        type: item.type as 'income' | 'expense-reduction',
        period: item.period as 'weekly' | 'monthly' | 'yearly',
        startDate: item.start_date ? new Date(item.start_date) : new Date(),
        endDate: item.end_date ? new Date(item.end_date) : new Date()
      };
    } catch (error) {
      console.error("Error mapping goal data:", error, item);
      // Return a minimal valid object to prevent UI errors
      return {
        id: item.id || uuidv4(),
        title: "Erro nos dados",
        target: 0,
        current: 0,
        type: 'income',
        period: 'monthly',
        startDate: new Date(),
        endDate: new Date()
      };
    }
  };

  const mapAlertFromDB = (item: any): Alert => ({
    id: item.id,
    message: item.message,
    type: item.type as 'warning' | 'info' | 'success' | 'danger',
    read: item.read,
    createdAt: new Date(item.created_at)
  });
  
  const mapNotificationFromDB = (item: any): Notification => ({
    id: item.id,
    message: item.message,
    type: item.type,
    relatedTransactionId: item.related_transaction_id,
    isRead: item.is_read || false,
    createdAt: new Date(item.created_at)
  });

  // Função para buscar notificações
  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      dispatch({ type: "SET_LOADING", payload: { key: 'notifications', value: true } });
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const mappedNotifications = data.map(mapNotificationFromDB);
      dispatch({ type: "SET_NOTIFICATIONS", payload: mappedNotifications });
    } catch (error: any) {
      console.error("Erro ao buscar notificações:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: { key: 'notifications', value: false } });
    }
  };

  // Improved fetchGoals function with better error handling
  const fetchGoals = async () => {
    if (!user) {
      console.log("No user authenticated, skipping goal fetch");
      return;
    }
    
    try {
      // Set loading state at the beginning
      dispatch({ type: "SET_LOADING", payload: { key: 'goals', value: true } });
      
      console.log("Fetching goals for user:", user.id);
      
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Supabase error fetching goals:", error);
        throw error;
      }
      
      if (!data) {
        console.log("No goals data returned");
        dispatch({ type: "SET_GOALS", payload: [] });
        return;
      }
      
      console.log("Goals fetched successfully:", data.length);
      
      // Map the data and handle potential mapping errors
      const mappedGoals: Goal[] = [];
      
      for (const item of data) {
        try {
          const goal = mapGoalFromDB(item);
          mappedGoals.push(goal);
        } catch (mappingError) {
          console.error("Error mapping a goal:", mappingError, item);
          // Skip this item instead of breaking the whole list
        }
      }
      
      dispatch({ type: "SET_GOALS", payload: mappedGoals });
    } catch (error: any) {
      console.error("Error fetching goals:", error);
      toast.error("Erro ao carregar metas");
      dispatch({ type: "SET_ERROR", payload: error.message });
      // Set empty array on error to prevent UI issues
      dispatch({ type: "SET_GOALS", payload: [] });
    } finally {
      // Always set loading to false when done
      dispatch({ type: "SET_LOADING", payload: { key: 'goals', value: false } });
    }
  };

  // Função para buscar transações
  const fetchTransactions = async () => {
    if (!user) return;
    
    try {
      dispatch({ type: "SET_LOADING", payload: { key: 'transactions', value: true } });
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      const mappedTransactions = data.map(mapTransactionFromDB);
      dispatch({ type: "SET_TRANSACTIONS", payload: mappedTransactions });
    } catch (error: any) {
      console.error("Erro ao buscar transações:", error);
      toast.error("Erro ao carregar transações");
      dispatch({ type: "SET_ERROR", payload: error.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: { key: 'transactions', value: false } });
    }
  };

  // Função para buscar alertas
  const fetchAlerts = async () => {
    if (!user) return;
    
    try {
      dispatch({ type: "SET_LOADING", payload: { key: 'alerts', value: true } });
      
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const mappedAlerts = data.map(mapAlertFromDB);
      dispatch({ type: "SET_ALERTS", payload: mappedAlerts });
    } catch (error: any) {
      console.error("Erro ao buscar alertas:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: { key: 'alerts', value: false } });
    }
  };

  // Helper function to calculate next occurrence date
  const calculateNextOccurrenceDate = (
    startDate: Date, 
    frequency: string, 
    interval: number = 1
  ): Date => {
    const date = new Date(startDate);
    
    switch (frequency) {
      case 'daily':
        return addDays(date, 1);
      case 'weekly':
        return addWeeks(date, 1);
      case 'biweekly':
        return addWeeks(date, 2);
      case 'monthly':
        return addMonths(date, 1);
      case 'yearly':
        return addYears(date, 1);
      case 'custom':
        return addDays(date, interval);
      default:
        return addMonths(date, 1); // Default to monthly
    }
  };

  // Helper function to generate future recurring transactions
  const generateRecurringTransactions = async (transaction: Transaction, count: number = 5) => {
    if (!user || !transaction.isRecurrent || !transaction.recurrenceFrequency) return;

    try {
      const futureTransactions = [];
      let currentDate = new Date(transaction.date);
      const endDate = transaction.recurrenceEndDate ? new Date(transaction.recurrenceEndDate) : null;
      
      for (let i = 0; i < count; i++) {
        // Calculate next date in the series
        currentDate = calculateNextOccurrenceDate(
          currentDate, 
          transaction.recurrenceFrequency, 
          transaction.recurrenceInterval
        );
        
        // Stop if we've reached the end date
        if (endDate && currentDate > endDate) break;
        
        // Create a new transaction for this date
        const newTransaction = {
          user_id: user.id,
          date: currentDate.toISOString(),
          description: transaction.description,
          amount: transaction.amount,
          category: transaction.category,
          payment_method: transaction.paymentMethod,
          type: transaction.type,
          contact: transaction.contact || null,
          is_recurrent: true,
          recurrence_frequency: transaction.recurrenceFrequency,
          recurrence_interval: transaction.recurrenceInterval,
          recurrence_start_date: transaction.recurrenceStartDate?.toISOString(),
          recurrence_end_date: transaction.recurrenceEndDate?.toISOString(),
          parent_transaction_id: transaction.id,
          is_original: false
        };
        
        futureTransactions.push(newTransaction);
      }
      
      if (futureTransactions.length > 0) {
        const { data, error } = await supabase
          .from('transactions')
          .insert(futureTransactions)
          .select();
        
        if (error) throw error;
        
        // Create a notification for the user
        await supabase
          .from('notifications')
          .insert({
            user_id: user.id,
            message: `${futureTransactions.length} novas transações recorrentes foram geradas para "${transaction.description}"`,
            type: 'info',
            related_transaction_id: transaction.id,
            is_read: false
          });
          
        // Update the state with new transactions
        if (data) {
          const mappedNewTransactions = data.map(mapTransactionFromDB);
          dispatch({ 
            type: "SET_TRANSACTIONS", 
            payload: [...state.transactions, ...mappedNewTransactions] 
          });
        }
      }
    } catch (error) {
      console.error("Erro ao gerar transações recorrentes:", error);
    }
  };

  // Adicionar uma transação
  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    if (!user) return;
    
    try {
      // Preparar dados para o Supabase
      const transactionData = {
        user_id: user.id,
        date: transaction.date.toISOString(),
        description: transaction.description,
        amount: transaction.amount,
        category: transaction.category,
        payment_method: transaction.paymentMethod,
        type: transaction.type,
        contact: transaction.contact || null,
        is_recurrent: transaction.isRecurrent || false,
        recurrence_frequency: transaction.recurrenceFrequency || null,
        recurrence_interval: transaction.recurrenceInterval || null,
        recurrence_start_date: transaction.recurrenceStartDate ? transaction.recurrenceStartDate.toISOString() : null,
        recurrence_end_date: transaction.recurrenceEndDate ? transaction.recurrenceEndDate.toISOString() : null,
        is_original: transaction.isOriginal !== false
      };
      
      // Inserir no Supabase
      const { data, error } = await supabase
        .from('transactions')
        .insert(transactionData)
        .select()
        .single();
      
      if (error) throw error;
      
      // Adicionar ao estado local
      const newTransaction = mapTransactionFromDB(data);
      dispatch({ type: "ADD_TRANSACTION", payload: newTransaction });
      
      // If this is a recurring transaction, generate future occurrences
      if (transaction.isRecurrent && transaction.recurrenceFrequency) {
        await generateRecurringTransactions(newTransaction);
      }
    } catch (error: any) {
      console.error("Erro ao adicionar transação:", error);
      toast.error("Erro ao salvar transação");
      throw error;
    }
  };

  // Atualizar uma transação
  const updateTransaction = async (
    transaction: Transaction, 
    updateOptions?: { updateAllFuture?: boolean }
  ) => {
    if (!user) return;
    
    try {
      // Preparar dados para o Supabase
      const transactionData = {
        date: transaction.date.toISOString(),
        description: transaction.description,
        amount: transaction.amount,
        category: transaction.category,
        payment_method: transaction.paymentMethod,
        type: transaction.type,
        contact: transaction.contact || null,
        is_recurrent: transaction.isRecurrent || false,
        recurrence_frequency: transaction.recurrenceFrequency || null,
        recurrence_interval: transaction.recurrenceInterval || null,
        recurrence_start_date: transaction.recurrenceStartDate ? transaction.recurrenceStartDate.toISOString() : null,
        recurrence_end_date: transaction.recurrenceEndDate ? transaction.recurrenceEndDate.toISOString() : null,
      };
      
      if (updateOptions?.updateAllFuture && transaction.isRecurrent) {
        // Update this and all future transactions
        const { error } = await supabase
          .from('transactions')
          .update(transactionData)
          .eq('parent_transaction_id', transaction.parentTransactionId || transaction.id)
          .gte('date', transaction.date.toISOString());
        
        if (error) throw error;
        
        // Also update the original transaction if this is not it
        if (transaction.parentTransactionId) {
          const { error: origError } = await supabase
            .from('transactions')
            .update(transactionData)
            .eq('id', transaction.parentTransactionId);
          
          if (origError) throw origError;
        }
        
        // Refresh transactions to get updated data
        await fetchTransactions();
      } else {
        // Update only this transaction
        const { error } = await supabase
          .from('transactions')
          .update(transactionData)
          .eq('id', transaction.id);
        
        if (error) throw error;
        
        // Atualizar no estado local
        dispatch({ type: "UPDATE_TRANSACTION", payload: transaction });
      }
    } catch (error: any) {
      console.error("Erro ao atualizar transação:", error);
      toast.error("Erro ao atualizar transação");
      throw error;
    }
  };

  // Excluir uma transação
  const deleteTransaction = async (
    id: string,
    deleteOptions?: { deleteAllFuture?: boolean }
  ) => {
    if (!user) return;
    
    try {
      const transaction = state.transactions.find(t => t.id === id);
      
      if (!transaction) {
        throw new Error("Transação não encontrada");
      }
      
      if (deleteOptions?.deleteAllFuture && transaction.isRecurrent) {
        // Delete this transaction and all future occurrences
        if (transaction.parentTransactionId) {
          // This is a child, delete from this date forward
          const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('parent_transaction_id', transaction.parentTransactionId)
            .gte('date', transaction.date.toISOString());
          
          if (error) throw error;
        } else {
          // This is the original, delete all children
          const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('parent_transaction_id', id);
          
          if (error) throw error;
        }
        
        // Now delete this specific transaction
        const { error: singleError } = await supabase
          .from('transactions')
          .delete()
          .eq('id', id);
        
        if (singleError) throw singleError;
        
        // Refresh to get updated data
        await fetchTransactions();
      } else {
        // Just delete this single transaction
        const { error } = await supabase
          .from('transactions')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        // Remover do estado local
        dispatch({ type: "DELETE_TRANSACTION", payload: id });
      }
    } catch (error: any) {
      console.error("Erro ao excluir transação:", error);
      toast.error("Erro ao excluir transação");
      throw error;
    }
  };

  // Adicionar uma meta
  const addGoal = async (goal: Omit<Goal, "id">) => {
    if (!user) return;
    
    try {
      // Preparar dados para o Supabase
      const goalData = {
        user_id: user.id,
        title: goal.title,
        target: goal.target,
        current: goal.current || 0,
        type: goal.type,
        period: goal.period,
        start_date: goal.startDate.toISOString(),
        end_date: goal.endDate.toISOString()
      };
      
      // Inserir no Supabase
      const { data, error } = await supabase
        .from('goals')
        .insert(goalData)
        .select()
        .single();
      
      if (error) throw error;
      
      // Adicionar ao estado local
      const newGoal = mapGoalFromDB(data);
      dispatch({ type: "ADD_GOAL", payload: newGoal });
    } catch (error: any) {
      console.error("Erro ao adicionar meta:", error);
      toast.error("Erro ao salvar meta");
      throw error;
    }
  };

  // Atualizar uma meta
  const updateGoal = async (goal: Goal) => {
    if (!user) return;
    
    try {
      // Preparar dados para o Supabase
      const goalData = {
        title: goal.title,
        target: goal.target,
        current: goal.current,
        type: goal.type,
        period: goal.period,
        start_date: goal.startDate.toISOString(),
        end_date: goal.endDate.toISOString()
      };
      
      // Atualizar no Supabase
      const { error } = await supabase
        .from('goals')
        .update(goalData)
        .eq('id', goal.id);
      
      if (error) throw error;
      
      // Atualizar no estado local
      dispatch({ type: "UPDATE_GOAL", payload: goal });
    } catch (error: any) {
      console.error("Erro ao atualizar meta:", error);
      toast.error("Erro ao atualizar meta");
      throw error;
    }
  };

  // Enhanced deleteGoal with better error handling
  const deleteGoal = async (id: string) => {
    if (!user) return;
    
    try {
      console.log("Deleting goal:", id);
      
      // Excluir do Supabase
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Supabase error deleting goal:", error);
        throw error;
      }
      
      // Remover do estado local
      dispatch({ type: "DELETE_GOAL", payload: id });
      console.log("Goal deleted successfully");
    } catch (error: any) {
      console.error("Error deleting goal:", error);
      toast.error("Erro ao excluir meta");
      throw error;
    }
  };

  // Marcar alerta como lido
  const markAlertRead = async (id: string) => {
    if (!user) return;
    
    try {
      // Atualizar no Supabase
      const { error } = await supabase
        .from('alerts')
        .update({ read: true })
        .eq('id', id);
      
      if (error) throw error;
      
      // Atualizar no estado local
      dispatch({ type: "MARK_ALERT_READ", payload: id });
    } catch (error: any) {
      console.error("Erro ao marcar alerta como lido:", error);
      throw error;
    }
  };
  
  // Marcar notificação como lida
  const markNotificationRead = async (id: string) => {
    if (!user) return;
    
    try {
      // Atualizar no Supabase
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
      
      if (error) throw error;
      
      // Atualizar no estado local
      dispatch({ type: "MARK_NOTIFICATION_READ", payload: id });
    } catch (error: any) {
      console.error("Erro ao marcar notificação como lida:", error);
      throw error;
    }
  };
  
  // Verificar se há notificações não lidas
  const hasUnreadNotifications = () => {
    return state.notifications.some(notification => !notification.isRead);
  };

  // Carregar dados quando o usuário estiver autenticado
  useEffect(() => {
    if (user) {
      // Log that we're loading data for this user
      console.log("Loading data for user:", user.id);
      
      // Load initial data
      fetchTransactions();
      fetchGoals();
      fetchAlerts();
      fetchNotifications();
      
      // Configurar assinaturas de tempo real para atualizações
      const transactionsChannel = supabase
        .channel('public:transactions')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${user.id}` }, 
          (payload) => {
            console.log('Mudança em transações:', payload);
            fetchTransactions();
          }
        )
        .subscribe();
        
      const goalsChannel = supabase
        .channel('public:goals')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'goals', filter: `user_id=eq.${user.id}` }, 
          (payload) => {
            console.log('Mudança em metas:', payload);
            fetchGoals();
          }
        )
        .subscribe();
        
      const alertsChannel = supabase
        .channel('public:alerts')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'alerts', filter: `user_id=eq.${user.id}` }, 
          (payload) => {
            console.log('Mudança em alertas:', payload);
            fetchAlerts();
          }
        )
        .subscribe();
        
      const notificationsChannel = supabase
        .channel('public:notifications')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, 
          (payload) => {
            console.log('Mudança em notificações:', payload);
            fetchNotifications();
          }
        )
        .subscribe();
      
      // Limpar assinaturas ao desmontar
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

  // Filter transactions based on current filter
  const getFilteredTransactions = () => {
    const { startDate, endDate, type, category, searchTerm } = state.currentFilter;
    
    return state.transactions.filter(transaction => {
      // Date range filter
      if (startDate && transaction.date < startDate) return false;
      if (endDate && transaction.date > endDate) return false;
      
      // Type filter
      if (type && transaction.type !== type) return false;
      
      // Category filter
      if (category && transaction.category !== category) return false;
      
      // Search term filter
      if (
        searchTerm &&
        !transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!transaction.contact || !transaction.contact.toLowerCase().includes(searchTerm.toLowerCase()))
      ) {
        return false;
      }
      
      return true;
    });
  };

  // Calculate total income for a specific period
  const getTotalIncome = (period?: 'today' | 'week' | 'month' | 'year') => {
    const now = new Date();
    const transactions = state.transactions.filter(t => t.type === TransactionType.INCOME);
    
    if (!period) {
      return transactions.reduce((total, t) => total + t.amount, 0);
    }
    
    return transactions.filter(t => {
      const transDate = new Date(t.date);
      
      switch (period) {
        case 'today':
          return (
            transDate.getDate() === now.getDate() &&
            transDate.getMonth() === now.getMonth() &&
            transDate.getFullYear() === now.getFullYear()
          );
        case 'week':
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay());
          return transDate >= weekStart;
        case 'month':
          return (
            transDate.getMonth() === now.getMonth() &&
            transDate.getFullYear() === now.getFullYear()
          );
        case 'year':
          return transDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    }).reduce((total, t) => total + t.amount, 0);
  };

  // Calculate total expense for a specific period
  const getTotalExpense = (period?: 'today' | 'week' | 'month' | 'year') => {
    const now = new Date();
    const transactions = state.transactions.filter(t => t.type === TransactionType.EXPENSE);
    
    if (!period) {
      return transactions.reduce((total, t) => total + t.amount, 0);
    }
    
    return transactions.filter(t => {
      const transDate = new Date(t.date);
      
      switch (period) {
        case 'today':
          return (
            transDate.getDate() === now.getDate() &&
            transDate.getMonth() === now.getMonth() &&
            transDate.getFullYear() === now.getFullYear()
          );
        case 'week':
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay());
          return transDate >= weekStart;
        case 'month':
          return (
            transDate.getMonth() === now.getMonth() &&
            transDate.getFullYear() === now.getFullYear()
          );
        case 'year':
          return transDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    }).reduce((total, t) => total + t.amount, 0);
  };

  // Calculate current balance
  const getCurrentBalance = () => {
    return getTotalIncome() - getTotalExpense();
  };

  return (
    <FinanceContext.Provider
      value={{
        state,
        dispatch,
        getFilteredTransactions,
        getTotalIncome,
        getTotalExpense,
        getCurrentBalance,
        fetchTransactions,
        fetchGoals,
        fetchAlerts,
        fetchNotifications,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addGoal,
        updateGoal,
        deleteGoal,
        markAlertRead,
        markNotificationRead,
        hasUnreadNotifications
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
