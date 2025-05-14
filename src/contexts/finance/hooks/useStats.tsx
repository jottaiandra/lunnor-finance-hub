
import { useCallback } from "react";
import { 
  getFilteredTransactions,
  getTotalIncome,
  getTotalExpense,
  getCurrentBalance,
  getGoalProgress
} from "../statsService";

export function useStats(state: any) {
  const handleGetFilteredTransactions = useCallback(() => {
    return getFilteredTransactions(state.transactions, state.currentFilter);
  }, [state.transactions, state.currentFilter]);

  const handleGetTotalIncome = useCallback(() => {
    return getTotalIncome(state.transactions);
  }, [state.transactions]);

  const handleGetTotalExpense = useCallback(() => {
    return getTotalExpense(state.transactions);
  }, [state.transactions]);

  const handleGetCurrentBalance = useCallback(() => {
    return getCurrentBalance(state.transactions);
  }, [state.transactions]);

  const handleGetGoalProgress = useCallback((goalId: string) => {
    const goal = state.goals.find((g: any) => g.id === goalId);
    return goal ? getGoalProgress(goal, state.transactions) : 0;
  }, [state.goals, state.transactions]);

  return {
    getFilteredTransactions: handleGetFilteredTransactions,
    getTotalIncome: handleGetTotalIncome,
    getTotalExpense: handleGetTotalExpense,
    getCurrentBalance: handleGetCurrentBalance,
    getGoalProgress: handleGetGoalProgress
  };
}
