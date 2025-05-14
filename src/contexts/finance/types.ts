
import { Goal, PeaceFund, PeaceFundTransaction, Transaction } from "@/types";

// Define the Alert type
export interface Alert {
  id: string;
  user_id: string;
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isRead: boolean;
  created_at: string;
}

// Define the Notification type
export interface Notification {
  id: string;
  user_id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface FinanceState {
  transactions: Transaction[];
  goals: Goal[];
  peaceFund: PeaceFund | null;
  peaceFundTransactions: PeaceFundTransaction[];
  currentFilter: {
    startDate: Date | null;
    endDate: Date | null;
    type: string | null;
    category: string | null;
    searchTerm: string;
  };
  alerts: Alert[];
  notifications: Notification[];
  loading: {
    [key: string]: boolean;
  };
  error: string | null;
}

export interface FinanceContextType {
  state: FinanceState;
  dispatch: React.Dispatch<any>;
  getFilteredTransactions: () => Transaction[];
  getTotalIncome: () => number;
  getTotalExpense: () => number;
  getCurrentBalance: () => number;
  fetchTransactions: () => Promise<void>;
  fetchGoals: () => Promise<void>;
  fetchAlerts: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  fetchPeaceFund: () => Promise<void>;
  fetchPeaceFundTransactions: () => Promise<void>;
  getPeaceFundMonthlyData: () => Promise<any[]>;
  addTransaction: (transaction: Omit<Transaction, "id" | "user_id" | "created_at">) => Promise<Transaction | null>;
  updateTransaction: (transaction: Transaction) => Promise<Transaction | null>;
  deleteTransaction: (id: string, deleteOptions?: { deleteAllFuture?: boolean }) => Promise<void>;
  addGoal: (goal: Omit<Goal, "id" | "user_id" | "created_at">) => Promise<Goal | null>;
  updateGoal: (goal: Goal) => Promise<Goal | null>;
  deleteGoal: (id: string) => Promise<void>;
  addPeaceFundTransaction: (transaction: { amount: number; description: string; type: 'deposit' | 'withdrawal'; date?: Date | string; }) => Promise<void>;
  updatePeaceFundSettings: (settings: { target_amount?: number; monthly_contribution?: number }) => Promise<void>;
  markAlertRead: (id: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  hasUnreadNotifications: () => boolean;
  getGoalProgress?: (goalId: string) => number;
}
