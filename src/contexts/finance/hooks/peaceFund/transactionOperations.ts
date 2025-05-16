
import { toast } from "@/components/ui/sonner";
import { addPeaceFundTransaction as addPeaceFundTransactionService } from "../../services/peaceFund/addPeaceFundTransaction";
import { fetchPeaceFund } from "../../services/peaceFund/fetchPeaceFund";
import { FinanceAction } from "../../types";
import { PeaceFundTransaction } from "@/types";

/**
 * Hook para gerenciar operações de transação do fundo de paz
 */
export const useTransactionOperations = (user: any | null, dispatch: React.Dispatch<FinanceAction>) => {
  /**
   * Adiciona uma nova transação ao fundo de paz
   */
  const addPeaceFundTransaction = async (transaction: {
    amount: number;
    description: string;
    type: 'deposit' | 'withdrawal';
    date?: Date | string;
  }): Promise<PeaceFundTransaction | null> => {
    if (!user || !user.id) {
      toast.error("Usuário não autenticado");
      return null;
    }
    
    try {
      // Importar dinamicamente para evitar referência circular
      const { state } = await import("@/contexts/FinanceContext").then(module => {
        return { state: module.useFinance().state };
      });
      
      if (!state || !state.peaceFund || !state.peaceFund.id) {
        toast.error("Fundo de paz não encontrado");
        return null;
      }
      
      // Verificar se tem saldo suficiente para saque
      if (transaction.type === 'withdrawal' && state.peaceFund.current_amount < transaction.amount) {
        toast.error("Saldo insuficiente para realizar o saque");
        return null;
      }
      
      const newTransaction = await addPeaceFundTransactionService(
        state.peaceFund.id, 
        transaction, 
        user.id, 
        dispatch
      );
      
      if (newTransaction) {
        // Atualizar o saldo atual do fundo após a transação
        const updatedFund = await fetchPeaceFund(user.id, dispatch);
        
        if (updatedFund) {
          dispatch({
            type: "SET_PEACE_FUND",
            payload: updatedFund
          });
          
          // Mensagem de sucesso personalizada
          if (transaction.type === 'deposit') {
            toast.success(`Depósito de R$ ${transaction.amount.toFixed(2)} realizado com sucesso`);
          } else {
            toast.success(`Saque de R$ ${transaction.amount.toFixed(2)} realizado com sucesso`);
          }
        }
      }
      
      return newTransaction;
    } catch (error) {
      console.error("Erro ao adicionar transação:", error);
      toast.error("Erro ao processar a transação");
      return null;
    }
  };

  return {
    addPeaceFundTransaction
  };
};
