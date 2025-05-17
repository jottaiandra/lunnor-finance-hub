
export interface PeaceFund {
  id: string;
  user_id: string;
  target_amount: number;
  current_amount: number; // Este campo é obrigatório
  minimum_alert_amount: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface PeaceFundTransaction {
  id: string;
  peace_fund_id: string;
  user_id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  description: string;
  date: Date;
  created_at: Date;
}
