
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Transaction, TransactionType, PaymentMethod, IncomeCategory, ExpenseCategory, Goal, Alert } from "@/types";

// Sample data
const currentDate = new Date();
const lastMonth = new Date();
lastMonth.setMonth(currentDate.getMonth() - 1);

const sampleTransactions: Transaction[] = [
  {
    id: uuidv4(),
    date: new Date(),
    description: "Venda de Produto",
    amount: 2500,
    category: IncomeCategory.SALES,
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    type: TransactionType.INCOME,
    contact: "Cliente A"
  },
  {
    id: uuidv4(),
    date: new Date(),
    description: "Serviço de Consultoria",
    amount: 1800,
    category: IncomeCategory.SERVICES,
    paymentMethod: PaymentMethod.PIX,
    type: TransactionType.INCOME,
    contact: "Cliente B"
  },
  {
    id: uuidv4(),
    date: new Date(),
    description: "Aluguel",
    amount: 1200,
    category: ExpenseCategory.FIXED,
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    type: TransactionType.EXPENSE,
    contact: "Imobiliária"
  },
  {
    id: uuidv4(),
    date: new Date(),
    description: "Materiais de Escritório",
    amount: 350,
    category: ExpenseCategory.VARIABLE,
    paymentMethod: PaymentMethod.CREDIT_CARD,
    type: TransactionType.EXPENSE,
    contact: "Fornecedor A"
  },
  {
    id: uuidv4(),
    date: lastMonth,
    description: "Fatura de Energia",
    amount: 180,
    category: ExpenseCategory.FIXED,
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    type: TransactionType.EXPENSE,
    contact: "Companhia de Energia"
  },
  {
    id: uuidv4(),
    date: lastMonth,
    description: "Campanha de Marketing",
    amount: 800,
    category: ExpenseCategory.MARKETING,
    paymentMethod: PaymentMethod.CREDIT_CARD,
    type: TransactionType.EXPENSE,
    contact: "Agência de Marketing"
  },
  {
    id: uuidv4(),
    date: lastMonth,
    description: "Vendas Online",
    amount: 3200,
    category: IncomeCategory.SALES,
    paymentMethod: PaymentMethod.PIX,
    type: TransactionType.INCOME,
    contact: "E-commerce"
  }
];

const sampleGoals: Goal[] = [
  {
    id: uuidv4(),
    title: "Meta de Vendas Mensal",
    target: 10000,
    current: 4300,
    type: "income",
    period: "monthly",
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
  },
  {
    id: uuidv4(),
    title: "Redução de Custos Operacionais",
    target: 2000,
    current: 1530,
    type: "expense-reduction",
    period: "monthly",
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
  }
];

const sampleAlerts: Alert[] = [
  {
    id: uuidv4(),
    message: "Despesa acima da média detectada: Campanha de Marketing",
    type: "warning",
    read: false,
    createdAt: new Date()
  },
  {
    id: uuidv4(),
    message: "Meta de vendas está 43% concluída",
    type: "info",
    read: false,
    createdAt: new Date()
  }
];

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
};

type Action =
  | { type: "ADD_TRANSACTION"; payload: Transaction }
  | { type: "UPDATE_TRANSACTION"; payload: Transaction }
  | { type: "DELETE_TRANSACTION"; payload: string }
  | { type: "ADD_GOAL"; payload: Goal }
  | { type: "UPDATE_GOAL"; payload: Goal }
  | { type: "DELETE_GOAL"; payload: string }
  | { type: "MARK_ALERT_READ"; payload: string }
  | { type: "SET_FILTER"; payload: Partial<State["currentFilter"]> };

const initialState: State = {
  transactions: sampleTransactions,
  goals: sampleGoals,
  alerts: sampleAlerts,
  currentFilter: {
    startDate: null,
    endDate: null,
    type: null,
    category: null,
    searchTerm: ""
  }
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
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
}>({
  state: initialState,
  dispatch: () => {},
  getFilteredTransactions: () => [],
  getTotalIncome: () => 0,
  getTotalExpense: () => 0,
  getCurrentBalance: () => 0
});

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

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
        getCurrentBalance
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};
