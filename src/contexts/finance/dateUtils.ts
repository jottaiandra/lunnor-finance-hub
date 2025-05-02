
import { addDays, addMonths, addWeeks, addYears } from "date-fns";

// Calculate next occurrence date for recurring transactions
export const calculateNextOccurrenceDate = (
  startDate: Date, 
  frequency: string, 
  interval: number = 1
): Date => {
  const date = new Date(startDate);
  
  switch (frequency) {
    case 'daily':
      return addDays(date, 1);
    case 'weekly':
      return addWeeks(date, 1);
    case 'biweekly':
      return addWeeks(date, 2);
    case 'monthly':
      return addMonths(date, 1);
    case 'yearly':
      return addYears(date, 1);
    case 'custom':
      return addDays(date, interval);
    default:
      return addMonths(date, 1); // Default to monthly
  }
};

// Check if a transaction is within a specific time period
export const isTransactionInPeriod = (date: Date, period: 'today' | 'week' | 'month' | 'year'): boolean => {
  const now = new Date();
  const transDate = new Date(date);
  
  switch (period) {
    case 'today':
      return (
        transDate.getDate() === now.getDate() &&
        transDate.getMonth() === now.getMonth() &&
        transDate.getFullYear() === now.getFullYear()
      );
    case 'week':
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      return transDate >= weekStart;
    case 'month':
      return (
        transDate.getMonth() === now.getMonth() &&
        transDate.getFullYear() === now.getFullYear()
      );
    case 'year':
      return transDate.getFullYear() === now.getFullYear();
    default:
      return true;
  }
};

// Get start and end of month
export const getMonthDates = (date: Date): { start: Date; end: Date } => {
  const year = date.getFullYear();
  const month = date.getMonth();
  return {
    start: new Date(year, month, 1),
    end: new Date(year, month + 1, 0)
  };
};

// Get start and end of year
export const getYearDates = (date: Date): { start: Date; end: Date } => {
  const year = date.getFullYear();
  return {
    start: new Date(year, 0, 1),
    end: new Date(year, 11, 31)
  };
};
