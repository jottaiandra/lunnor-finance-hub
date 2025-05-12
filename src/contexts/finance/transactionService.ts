import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types";
import { mapTransactionFromDB } from "./mappers";
import { calculateNextOccurrenceDate } from "./dateUtils";
import { toast } from "@/components/ui/sonner";

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

// Send webhook to Make
export const sendTransactionWebhook = async (
  transaction: Transaction,
  userId: string
) => {
  try {
    // Get user profile data to include in the webhook
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('first_name, last_name, phone_number')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.error("Erro ao buscar dados do usuário para webhook:", profileError);
      return false;
    }
    
    // Format the data for the webhook
    const webhookData = {
      nome: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim(),
      tipo: transaction.type === 'income' ? 'receita' : 'despesa',
      valor: transaction.amount,
      descricao: transaction.description,
      data: new Date(transaction.date).toISOString().split('T')[0], // Format as YYYY-MM-DD
      telefone: profileData.phone_number || ''
    };
    
    // Send the webhook to Make
    const webhookUrl = 'https://hook.us2.make.com/xvkee5kj7au6i85tb8yvrv682kau9fxm';
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData),
    });
    
    if (!response.ok) {
      console.error('Erro ao enviar webhook para o Make:', response.status, response.statusText);
      return false;
    }
    
    console.log('Webhook enviado com sucesso para o Make:', webhookData);
    return true;
  } catch (error) {
    console.error('Erro ao enviar webhook para o Make:', error);
    return false;
  }
};

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
    sendTransactionWebhook(newTransaction, userId);
    
    return newTransaction;
  } catch (error: any) {
    console.error("Erro ao adicionar transação:", error);
    toast.error("Erro ao salvar transação");
    throw error;
  }
};

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

// Get filtered transactions based on filter criteria
export const getFilteredTransactions = (state: any) => {
  const { transactions, currentFilter } = state;
  const { startDate, endDate, type, category, searchTerm } = currentFilter;
  
  return transactions.filter((transaction: Transaction) => {
    // Date range filter
    if (startDate && transaction.date < startDate) return false;
    if (endDate && transaction.date > endDate) return false;
    
    // Type filter
    if (type && transaction.type !== type) return false;
    
    // Category filter
    if (category && transaction.category !== category) return false;
    
    // Search term filter
    if (
      searchTerm &&
      !transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!transaction.contact || !transaction.contact.toLowerCase().includes(searchTerm.toLowerCase()))
    ) {
      return false;
    }
    
    return true;
  });
};
