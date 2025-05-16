
import { useCallback } from "react";
import { 
  getTotalIncome,
  getTotalExpense,
  getCurrentBalance
} from "../statsService";
import { getFilteredTransactions } from "../services/transaction";

export function useStats(state: any) {
  const handleGetFilteredTransactions = useCallback(() => {
    return getFilteredTransactions(state);
  }, [state]);

  const handleGetTotalIncome = useCallback((period?: 'today' | 'week' | 'month' | 'year') => {
    return getTotalIncome(state.transactions, period);
  }, [state.transactions]);

  const handleGetTotalExpense = useCallback((period?: 'today' | 'week' | 'month' | 'year') => {
    return getTotalExpense(state.transactions, period);
  }, [state.transactions]);

  const handleGetCurrentBalance = useCallback(() => {
    return getCurrentBalance(state.transactions);
  }, [state.transactions]);

  return {
    getFilteredTransactions: handleGetFilteredTransactions,
    getTotalIncome: handleGetTotalIncome,
    getTotalExpense: handleGetTotalExpense,
    getCurrentBalance: handleGetCurrentBalance
  };
}
