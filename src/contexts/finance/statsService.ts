
import { Transaction, TransactionType, Goal } from "@/types";
import { isTransactionInPeriod } from "./dateUtils";
import { addDays, isAfter, isBefore, startOfMonth, endOfMonth, differenceInDays } from "date-fns";

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

// Get upcoming expenses within the next N days
export const getUpcomingExpenses = (transactions: Transaction[], days: number = 7): Transaction[] => {
  const today = new Date();
  const endDate = addDays(today, days);
  
  return transactions.filter(t => 
    t.type === TransactionType.EXPENSE && 
    isAfter(new Date(t.date), today) && 
    isBefore(new Date(t.date), endDate)
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// Get expected income
export const getExpectedIncome = (transactions: Transaction[]): Transaction[] => {
  const today = new Date();
  
  return transactions.filter(t => 
    t.type === TransactionType.INCOME && 
    isAfter(new Date(t.date), today)
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// Check if balance is below threshold
export const isBalanceBelowThreshold = (transactions: Transaction[], threshold: number): boolean => {
  return getCurrentBalance(transactions) < threshold;
};

// Calculate goal progress
export const calculateGoalProgress = (goal: Goal): number => {
  if (!goal.target || goal.target === 0) return 0;
  return Math.min(100, (goal.current / goal.target) * 100);
};

// Check if goal is achievable by the end date
export const isGoalAchievable = (goal: Goal, transactions: Transaction[]): boolean => {
  const now = new Date();
  const endDate = new Date(goal.endDate);
  
  if (isBefore(endDate, now)) return false;
  
  // Calculate days remaining
  const daysRemaining = differenceInDays(endDate, now);
  if (daysRemaining <= 0) return false;
  
  // For income goals
  if (goal.type === 'income') {
    // Calculate remaining amount needed
    const remaining = goal.target - goal.current;
    if (remaining <= 0) return true; // Already achieved
    
    // Calculate average daily income needed
    const dailyNeeded = remaining / daysRemaining;
    
    // Calculate average daily income based on recent history
    const monthStart = startOfMonth(now);
    const incomeThisMonth = transactions
      .filter(t => 
        t.type === TransactionType.INCOME && 
        isAfter(new Date(t.date), monthStart) &&
        isBefore(new Date(t.date), now)
      )
      .reduce((sum, t) => sum + t.amount, 0);
    
    const daysPassed = differenceInDays(now, monthStart);
    const averageDailyIncome = daysPassed > 0 ? incomeThisMonth / daysPassed : 0;
    
    return averageDailyIncome >= dailyNeeded;
  }
  
  // For expense-reduction goals
  if (goal.type === 'expense-reduction') {
    // Logic for expense reduction goals
    // This is simplified and would need more context on how expense reduction goals are tracked
    return true;
  }
  
  return false;
};

// Calculate expense by category
export const getExpensesByCategory = (transactions: Transaction[], period?: 'month' | 'year'): Record<string, number> => {
  const expensesByCategory: Record<string, number> = {};
  
  const filteredTransactions = period 
    ? transactions.filter(t => t.type === TransactionType.EXPENSE && isTransactionInPeriod(t.date, period))
    : transactions.filter(t => t.type === TransactionType.EXPENSE);
    
  filteredTransactions.forEach(transaction => {
    if (!expensesByCategory[transaction.category]) {
      expensesByCategory[transaction.category] = 0;
    }
    expensesByCategory[transaction.category] += transaction.amount;
  });
  
  return expensesByCategory;
};

// Compare current month expenses with previous month
export const compareMonthlyExpenses = (
  transactions: Transaction[]
): Record<string, { current: number; previous: number; percentChange: number }> => {
  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const currentMonthEnd = endOfMonth(now);
  
  // Get previous month
  const previousMonthEnd = new Date(currentMonthStart);
  previousMonthEnd.setDate(previousMonthEnd.getDate() - 1);
  const previousMonthStart = startOfMonth(previousMonthEnd);
  
  // Get expenses by category for current month
  const currentMonthExpenses: Record<string, number> = {};
  const previousMonthExpenses: Record<string, number> = {};
  
  // Process transactions
  transactions.forEach(transaction => {
    if (transaction.type !== TransactionType.EXPENSE) return;
    
    const transactionDate = new Date(transaction.date);
    const category = transaction.category;
    
    // Current month
    if (
      isAfter(transactionDate, currentMonthStart) && 
      isBefore(transactionDate, currentMonthEnd)
    ) {
      if (!currentMonthExpenses[category]) currentMonthExpenses[category] = 0;
      currentMonthExpenses[category] += transaction.amount;
    }
    
    // Previous month
    if (
      isAfter(transactionDate, previousMonthStart) && 
      isBefore(transactionDate, previousMonthEnd)
    ) {
      if (!previousMonthExpenses[category]) previousMonthExpenses[category] = 0;
      previousMonthExpenses[category] += transaction.amount;
    }
  });
  
  // Calculate changes
  const result: Record<string, { current: number; previous: number; percentChange: number }> = {};
  
  // Process all categories from both months
  const allCategories = new Set([
    ...Object.keys(currentMonthExpenses),
    ...Object.keys(previousMonthExpenses)
  ]);
  
  allCategories.forEach(category => {
    const current = currentMonthExpenses[category] || 0;
    const previous = previousMonthExpenses[category] || 0;
    
    let percentChange = 0;
    if (previous > 0) {
      percentChange = ((current - previous) / previous) * 100;
    } else if (current > 0) {
      percentChange = 100; // If there was no expense in the previous month, that's a 100% increase
    }
    
    result[category] = { current, previous, percentChange };
  });
  
  return result;
};

// Check if monthly balance has been decreasing for several months
export const isBalanceTrending = (transactions: Transaction[], months: number = 3): 'up' | 'down' | 'stable' => {
  if (months < 2) return 'stable';
  
  const now = new Date();
  const monthlyBalances: number[] = [];
  
  // Calculate balance for each month
  for (let i = 0; i < months; i++) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    
    const monthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return isAfter(date, monthStart) && isBefore(date, monthEnd);
    });
    
    const monthlyIncome = monthTransactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
      
    const monthlyExpense = monthTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
      
    monthlyBalances.push(monthlyIncome - monthlyExpense);
  }
  
  // Check trend
  let decreasing = true;
  let increasing = true;
  
  for (let i = 0; i < monthlyBalances.length - 1; i++) {
    if (monthlyBalances[i] >= monthlyBalances[i + 1]) {
      increasing = false;
    }
    if (monthlyBalances[i] <= monthlyBalances[i + 1]) {
      decreasing = false;
    }
  }
  
  if (increasing) return 'up';
  if (decreasing) return 'down';
  return 'stable';
};
