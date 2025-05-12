
import { Transaction } from "@/types";
import { calculateNextOccurrenceDate } from "../../dateUtils";
import { supabase } from "@/integrations/supabase/client";
import { mapTransactionFromDB } from "../../mappers";

// Generate future recurring transactions
export const generateRecurringTransactions = async (
  transaction: Transaction, 
  userId: string, 
  dispatch: any,
  count: number = 5
) => {
  if (!userId || !transaction.isRecurrent || !transaction.recurrenceFrequency) return;

  try {
    const futureTransactions = [];
    let currentDate = new Date(transaction.date);
    const endDate = transaction.recurrenceEndDate ? new Date(transaction.recurrenceEndDate) : null;
    
    for (let i = 0; i < count; i++) {
      // Calculate next date in the series
      currentDate = calculateNextOccurrenceDate(
        currentDate, 
        transaction.recurrenceFrequency, 
        transaction.recurrenceInterval
      );
      
      // Stop if we've reached the end date
      if (endDate && currentDate > endDate) break;
      
      // Create a new transaction for this date
      const newTransaction = {
        user_id: userId,
        date: currentDate.toISOString(),
        description: transaction.description,
        amount: transaction.amount,
        category: transaction.category,
        payment_method: transaction.paymentMethod,
        type: transaction.type,
        contact: transaction.contact || null,
        is_recurrent: true,
        recurrence_frequency: transaction.recurrenceFrequency,
        recurrence_interval: transaction.recurrenceInterval,
        recurrence_start_date: transaction.recurrenceStartDate?.toISOString(),
        recurrence_end_date: transaction.recurrenceEndDate?.toISOString(),
        parent_transaction_id: transaction.id,
        is_original: false
      };
      
      futureTransactions.push(newTransaction);
    }
    
    if (futureTransactions.length > 0) {
      const { data, error } = await supabase
        .from('transactions')
        .insert(futureTransactions)
        .select();
      
      if (error) throw error;
      
      // Create a notification for the user
      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          message: `${futureTransactions.length} novas transações recorrentes foram geradas para "${transaction.description}"`,
          type: 'info',
          related_transaction_id: transaction.id,
          is_read: false
        });
        
      // Update the state with new transactions
      if (data) {
        const mappedNewTransactions = data.map(mapTransactionFromDB);
        return mappedNewTransactions;
      }
    }
    
    return [];
  } catch (error) {
    console.error("Erro ao gerar transações recorrentes:", error);
    return [];
  }
};
