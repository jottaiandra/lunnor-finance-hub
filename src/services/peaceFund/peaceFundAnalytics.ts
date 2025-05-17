
import { PeaceFundTransaction } from '@/types/peaceFund';
import { mapPeaceFundTransactionFromDB } from './mappers';
import { supabase } from '@/integrations/supabase/client';

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
export function processMonthlyData(transactions: PeaceFundTransaction[], months: number) {
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
