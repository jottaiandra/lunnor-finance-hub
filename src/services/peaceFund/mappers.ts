
import { PeaceFund, PeaceFundTransaction } from '@/types/peaceFund';

// Map Supabase data to our application type
export function mapPeaceFundFromDB(data: any): PeaceFund {
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
export function mapPeaceFundTransactionFromDB(data: any): PeaceFundTransaction {
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
