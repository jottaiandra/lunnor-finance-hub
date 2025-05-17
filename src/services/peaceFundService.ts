import { supabase } from '@/integrations/supabase/client';
import { PeaceFund, PeaceFundTransaction } from '@/types/peaceFund';

// Map Supabase data to our application type
function mapPeaceFundFromDB(data: any): PeaceFund {
  return {
    id: data.id,
    user_id: data.user_id,
    target_amount: data.target_amount,
    current_amount: data.current_amount,
    minimum_alert_amount: data.minimum_alert_amount,
    created_at: new Date(data.created_at),
    updated_at: new Date(data.updated_at)
  };
}

// Map Supabase data to our transaction application type
function mapPeaceFundTransactionFromDB(data: any): PeaceFundTransaction {
  return {
    id: data.id,
    peace_fund_id: data.peace_fund_id,
    user_id: data.user_id,
    type: data.type as 'deposit' | 'withdrawal',
    amount: data.amount,
    description: data.description,
    date: new Date(data.date),
    created_at: new Date(data.created_at)
  };
}

// Get user's peace fund
export async function getUserPeaceFund() {
  const { data, error } = await supabase
    .from('peace_funds')
    .select('*')
    .limit(1)
    .single();
    
  if (error) {
    console.error('Error fetching peace fund:', error);
    return null;
  }
  
  return data ? mapPeaceFundFromDB(data) : null;
}

// Create a peace fund
export async function createPeaceFund(peaceFundData: Omit<PeaceFund, 'id' | 'created_at' | 'updated_at'>) {
  // Convert Date objects to ISO strings for Supabase
  const dbPeaceFund = {
    ...peaceFundData,
    current_amount: peaceFundData.current_amount || 0,
    target_amount: peaceFundData.target_amount || 0
  };
  
  const { data, error } = await supabase
    .from('peace_funds')
    .insert([dbPeaceFund])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating peace fund:', error);
    throw error;
  }
  
  return mapPeaceFundFromDB(data);
}

// Update peace fund
export async function updatePeaceFund(id: string, updates: Partial<Omit<PeaceFund, 'id' | 'created_at'>>) {
  // Convert any Date objects to ISO strings for Supabase
  const dbUpdates = {
    ...updates,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('peace_funds')
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating peace fund:', error);
    throw error;
  }
  
  return mapPeaceFundFromDB(data);
}

// Get peace fund transactions
export async function getPeaceFundTransactions(peaceFundId: string, limit = 10) {
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
  
  // Update the peace fund balance
  const { peace_fund_id, type, amount } = transaction;
  
  // Get the current peace fund
  const peaceFund = await getUserPeaceFund();
  if (!peaceFund) throw new Error("Peace fund not found");
  
  let newAmount = peaceFund.current_amount;
  
  // Update the balance based on transaction type
  if (type === 'deposit') {
    newAmount += amount;
  } else if (type === 'withdrawal') {
    newAmount -= amount;
  }
  
  // Update the peace fund with the new balance
  await updatePeaceFund(peace_fund_id, {
    current_amount: newAmount,
    updated_at: new Date()
  });
  
  return transaction;
}

// Get monthly progress
export async function getMonthlyProgress(peaceFundId: string, months = 6) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  
  const { data, error } = await supabase
    .from('peace_fund_transactions')
    .select('*')
    .eq('peace_fund_id', peaceFundId)
    .gte('date', startDate.toISOString())
    .lte('date', endDate.toISOString())
    .order('date', { ascending: true });
    
  if (error) {
    console.error('Error fetching monthly progress:', error);
    return [];
  }
  
  // Process data to get monthly totals
  const transactions = data.map(mapPeaceFundTransactionFromDB);
  const monthlyData = processMonthlyData(transactions, months);
  return monthlyData;
}

// Helper to process monthly data
function processMonthlyData(transactions: PeaceFundTransaction[], months: number) {
  const result: Array<{name: string; value: number}> = [];
  const now = new Date();
  let runningTotal = 0;
  
  // Initialize with empty months
  for (let i = months; i >= 0; i--) {
    const d = new Date();
    d.setMonth(now.getMonth() - i);
    const monthName = d.toLocaleString('default', { month: 'short' });
    result.push({
      name: monthName,
      value: 0
    });
  }
  
  // Group transactions by month
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const monthIndex = months - (now.getMonth() - date.getMonth() + (now.getFullYear() - date.getFullYear()) * 12);
    
    if (monthIndex >= 0 && monthIndex < result.length) {
      if (transaction.type === 'deposit') {
        runningTotal += transaction.amount;
      } else {
        runningTotal -= transaction.amount;
      }
      
      result[monthIndex].value = runningTotal;
    }
  });
  
  // Fill forward the running total
  let lastValue = 0;
  for (let i = 0; i < result.length; i++) {
    if (result[i].value === 0 && i > 0) {
      result[i].value = lastValue;
    }
    lastValue = result[i].value;
  }
  
  return result;
}
