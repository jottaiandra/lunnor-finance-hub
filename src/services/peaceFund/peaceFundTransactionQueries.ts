
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

  // Log transaction creation for debugging
  console.log('Transaction created successfully:', data);
  
  // Return the mapped transaction - we don't need to update the peace fund balance
  // since this is now handled by the database trigger
  return mapPeaceFundTransactionFromDB(data);
}
