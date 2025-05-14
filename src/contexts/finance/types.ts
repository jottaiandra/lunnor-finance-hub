import { Transaction, Goal, PeaceFund, PeaceFundTransaction } from "@/types";

export interface FinanceState {
  transactions: Transaction[];
  goals: Goal[];
  alerts: Alert[];
  notifications: Notification[];
  peaceFund: PeaceFund | null;
  peaceFundTransactions: PeaceFundTransaction[];
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
    peaceFund: boolean;
  };
  error: string | null;
}

export type FinanceAction =
  | { type: "SET_TRANSACTIONS"; payload: Transaction[] }
  | { type: "SET_GOALS"; payload: Goal[] }
  | { type: "SET_ALERTS"; payload: Alert[] }
  | { type: "SET_NOTIFICATIONS"; payload: Notification[] }
  | { type: "SET_PEACE_FUND"; payload: PeaceFund | null }
  | { type: "SET_PEACE_FUND_TRANSACTIONS"; payload: PeaceFundTransaction[] }
  | { type: "ADD_TRANSACTION"; payload: Transaction }
  | { type: "UPDATE_TRANSACTION"; payload: Transaction }
  | { type: "DELETE_TRANSACTION"; payload: string }
  | { type: "ADD_GOAL"; payload: Goal }
  | { type: "UPDATE_GOAL"; payload: Goal }
  | { type: "DELETE_GOAL"; payload: string }
  | { type: "ADD_PEACE_FUND_TRANSACTION"; payload: PeaceFundTransaction }
  | { type: "UPDATE_PEACE_FUND"; payload: Partial<PeaceFund> }
  | { type: "MARK_ALERT_READ"; payload: string }
  | { type: "MARK_NOTIFICATION_READ"; payload: string }
  | { type: "SET_FILTER"; payload: Partial<FinanceState["currentFilter"]> }
  | { type: "SET_LOADING"; payload: { key: keyof FinanceState["loading"]; value: boolean } }
  | { type: "SET_ERROR"; payload: string | null };

export interface FinanceContextType {
  state: FinanceState;
  dispatch: React.Dispatch<FinanceAction>;
  getFilteredTransactions: () => Transaction[];
  getTotalIncome: (period?: string) => number;
  getTotalExpense: (period?: string) => number;
  getCurrentBalance: () => number;
  fetchTransactions: () => Promise<void>;
  fetchGoals: () => Promise<void>;
  fetchAlerts: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  fetchPeaceFund: () => Promise<void>;
  fetchPeaceFundTransactions: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, "id" | "user_id" | "created_at">) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addGoal: (goal: Omit<Goal, "id" | "user_id" | "created_at">) => Promise<Goal | null>;
  updateGoal: (goal: Goal) => Promise<Goal | null>;
  deleteGoal: (id: string) => Promise<void>;
  addPeaceFundTransaction: (transaction: {
    amount: number;
    description: string;
    type: 'deposit' | 'withdrawal';
    date?: Date | string;
  }) => Promise<void>;
  updatePeaceFundSettings: (settings: {
    target_amount?: number;
    minimum_alert_amount?: number | null;
  }) => Promise<void>;
  markAlertRead: (id: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  hasUnreadNotifications: () => boolean;
}
