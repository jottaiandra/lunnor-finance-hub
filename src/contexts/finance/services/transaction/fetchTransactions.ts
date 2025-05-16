
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { mapTransactionFromDB } from "../../mappers";

// Fetch transactions from Supabase
export const fetchTransactions = async (userId: string, dispatch: any) => {
  if (!userId) return;
  
  try {
    dispatch({ type: "SET_LOADING", payload: { key: 'transactions', value: true } });
    
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    const mappedTransactions = data.map(mapTransactionFromDB);
    dispatch({ type: "SET_TRANSACTIONS", payload: mappedTransactions });
  } catch (error: any) {
    console.error("Erro ao buscar transações:", error);
    toast.error("Erro ao carregar transações");
    dispatch({ type: "SET_ERROR", payload: error.message });
  } finally {
    dispatch({ type: "SET_LOADING", payload: { key: 'transactions', value: false } });
  }
};
