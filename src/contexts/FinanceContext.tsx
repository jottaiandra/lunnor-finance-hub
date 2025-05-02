
import React, { createContext, useContext, useReducer, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Transaction, TransactionType, PaymentMethod, IncomeCategory, ExpenseCategory, Goal, Alert } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

type State = {
  transactions: Transaction[];
  goals: Goal[];
  alerts: Alert[];
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
  };
  error: string | null;
};

type Action =
  | { type: "SET_TRANSACTIONS"; payload: Transaction[] }
  | { type: "SET_GOALS"; payload: Goal[] }
  | { type: "SET_ALERTS"; payload: Alert[] }
  | { type: "ADD_TRANSACTION"; payload: Transaction }
  | { type: "UPDATE_TRANSACTION"; payload: Transaction }
  | { type: "DELETE_TRANSACTION"; payload: string }
  | { type: "ADD_GOAL"; payload: Goal }
  | { type: "UPDATE_GOAL"; payload: Goal }
  | { type: "DELETE_GOAL"; payload: string }
  | { type: "MARK_ALERT_READ"; payload: string }
  | { type: "SET_FILTER"; payload: Partial<State["currentFilter"]> }
  | { type: "SET_LOADING"; payload: { key: 'transactions' | 'goals' | 'alerts', value: boolean } }
  | { type: "SET_ERROR"; payload: string | null };

const initialState: State = {
  transactions: [],
  goals: [],
  alerts: [],
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
    alerts: false
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
  addTransaction: (transaction: Omit<Transaction, "id">) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addGoal: (goal: Omit<Goal, "id">) => Promise<void>;
  updateGoal: (goal: Goal) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  markAlertRead: (id: string) => Promise<void>;
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
  addTransaction: async () => {},
  updateTransaction: async () => {},
  deleteTransaction: async () => {},
  addGoal: async () => {},
  updateGoal: async () => {},
  deleteGoal: async () => {},
  markAlertRead: async () => {}
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
    contact: item.contact
  });

  const mapGoalFromDB = (item: any): Goal => ({
    id: item.id,
    title: item.title,
    target: Number(item.target),
    current: Number(item.current),
    type: item.type as 'income' | 'expense-reduction',
    period: item.period as 'weekly' | 'monthly' | 'yearly',
    startDate: new Date(item.start_date),
    endDate: new Date(item.end_date)
  });

  const mapAlertFromDB = (item: any): Alert => ({
    id: item.id,
    message: item.message,
    type: item.type as 'warning' | 'info' | 'success' | 'danger',
    read: item.read,
    createdAt: new Date(item.created_at)
  });

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

  // Função para buscar metas
  const fetchGoals = async () => {
    if (!user) return;
    
    try {
      dispatch({ type: "SET_LOADING", payload: { key: 'goals', value: true } });
      
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const mappedGoals = data.map(mapGoalFromDB);
      dispatch({ type: "SET_GOALS", payload: mappedGoals });
    } catch (error: any) {
      console.error("Erro ao buscar metas:", error);
      toast.error("Erro ao carregar metas");
      dispatch({ type: "SET_ERROR", payload: error.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: { key: 'goals', value: false } });
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
        contact: transaction.contact || null
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
    } catch (error: any) {
      console.error("Erro ao adicionar transação:", error);
      toast.error("Erro ao salvar transação");
      throw error;
    }
  };

  // Atualizar uma transação
  const updateTransaction = async (transaction: Transaction) => {
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
        contact: transaction.contact || null
      };
      
      // Atualizar no Supabase
      const { error } = await supabase
        .from('transactions')
        .update(transactionData)
        .eq('id', transaction.id);
      
      if (error) throw error;
      
      // Atualizar no estado local
      dispatch({ type: "UPDATE_TRANSACTION", payload: transaction });
    } catch (error: any) {
      console.error("Erro ao atualizar transação:", error);
      toast.error("Erro ao atualizar transação");
      throw error;
    }
  };

  // Excluir uma transação
  const deleteTransaction = async (id: string) => {
    if (!user) return;
    
    try {
      // Excluir do Supabase
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Remover do estado local
      dispatch({ type: "DELETE_TRANSACTION", payload: id });
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

  // Excluir uma meta
  const deleteGoal = async (id: string) => {
    if (!user) return;
    
    try {
      // Excluir do Supabase
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Remover do estado local
      dispatch({ type: "DELETE_GOAL", payload: id });
    } catch (error: any) {
      console.error("Erro ao excluir meta:", error);
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

  // Carregar dados quando o usuário estiver autenticado
  useEffect(() => {
    if (user) {
      fetchTransactions();
      fetchGoals();
      fetchAlerts();
      
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
      
      // Limpar assinaturas ao desmontar
      return () => {
        supabase.removeChannel(transactionsChannel);
        supabase.removeChannel(goalsChannel);
        supabase.removeChannel(alertsChannel);
      };
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
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addGoal,
        updateGoal,
        deleteGoal,
        markAlertRead
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
