
import { supabase } from "@/integrations/supabase/client";
import { PeaceFundTransaction } from "@/types";
import { FinanceAction } from "../../types";

// Fetch peace fund transactions
export const fetchPeaceFundTransactions = async (
  fundId: string,
  userId: string,
  dispatch: React.Dispatch<FinanceAction>,
  limit = 50
): Promise<PeaceFundTransaction[]> => {
  if (!userId || !fundId) return [];

  try {
    dispatch({ type: "SET_LOADING", payload: { key: 'peaceFundTransactions', value: true } });
    
    const { data, error } = await supabase
      .from('peace_fund_transactions')
      .select('*')
      .eq('peace_fund_id', fundId)
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Erro ao buscar transações do fundo:', error);
      return [];
    }

    const transactions: PeaceFundTransaction[] = data.map(tx => ({
      id: tx.id,
      peace_fund_id: tx.peace_fund_id,
      user_id: tx.user_id,
      amount: tx.amount,
      description: tx.description,
      type: tx.type,
      date: new Date(tx.date),
      created_at: new Date(tx.created_at)
    }));

    dispatch({ type: "SET_PEACE_FUND_TRANSACTIONS", payload: transactions });
    return transactions;
  } catch (error) {
    console.error('Erro inesperado ao buscar transações:', error);
    return [];
  } finally {
    dispatch({ type: "SET_LOADING", payload: { key: 'peaceFundTransactions', value: false } });
  }
};
