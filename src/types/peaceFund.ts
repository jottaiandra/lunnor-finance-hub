
export interface PeaceFund {
  id: string;
  user_id: string;
  target_amount: number;
  current_amount: number;
  minimum_alert_amount: number | null;
  created_at: string;
  updated_at: string;
}

export interface PeaceFundTransaction {
  id: string;
  peace_fund_id: string;
  user_id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  description: string;
  date: string;
  created_at: string;
}
