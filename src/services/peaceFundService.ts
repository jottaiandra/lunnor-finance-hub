
import { supabase } from '@/integrations/supabase/client';
import { PeaceFund, PeaceFundTransaction } from '@/types/peaceFund';

// Get user's peace fund
export async function getUserPeaceFund() {
  console.log('Fetching user peace fund');
  const { data, error } = await supabase
    .from('peace_funds')
    .select('*')
    .limit(1)
    .single();
    
  if (error) {
    console.error('Error fetching peace fund:', error);
    return null;
  }
  
  console.log('Peace fund fetched successfully:', data);
  return data as PeaceFund;
}

// Create a peace fund
export async function createPeaceFund(peaceFund: Partial<PeaceFund> & { user_id: string }) {
  console.log('Creating peace fund with data:', peaceFund);
  const { data, error } = await supabase
    .from('peace_funds')
    .insert(peaceFund)
    .select()
    .single();
    
  if (error) {
    console.error('Error creating peace fund:', error);
    throw error;
  }
  
  console.log('Peace fund created successfully:', data);
  return data as PeaceFund;
}

// Update peace fund
export async function updatePeaceFund(id: string, updates: Partial<PeaceFund>) {
  console.log('Updating peace fund:', id, 'with data:', updates);
  const { data, error } = await supabase
    .from('peace_funds')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating peace fund:', error);
    throw error;
  }
  
  console.log('Peace fund updated successfully:', data);
  return data as PeaceFund;
}

// Get peace fund transactions
export async function getPeaceFundTransactions(peaceFundId: string, limit = 500) {
  console.log('Fetching transactions for peace fund:', peaceFundId, 'with limit:', limit);
  
  const { data, error } = await supabase
    .from('peace_fund_transactions')
    .select('*')
    .eq('peace_fund_id', peaceFundId)
    .order('date', { ascending: false })
    .limit(limit);
    
  if (error) {
    console.error('Error fetching peace fund transactions:', error);
    throw error;
  }
  
  console.log(`Retrieved ${data?.length || 0} transactions`);
  return data as PeaceFundTransaction[];
}

// Create a peace fund transaction
export async function createPeaceFundTransaction(transaction: {
  peace_fund_id: string;
  user_id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  description: string;
  date?: string;
}) {
  console.log('Creating new transaction:', transaction);
  
  const { data, error } = await supabase
    .from('peace_fund_transactions')
    .insert(transaction)
    .select()
    .single();
    
  if (error) {
    console.error('Error creating peace fund transaction:', error);
    throw error;
  }
  
  console.log('Transaction created successfully:', data);
  return data as PeaceFundTransaction;
}

// Get monthly progress
export async function getMonthlyProgress(peaceFundId: string, months = 6) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  
  console.log('Fetching monthly progress for peace fund:', peaceFundId);
  console.log('Date range:', startDate.toISOString(), 'to', endDate.toISOString());
  
  const { data, error } = await supabase
    .from('peace_fund_transactions')
    .select('*')
    .eq('peace_fund_id', peaceFundId)
    .gte('date', startDate.toISOString())
    .lte('date', endDate.toISOString())
    .order('date', { ascending: true });
    
  if (error) {
    console.error('Error fetching monthly progress:', error);
    throw error;
  }
  
  console.log(`Retrieved ${data?.length || 0} transactions for monthly progress`);
  
  // Process data to get monthly totals
  const monthlyData = processMonthlyData(data as PeaceFundTransaction[], months);
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
