
import { supabase } from "@/integrations/supabase/client";
import { PeaceFundTransaction } from "@/types";
import { mapDatabaseTransactionToFrontend } from "./mappers";

/**
 * Adicionar transação ao fundo de paz
 */
export const addTransaction = async (transaction: {
  peace_fund_id: string;
  user_id: string;
  amount: number;
  description: string;
  type: 'deposit' | 'withdrawal';
  date?: Date | string;
}): Promise<PeaceFundTransaction | null> => {
  try {
    const transactionData = {
      ...transaction,
      date: transaction.date 
        ? typeof transaction.date === 'string' 
          ? transaction.date 
          : transaction.date.toISOString()
        : new Date().toISOString()
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

    return mapDatabaseTransactionToFrontend(data);
  } catch (error) {
    console.error('Erro inesperado ao adicionar transação:', error);
    return null;
  }
};
