
import { Transaction, TransactionType } from "@/types";
import { isTransactionInPeriod } from "./dateUtils";

// Calculate total income for a specific period
export const getTotalIncome = (transactions: Transaction[], period?: 'today' | 'week' | 'month' | 'year'): number => {
  const incomeTransactions = transactions.filter(t => t.type === TransactionType.INCOME);
  
  if (!period) {
    return incomeTransactions.reduce((total, t) => total + t.amount, 0);
  }
  
  return incomeTransactions
    .filter(t => isTransactionInPeriod(t.date, period))
    .reduce((total, t) => total + t.amount, 0);
};

// Calculate total expense for a specific period
export const getTotalExpense = (transactions: Transaction[], period?: 'today' | 'week' | 'month' | 'year'): number => {
  const expenseTransactions = transactions.filter(t => t.type === TransactionType.EXPENSE);
  
  if (!period) {
    return expenseTransactions.reduce((total, t) => total + t.amount, 0);
  }
  
  return expenseTransactions
    .filter(t => isTransactionInPeriod(t.date, period))
    .reduce((total, t) => total + t.amount, 0);
};

// Calculate current balance
export const getCurrentBalance = (transactions: Transaction[]): number => {
  return getTotalIncome(transactions) - getTotalExpense(transactions);
};
