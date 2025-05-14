
export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense"
}

export enum PaymentMethod {
  CREDIT_CARD = "Cartão de Crédito",
  DEBIT_CARD = "Cartão de Débito",
  CASH = "Dinheiro",
  BANK_TRANSFER = "Transferência Bancária",
  PIX = "Pix",
  OTHER = "Outros"
}

export enum IncomeCategory {
  SALES = "Vendas",
  SERVICES = "Serviços",
  INVESTMENTS = "Investimentos",
  OTHER = "Outros"
}

export enum ExpenseCategory {
  FIXED = "Despesas Fixas",
  VARIABLE = "Despesas Variáveis",
  TAXES = "Impostos",
  SUPPLIERS = "Fornecedores",
  STAFF = "Pessoal",
  MARKETING = "Marketing"
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  date: Date | string;
  description: string;
  category: string;
  type: TransactionType;
  payment_method: string;
  is_recurrent?: boolean;
  recurrence_frequency?: string;
  recurrence_interval?: number;
  recurrence_start_date?: Date | string;
  recurrence_end_date?: Date | string;
  is_original?: boolean;
  parent_transaction_id?: string;
  contact?: string;
  created_at: Date | string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  target: number;
  current: number;
  start_date: Date | string;
  end_date: Date | string;
  period: string;
  type: string;
  created_at: Date | string;
}

export interface PeaceFund {
  id: string;
  user_id: string;
  target_amount: number;
  current_amount: number;
  minimum_alert_amount: number | null;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface PeaceFundTransaction {
  id: string;
  peace_fund_id: string;
  user_id: string;
  amount: number;
  description: string;
  type: 'deposit' | 'withdrawal';
  date: Date | string;
  created_at: Date | string;
}

export interface Alert {
  id: string;
  message: string;
  type: 'warning' | 'info' | 'success' | 'danger';
  read: boolean;
  createdAt: Date;
}

export interface Notification {
  id: string;
  message: string;
  type: string;
  relatedTransactionId?: string;
  isRead: boolean;
  createdAt: Date;
}
