
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { mapTransactionFromDB } from "../../mappers";
import { fetchTransactions } from "./fetchTransactions";

// Delete a transaction
export const deleteTransaction = async (
  id: string,
  userId: string,
  dispatch: any,
  deleteOptions?: { deleteAllFuture?: boolean }
) => {
  if (!userId) return;
  
  try {
    // Get the transaction before deleting
    const { data: transactionData } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (!transactionData) {
      throw new Error("Transação não encontrada");
    }
    
    const transaction = mapTransactionFromDB(transactionData);
    
    if (deleteOptions?.deleteAllFuture && transaction.isRecurrent) {
      // Delete this transaction and all future occurrences
      if (transaction.parentTransactionId) {
        // This is a child, delete from this date forward
        const { error } = await supabase
          .from('transactions')
          .delete()
          .eq('parent_transaction_id', transaction.parentTransactionId)
          .gte('date', transaction.date.toISOString());
        
        if (error) throw error;
      } else {
        // This is the original, delete all children
        const { error } = await supabase
          .from('transactions')
          .delete()
          .eq('parent_transaction_id', id);
        
        if (error) throw error;
      }
      
      // Now delete this specific transaction
      const { error: singleError } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
      
      if (singleError) throw singleError;
      
      // Refresh to get updated data
      return fetchTransactions(userId, dispatch);
    } else {
      // Just delete this single transaction
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Remove from local state
      dispatch({ type: "DELETE_TRANSACTION", payload: id });
    }
  } catch (error: any) {
    console.error("Erro ao excluir transação:", error);
    toast.error("Erro ao excluir transação");
    throw error;
  }
};
