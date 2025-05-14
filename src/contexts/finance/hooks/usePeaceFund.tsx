
import { useAuth } from "@/contexts/AuthContext";
import { 
  fetchOrCreatePeaceFund, 
  updatePeaceFundSettings,
  addPeaceFundTransaction,
  fetchPeaceFundTransactions as fetchPeaceFundTxs,
  fetchMonthlyEvolution
} from "../peaceFundService";
import { FinanceAction } from "../types";
import { PeaceFund, PeaceFundTransaction } from "@/types";

export const usePeaceFund = (user: any | null, dispatch: React.Dispatch<FinanceAction>) => {
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
        const transactions = await fetchPeaceFundTxs(fund.id);
        
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

  const fetchPeaceFundTransactions = async () => {
    if (!user) return;

    // Utilizando state diretamente do contexto atual
    const state = await import("@/contexts/FinanceContext").then(module => {
      const { useFinance } = module;
      const { state } = useFinance();
      return state;
    });
    
    if (!state.peaceFund) return;

    try {
      const transactions = await fetchPeaceFundTxs(state.peaceFund.id);
      
      dispatch({
        type: "SET_PEACE_FUND_TRANSACTIONS",
        payload: transactions
      });
    } catch (error) {
      console.error("Erro ao buscar transações do fundo:", error);
    }
  };

  const addPeaceFundTx = async (transaction: {
    amount: number;
    description: string;
    type: 'deposit' | 'withdrawal';
    date?: Date | string;
  }) => {
    if (!user || !user.id) return;
    
    // Utilizando state diretamente do contexto atual
    const state = await import("@/contexts/FinanceContext").then(module => {
      const { useFinance } = module;
      const { state } = useFinance();
      return state;
    });
    
    if (!state.peaceFund) return;
    
    try {
      const newTransaction = await addPeaceFundTransaction({
        peace_fund_id: state.peaceFund.id,
        user_id: user.id,
        amount: transaction.amount,
        description: transaction.description,
        type: transaction.type,
        date: transaction.date
      });
      
      if (newTransaction) {
        dispatch({
          type: "ADD_PEACE_FUND_TRANSACTION",
          payload: newTransaction
        });
        
        // Atualizar o saldo atual do fundo após a transação
        const updatedFund = await fetchOrCreatePeaceFund(user.id);
        
        if (updatedFund) {
          dispatch({
            type: "SET_PEACE_FUND",
            payload: updatedFund
          });
        }
      }
    } catch (error) {
      console.error("Erro ao adicionar transação:", error);
    }
  };

  const updatePeaceFundConfig = async (settings: {
    target_amount?: number;
    minimum_alert_amount?: number | null;
  }) => {
    if (!user || !user.id) return;
    
    // Utilizando state diretamente do contexto atual
    const state = await import("@/contexts/FinanceContext").then(module => {
      const { useFinance } = module;
      const { state } = useFinance();
      return state;
    });
    
    if (!state.peaceFund) return;
    
    try {
      const updatedFund = await updatePeaceFundSettings(state.peaceFund.id, settings);
      
      if (updatedFund) {
        dispatch({
          type: "SET_PEACE_FUND",
          payload: updatedFund
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar configurações do fundo:", error);
    }
  };

  const getPeaceFundMonthlyData = async () => {
    if (!user) return [];
    
    // Utilizando state diretamente do contexto atual
    const state = await import("@/contexts/FinanceContext").then(module => {
      const { useFinance } = module;
      const { state } = useFinance();
      return state;
    });
    
    if (!state.peaceFund) return [];
    
    try {
      const monthlyData = await fetchMonthlyEvolution(state.peaceFund.id);
      return monthlyData;
    } catch (error) {
      console.error("Erro ao buscar dados mensais:", error);
      return [];
    }
  };

  return {
    fetchPeaceFund,
    fetchPeaceFundTransactions,
    addPeaceFundTransaction: addPeaceFundTx,
    updatePeaceFundSettings: updatePeaceFundConfig,
    getPeaceFundMonthlyData
  };
};
