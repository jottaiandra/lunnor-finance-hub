import { Transaction, Goal } from "@/types";

// Function to calculate total income
export const getTotalIncome = (transactions: Transaction[]): number => {
  return transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
};

// Function to calculate total expense
export const getTotalExpense = (transactions: Transaction[]): number => {
  return transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
};

// Function to calculate current balance
export const getCurrentBalance = (transactions: Transaction[]): number => {
  let balance = 0;
  transactions.forEach((transaction) => {
    if (transaction.type === "income") {
      balance += transaction.amount;
    } else {
      balance -= transaction.amount;
    }
  });
  return balance;
};

// Fix the date handling in these functions
export const getUpcomingExpenses = (transactions: Transaction[], days: number = 7): Transaction[] => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);
  
  return transactions.filter(t => {
    if (t.type !== 'expense') return false;
    
    const transactionDate = typeof t.date === 'string' ? new Date(t.date) : t.date;
    return transactionDate >= today && transactionDate <= futureDate;
  });
};

export const getExpectedIncome = (transactions: Transaction[], days: number = 30): Transaction[] => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);
  
  return transactions.filter(t => {
    if (t.type !== 'income') return false;
    
    const transactionDate = typeof t.date === 'string' ? new Date(t.date) : t.date;
    return transactionDate >= today && transactionDate <= futureDate;
  });
};

// Function to check if balance is below a certain threshold
export const isBalanceBelowThreshold = (transactions: Transaction[], threshold: number): boolean => {
  const balance = getCurrentBalance(transactions);
  return balance < threshold;
};

// Function to compare monthly expenses to the previous month
export const compareMonthlyExpenses = (transactions: Transaction[]): { [category: string]: { current: number; previous: number; percentChange: number } } => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const categoryExpenses: { [category: string]: { current: number; previous: number; percentChange: number } } = {};

  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);
    const transactionMonth = transactionDate.getMonth();
    const transactionYear = transactionDate.getFullYear();

    if (transaction.type === "expense") {
      if (!categoryExpenses[transaction.category]) {
        categoryExpenses[transaction.category] = { current: 0, previous: 0, percentChange: 0 };
      }

      if (transactionMonth === currentMonth && transactionYear === currentYear) {
        categoryExpenses[transaction.category].current += transaction.amount;
      } else if (transactionMonth === previousMonth && transactionYear === previousYear) {
        categoryExpenses[transaction.category].previous += transaction.amount;
      }
    }
  });

  for (const category in categoryExpenses) {
    const { current, previous } = categoryExpenses[category];
    const change = previous === 0 ? (current > 0 ? 100 : 0) : ((current - previous) / previous) * 100;
    categoryExpenses[category].percentChange = change;
  }

  return categoryExpenses;
};

// Function to check if balance is trending up or down over a period
export const isBalanceTrending = (transactions: Transaction[], months: number): 'up' | 'down' | 'stable' => {
  if (transactions.length === 0) return 'stable';

  const today = new Date();
  const pastDate = new Date();
  pastDate.setMonth(today.getMonth() - months);

  const recentTransactions = transactions.filter(t => new Date(t.date) >= pastDate && new Date(t.date) <= today);

  if (recentTransactions.length === 0) return 'stable';

  const initialBalance = getCurrentBalance(transactions.filter(t => new Date(t.date) < pastDate));
  const finalBalance = getCurrentBalance(transactions.filter(t => new Date(t.date) <= today));

  if (finalBalance > initialBalance) {
    return 'up';
  } else if (finalBalance < initialBalance) {
    return 'down';
  } else {
    return 'stable';
  }
};

// Fix the end_date property reference
export const calculateGoalProgress = (goal: Goal): number => {
  if (goal.target <= 0) return 0;
  
  const progress = (goal.current / goal.target) * 100;
  return Math.min(progress, 100); // Ensure progress doesn't exceed 100%
};

export const isGoalAchievable = (goal: Goal, transactions: Transaction[]): boolean => {
  // If goal is already achieved, return true
  if (goal.current >= goal.target) return true;
  
  // Calculate remaining amount and days
  const remaining = goal.target - goal.current;
  const today = new Date();
  const endDate = new Date(goal.end_date);
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  
  if (daysRemaining <= 0) return false; // Past due date
  
  // Calculate average savings rate based on past transactions
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  
  // Count deposits toward this goal in the last month
  const relevantTransactions = transactions.filter(t => {
    if (t.type !== 'income') return false;
    
    const transactionDate = typeof t.date === 'string' ? new Date(t.date) : t.date;
    return transactionDate >= lastMonth && transactionDate <= today;
  });
  
  const monthlyIncome = relevantTransactions.reduce((sum, t) => sum + t.amount, 0);
  const dailyRate = monthlyIncome / 30; // Approximate daily rate
  
  // Project if the goal can be achieved based on current rate
  const projectedAmount = dailyRate * daysRemaining;
  
  return projectedAmount >= remaining;
};
