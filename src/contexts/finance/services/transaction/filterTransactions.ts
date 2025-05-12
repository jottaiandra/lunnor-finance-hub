
import { Transaction } from "@/types";

// Get filtered transactions based on filter criteria
export const getFilteredTransactions = (state: any) => {
  const { transactions, currentFilter } = state;
  const { startDate, endDate, type, category, searchTerm } = currentFilter;
  
  return transactions.filter((transaction: Transaction) => {
    // Date range filter
    if (startDate && transaction.date < startDate) return false;
    if (endDate && transaction.date > endDate) return false;
    
    // Type filter
    if (type && transaction.type !== type) return false;
    
    // Category filter
    if (category && transaction.category !== category) return false;
    
    // Search term filter
    if (
      searchTerm &&
      !transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!transaction.contact || !transaction.contact.toLowerCase().includes(searchTerm.toLowerCase()))
    ) {
      return false;
    }
    
    return true;
  });
};
