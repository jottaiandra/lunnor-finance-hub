
import { Transaction, Goal, Alert, Notification } from "@/types";

export type FinanceState = {
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

export type FinanceAction =
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
  | { type: "SET_FILTER"; payload: Partial<FinanceState["currentFilter"]> }
  | { type: "SET_LOADING"; payload: { key: 'transactions' | 'goals' | 'alerts' | 'notifications', value: boolean } }
  | { type: "SET_ERROR"; payload: string | null };

export interface FinanceContextType {
  state: FinanceState;
  dispatch: React.Dispatch<FinanceAction>;
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
  addGoal: (goal: Omit<Goal, "id">) => Promise<Goal | null>;
  updateGoal: (goal: Goal) => Promise<Goal | null>;
  deleteGoal: (id: string) => Promise<void>;
  markAlertRead: (id: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  hasUnreadNotifications: () => boolean;
}
