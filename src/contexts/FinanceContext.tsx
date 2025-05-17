
import React, { createContext, useContext } from "react";
import { FinanceContextType } from "./finance/types";
import { initialState } from "./finance/reducer";
import { useFinanceProvider } from "./finance/useFinanceProvider";

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
  addGoal: async (goal) => null,
  updateGoal: async (goal) => null,
  deleteGoal: async () => {},
  markAlertRead: async () => {},
  markNotificationRead: async () => {},
  hasUnreadNotifications: () => false
});

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const financeValues = useFinanceProvider();

  return (
    <FinanceContext.Provider value={financeValues}>
      {children}
    </FinanceContext.Provider>
  );
};
