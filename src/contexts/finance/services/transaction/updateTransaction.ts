
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types";
import { mapTransactionFromDB } from "../../mappers";
import { toast } from "@/components/ui/sonner";

// Update a transaction
export const updateTransaction = async (
  transaction: Transaction, 
  userId: string, 
  dispatch: any,
  updateOptions?: { updateAllFuture?: boolean }
): Promise<Transaction | null> => { // Make return type explicit
  if (!userId) return null;
  
  try {
    // Prepare data for Supabase
    const transactionData = {
      date: typeof transaction.date === 'string' ? transaction.date : transaction.date.toISOString(),
      description: transaction.description,
      amount: transaction.amount,
      category: transaction.category,
      payment_method: transaction.payment_method,
      type: transaction.type,
      contact: transaction.contact || null,
      is_recurrent: transaction.is_recurrent || false,
      recurrence_frequency: transaction.recurrence_frequency || null,
      recurrence_interval: transaction.recurrence_interval || null,
      recurrence_start_date: transaction.recurrence_start_date ? 
        (typeof transaction.recurrence_start_date === 'string' ? 
          transaction.recurrence_start_date : 
          transaction.recurrence_start_date.toISOString()) : 
        null,
      recurrence_end_date: transaction.recurrence_end_date ? 
        (typeof transaction.recurrence_end_date === 'string' ? 
          transaction.recurrence_end_date : 
          transaction.recurrence_end_date.toISOString()) : 
        null,
    };
    
    // Update in Supabase
    let query = supabase
      .from('transactions')
      .update(transactionData);
    
    // If this is a recurring transaction update and user wants to update all future occurrences
    if (transaction.is_recurrent && updateOptions?.updateAllFuture) {
      // Get base date for comparison (today or transaction date)
      const baseDate = typeof transaction.date === 'string' ? 
        transaction.date : 
        transaction.date.toISOString();
      const parentId = transaction.parent_transaction_id || transaction.id;
      
      query = query.or(`id.eq.${transaction.id},and(parent_transaction_id.eq.${parentId},date.gte.${baseDate})`);
    } else {
      // Standard update for single transaction
      query = query.eq('id', transaction.id);
    }
    
    // Execute the query
    const { data, error } = await query.select().single();
    
    if (error) throw error;
    
    // Update local state
    const updatedTransaction = mapTransactionFromDB(data);
    dispatch({ type: "UPDATE_TRANSACTION", payload: updatedTransaction });
    
    toast.success("Transação atualizada com sucesso");
    return updatedTransaction; // Return the updated transaction
  } catch (error: any) {
    console.error("Erro ao atualizar transação:", error);
    toast.error("Erro ao atualizar transação");
    return null; // Return null on error
  }
};
