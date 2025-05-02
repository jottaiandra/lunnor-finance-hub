
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
  date: Date;
  description: string;
  amount: number;
  category: string;
  paymentMethod: PaymentMethod;
  type: TransactionType;
  contact?: string; // Cliente ou Fornecedor
  isRecurrent?: boolean;
}

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  type: 'income' | 'expense-reduction';
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
}

export interface Alert {
  id: string;
  message: string;
  type: 'warning' | 'info' | 'success' | 'danger';
  read: boolean;
  createdAt: Date;
}
