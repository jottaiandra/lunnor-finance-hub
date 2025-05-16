
import { supabase } from "@/integrations/supabase/client";
import { PeaceFundTransaction } from "@/types";
import { mapDatabaseTransactionToFrontend } from "./mappers";

/**
 * Obter histórico de transações do fundo
 */
export const fetchTransactions = async (
  fundId: string, 
  limit = 50
): Promise<PeaceFundTransaction[]> => {
  try {
    const { data, error } = await supabase
      .from('peace_fund_transactions')
      .select('*')
      .eq('peace_fund_id', fundId)
      .order('date', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Erro ao buscar transações do fundo:', error);
      return [];
    }

    return data.map(mapDatabaseTransactionToFrontend);
  } catch (error) {
    console.error('Erro inesperado ao buscar transações:', error);
    return [];
  }
};
