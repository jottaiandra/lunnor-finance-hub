
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types";
import { mapTransactionFromDB } from "../../mappers";
import { toast } from "@/components/ui/sonner";
import { sendTransactionWebhook } from "./webhooks";

// Add a transaction
export const addTransaction = async (
  transaction: Omit<Transaction, "id">, 
  userId: string, 
  dispatch: any
) => {
  if (!userId) return null;
  
  try {
    // Prepare data for Supabase
    const transactionData = {
      user_id: userId,
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
      is_original: transaction.isOriginal !== false
    };
    
    // Insert into Supabase
    const { data, error } = await supabase
      .from('transactions')
      .insert(transactionData)
      .select()
      .single();
    
    if (error) throw error;
    
    // Add to local state
    const newTransaction = mapTransactionFromDB(data);
    dispatch({ type: "ADD_TRANSACTION", payload: newTransaction });
    
    // Send webhook to Make
    await sendTransactionWebhook(newTransaction, userId);
    
    return newTransaction;
  } catch (error: any) {
    console.error("Erro ao adicionar transação:", error);
    toast.error("Erro ao salvar transação");
    throw error;
  }
};
