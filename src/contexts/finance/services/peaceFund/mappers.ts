
import { PeaceFund, PeaceFundTransaction } from "@/types";

/**
 * Mapeia dados do fundo de paz do banco de dados para o frontend
 */
export const mapDatabasePeaceFundToFrontend = (dbFund: any): PeaceFund => ({
  id: dbFund.id,
  user_id: dbFund.user_id,
  target_amount: dbFund.target_amount,
  current_amount: dbFund.current_amount,
  minimum_alert_amount: dbFund.minimum_alert_amount,
  created_at: dbFund.created_at,
  updated_at: dbFund.updated_at
});

/**
 * Mapeia dados de transação do fundo de paz do banco de dados para o frontend
 */
export const mapDatabaseTransactionToFrontend = (dbTransaction: any): PeaceFundTransaction => ({
  id: dbTransaction.id,
  peace_fund_id: dbTransaction.peace_fund_id,
  user_id: dbTransaction.user_id,
  amount: dbTransaction.amount,
  description: dbTransaction.description,
  type: dbTransaction.type,
  date: dbTransaction.date,
  created_at: dbTransaction.created_at
});
