
import { supabase } from '@/integrations/supabase/client';
import { PeaceFundTransaction } from '@/types/peaceFund';
import { mapPeaceFundTransactionFromDB } from './mappers';
import { getUserPeaceFund, updatePeaceFund } from './peaceFundQueries';

// Get peace fund transactions
export async function getPeaceFundTransactions(peaceFundId: string, limit = 100) {
  const { data, error } = await supabase
    .from('peace_fund_transactions')
    .select('*')
    .eq('peace_fund_id', peaceFundId)
    .order('date', { ascending: false })
    .limit(limit);
    
  if (error) {
    console.error('Error fetching peace fund transactions:', error);
    return [];
  }

  console.log('Transações buscadas:', data);
  return data ? data.map(mapPeaceFundTransactionFromDB) : [];
}

// Create a peace fund transaction
export async function createPeaceFundTransaction(
  transactionData: Omit<PeaceFundTransaction, 'id' | 'created_at'>
) {
  // Convert Date objects to ISO strings for Supabase
  const dbTransaction = {
    peace_fund_id: transactionData.peace_fund_id,
    user_id: transactionData.user_id,
    type: transactionData.type,
    amount: transactionData.amount,
    description: transactionData.description,
    date: transactionData.date instanceof Date ? transactionData.date.toISOString() : transactionData.date
  };

  // Create the transaction
  const { data, error } = await supabase
    .from('peace_fund_transactions')
    .insert([dbTransaction])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating peace fund transaction:', error);
    throw error;
  }

  const transaction = mapPeaceFundTransactionFromDB(data);
  
  // Update the peace fund balance - this will call the database trigger to update the balance
  // We also force an update here to make sure the current amount is reflected in the UI
  const { peace_fund_id, type, amount } = transaction;
  
  // Get the current peace fund
  const { data: peaceFundData, error: peaceFundError } = await supabase
    .from('peace_funds')
    .select('*')
    .eq('id', peace_fund_id)
    .single();
  
  if (peaceFundError) {
    console.error('Error fetching peace fund for balance update:', peaceFundError);
    throw peaceFundError;
  }
  
  if (peaceFundData) {
    let newAmount = Number(peaceFundData.current_amount);
    
    // Update the balance based on transaction type
    if (type === 'deposit') {
      newAmount += Number(amount);
    } else if (type === 'withdrawal') {
      newAmount -= Number(amount);
    }
    
    // Explicitly update the peace fund with the new balance
    const { error: updateError } = await supabase
      .from('peace_funds')
      .update({ 
        current_amount: newAmount,
        updated_at: new Date().toISOString()
      })
      .eq('id', peace_fund_id);
      
    if (updateError) {
      console.error('Error updating peace fund balance:', updateError);
      throw updateError;
    }
  }
  
  return transaction;
}
