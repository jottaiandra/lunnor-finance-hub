
import { supabase } from "@/integrations/supabase/client";
import { PeaceFundTransaction, PeaceFundTransactionType } from "@/types";
import { FinanceAction } from "../../types";

/**
 * Adicionar transação ao fundo de paz
 */
export const addTransaction = async (
  transaction: {
    peace_fund_id: string;
    user_id: string;
    amount: number;
    description: string;
    type: PeaceFundTransactionType;
    date?: Date | string;
  },
  dispatch: React.Dispatch<FinanceAction>
): Promise<PeaceFundTransaction | null> => {
  try {
    const transactionData = {
      ...transaction,
      date: transaction.date instanceof Date 
        ? transaction.date.toISOString() 
        : transaction.date || new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('peace_fund_transactions')
      .insert(transactionData)
      .select('*')
      .single();

    if (error) {
      console.error('Erro ao adicionar transação ao fundo:', error);
      return null;
    }

    if (!data) {
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

    // Adicionar a transação ao estado
    dispatch({
      type: "ADD_PEACE_FUND_TRANSACTION",
      payload: newTransaction
    });

    return newTransaction;
  } catch (error) {
    console.error('Erro inesperado ao adicionar transação:', error);
    return null;
  }
};
