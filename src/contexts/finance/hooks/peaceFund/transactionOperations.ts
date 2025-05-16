
import { toast } from "@/components/ui/sonner";
import { addTransaction } from "../../services/peaceFund/addTransaction";
import { fetchPeaceFund } from "../../services/peaceFund/fetchPeaceFund";
import { fetchTransactions } from "../../services/peaceFund/fetchTransactions";
import { FinanceAction } from "../../types";
import { PeaceFundTransaction, PeaceFundTransactionType } from "@/types";

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
    type: PeaceFundTransactionType;
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
        toast.error("Você não pode sacar mais do que tem no Fundo de Paz.");
        return null;
      }
      
      const newTransaction = await addTransaction(
        {
          peace_fund_id: state.peaceFund.id,
          user_id: user.id,
          amount: transaction.amount,
          description: transaction.description,
          type: transaction.type,
          date: transaction.date || new Date()
        },
        dispatch
      );
      
      if (newTransaction) {
        // Atualizar o saldo atual do fundo após a transação
        const updatedFund = await fetchPeaceFund(user.id);
        
        if (updatedFund) {
          dispatch({
            type: "SET_PEACE_FUND",
            payload: updatedFund
          });
          
          // Atualizar a lista de transações
          const transactions = await fetchTransactions(state.peaceFund.id);
          dispatch({
            type: "SET_PEACE_FUND_TRANSACTIONS",
            payload: transactions
          });
          
          // Mensagem de sucesso personalizada
          if (transaction.type === 'deposit') {
            toast.success(`🌱 Depósito realizado com sucesso!\nSeu Fundo de Paz está crescendo — continue cuidando do seu futuro com sabedoria.`);
          } else {
            toast.success(`💸 Saque efetuado com sucesso!\nTudo certo, o importante é saber que você tem um fundo para os momentos que realmente importam.`);
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
