
import { useAuth } from "@/contexts/AuthContext";
import { PeaceFundTransaction, PeaceFundTransactionType } from "@/types";
import { FinanceAction } from "../../types";
import { addTransaction } from "../../services/peaceFund/addTransaction";
import { fetchPeaceFund } from "../../services/peaceFund/fetchPeaceFund";

type AddTransactionParams = {
  amount: number;
  description: string;
  type: PeaceFundTransactionType;
  date?: Date;
};

/**
 * Hook para operações de transação do fundo de paz
 */
export const useTransactionOperations = (user: any | null, dispatch: React.Dispatch<FinanceAction>) => {
  /**
   * Adiciona uma nova transação ao fundo de paz
   */
  const addPeaceFundTransaction = async (params: AddTransactionParams): Promise<PeaceFundTransaction | null> => {
    if (!user) return null;
    
    try {
      const { state } = await import("@/contexts/FinanceContext").then(module => {
        return { state: module.useFinance() ? module.useFinance().state : null };
      });
      
      if (!state || !state.peaceFund) {
        // Se o fundo de paz não estiver carregado, carregue-o primeiro
        await fetchPeaceFund(user.id, dispatch);
        
        // Obtenha o estado novamente após o carregamento
        const { state: refreshedState } = await import("@/contexts/FinanceContext").then(module => {
          return { state: module.useFinance() ? module.useFinance().state : null };
        });
        
        if (!refreshedState || !refreshedState.peaceFund) {
          throw new Error("Não foi possível carregar o fundo de paz");
        }
        
        // Adicionar a transação usando o fundo recém-carregado
        const transaction = await addTransaction({
          peace_fund_id: refreshedState.peaceFund.id,
          user_id: user.id,
          amount: params.amount,
          description: params.description,
          type: params.type,
          date: params.date
        }, dispatch);
        
        return transaction;
      }
      
      // Adicionar a transação usando o fundo já carregado
      const transaction = await addTransaction({
        peace_fund_id: state.peaceFund.id,
        user_id: user.id,
        amount: params.amount,
        description: params.description,
        type: params.type,
        date: params.date
      }, dispatch);
      
      return transaction;
    } catch (error) {
      console.error("Erro ao adicionar transação ao fundo de paz:", error);
      return null;
    }
  };
  
  return {
    addPeaceFundTransaction
  };
};
