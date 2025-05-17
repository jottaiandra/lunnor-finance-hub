
import { supabase } from "@/integrations/supabase/client";
import { PeaceFundTransaction, PeaceFundTransactionType } from "@/types";
import { FinanceAction } from "../../types";
import { toast } from "@/components/ui/sonner";

// Add transaction to peace fund
export const addPeaceFundTransaction = async (
  peaceFundId: string,
  transaction: {
    amount: number;
    description: string;
    type: PeaceFundTransactionType;
    date?: Date | string;
  },
  userId: string,
  dispatch: React.Dispatch<FinanceAction>
): Promise<PeaceFundTransaction | null> => {
  try {
    const transactionData = {
      peace_fund_id: peaceFundId,
      user_id: userId,
      amount: transaction.amount,
      description: transaction.description,
      type: transaction.type,
      date: transaction.date instanceof Date ? transaction.date.toISOString() : 
            transaction.date ? transaction.date : new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('peace_fund_transactions')
      .insert(transactionData)
      .select()
      .single();

    if (error) {
      console.error('Erro ao adicionar transação ao fundo:', error);
      toast.error('Erro ao processar transação');
      return null;
    }

    const newTransaction: PeaceFundTransaction = {
      id: data.id,
      peace_fund_id: data.peace_fund_id,
      user_id: data.user_id,
      amount: data.amount,
      description: data.description,
      type: data.type as PeaceFundTransactionType,
      date: new Date(data.date),
      created_at: new Date(data.created_at)
    };

    // Add the transaction to the state
    dispatch({
      type: "ADD_PEACE_FUND_TRANSACTION",
      payload: newTransaction
    });

    toast.success(
      transaction.type === 'deposit' 
        ? '🌱 Depósito realizado com sucesso!\nSeu Fundo de Paz está crescendo — continue cuidando do seu futuro com sabedoria.' 
        : '💸 Saque efetuado com sucesso!\nTudo certo, o importante é saber que você tem um fundo para os momentos que realmente importam.'
    );

    return newTransaction;
  } catch (error) {
    console.error('Erro inesperado ao adicionar transação:', error);
    toast.error('Erro ao processar transação');
    return null;
  }
};
