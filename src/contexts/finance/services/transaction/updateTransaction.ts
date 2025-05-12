
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types";
import { toast } from "@/components/ui/sonner";
import { fetchTransactions } from "./fetchTransactions";

// Update a transaction
export const updateTransaction = async (
  transaction: Transaction,
  userId: string,
  dispatch: any,
  updateOptions?: { updateAllFuture?: boolean }
) => {
  if (!userId) return;
  
  try {
    // Prepare data for Supabase
    const transactionData = {
      date: transaction.date.toISOString(),
      description: transaction.description,
      amount: transaction.amount,
      category: transaction.category,
      payment_method: transaction.paymentMethod,
      type: transaction.type,
      contact: transaction.contact || null,
      is_recurrent: transaction.isRecurrent || false,
      recurrence_frequency: transaction.recurrenceFrequency || null,
      recurrence_interval: transaction.recurrenceInterval || null,
      recurrence_start_date: transaction.recurrenceStartDate ? transaction.recurrenceStartDate.toISOString() : null,
      recurrence_end_date: transaction.recurrenceEndDate ? transaction.recurrenceEndDate.toISOString() : null,
    };
    
    if (updateOptions?.updateAllFuture && transaction.isRecurrent) {
      // Update this and all future transactions
      const { error } = await supabase
        .from('transactions')
        .update(transactionData)
        .eq('parent_transaction_id', transaction.parentTransactionId || transaction.id)
        .gte('date', transaction.date.toISOString());
      
      if (error) throw error;
      
      // Also update the original transaction if this is not it
      if (transaction.parentTransactionId) {
        const { error: origError } = await supabase
          .from('transactions')
          .update(transactionData)
          .eq('id', transaction.parentTransactionId);
        
        if (origError) throw origError;
      }
      
      // Refresh transactions to get updated data
      return fetchTransactions(userId, dispatch);
    } else {
      // Update only this transaction
      const { error } = await supabase
        .from('transactions')
        .update(transactionData)
        .eq('id', transaction.id);
      
      if (error) throw error;
      
      // Update local state
      dispatch({ type: "UPDATE_TRANSACTION", payload: transaction });
    }
  } catch (error: any) {
    console.error("Erro ao atualizar transação:", error);
    toast.error("Erro ao atualizar transação");
    throw error;
  }
};
