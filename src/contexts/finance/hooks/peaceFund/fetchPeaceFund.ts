
import { useAuth } from "@/contexts/AuthContext";
import { fetchOrCreatePeaceFund } from "../../services/peaceFund/fetchOrCreatePeaceFund";
import { fetchTransactions } from "../../services/peaceFund/fetchTransactions";
import { FinanceAction } from "../../types";
import { PeaceFund } from "@/types";

/**
 * Hook para buscar o fundo de paz e suas transações
 */
export const useFetchPeaceFund = (user: any | null, dispatch: React.Dispatch<FinanceAction>) => {
  /**
   * Busca o fundo de paz do usuário atual
   */
  const fetchPeaceFund = async () => {
    if (!user) return;

    dispatch({ type: "SET_LOADING", payload: { key: "peaceFund", value: true } });

    try {
      const fund = await fetchOrCreatePeaceFund(user.id);
      
      dispatch({
        type: "SET_PEACE_FUND",
        payload: fund
      });
      
      // Se o fundo foi encontrado, busque também as transações
      if (fund) {
        const transactions = await fetchTransactions(fund.id);
        
        dispatch({
          type: "SET_PEACE_FUND_TRANSACTIONS",
          payload: transactions
        });
      }
    } catch (error) {
      console.error("Erro ao buscar fundo de paz:", error);
      dispatch({
        type: "SET_ERROR",
        payload: "Erro ao carregar dados do fundo de paz."
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: { key: "peaceFund", value: false } });
    }
  };

  /**
   * Busca apenas as transações do fundo de paz
   */
  const fetchPeaceFundTransactions = async () => {
    if (!user) return;

    try {
      const { state } = await import("@/contexts/FinanceContext").then(module => {
        return { state: module.useFinance() ? module.useFinance().state : null };
      });
      
      if (!state || !state.peaceFund) return;

      const transactions = await fetchTransactions(state.peaceFund.id);
      
      dispatch({
        type: "SET_PEACE_FUND_TRANSACTIONS",
        payload: transactions
      });
    } catch (error) {
      console.error("Erro ao buscar transações do fundo:", error);
    }
  };

  return {
    fetchPeaceFund,
    fetchPeaceFundTransactions
  };
};
