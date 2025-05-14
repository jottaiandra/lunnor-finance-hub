
import { useCallback } from "react";
import { fetchTransactions } from "../services/transaction/fetchTransactions";
import { addTransaction } from "../services/transaction/addTransaction";
import { updateTransaction } from "../services/transaction/updateTransaction";
import { deleteTransaction } from "../services/transaction/deleteTransaction";
import { Transaction } from "@/types";

export function useTransactions(user: any, state: any, dispatch: any) {
  const handleFetchTransactions = useCallback(async () => {
    if (!user) return;
    
    try {
      dispatch({ type: "SET_LOADING", payload: { key: 'transactions', value: true } });
      await fetchTransactions(user.id, dispatch);
    } catch (error: any) {
      console.error("Error fetching transactions:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: { key: 'transactions', value: false } });
    }
  }, [user, dispatch]);

  // Add transaction with proper type
  const handleAddTransaction = useCallback(async (transaction: Omit<Transaction, "id" | "user_id" | "created_at">) => {
    if (!user) return null;
    
    try {
      const newTransaction = await addTransaction(transaction, user.id, dispatch);
      return newTransaction;
    } catch (error: any) {
      console.error("Error adding transaction:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  }, [user, dispatch]);

  const handleUpdateTransaction = useCallback(async (transaction: Transaction) => {
    if (!user) return null;
    
    try {
      const updatedTransaction = await updateTransaction(transaction, user.id, dispatch);
      return updatedTransaction;
    } catch (error: any) {
      console.error("Error updating transaction:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  }, [user, dispatch]);

  const handleDeleteTransaction = useCallback(async (id: string, deleteOptions?: { deleteAllFuture?: boolean }) => {
    if (!user) return;
    
    try {
      await deleteTransaction(id, user.id, dispatch, deleteOptions);
    } catch (error: any) {
      console.error("Error deleting transaction:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  }, [user, dispatch]);

  return {
    fetchTransactions: handleFetchTransactions,
    addTransaction: handleAddTransaction,
    updateTransaction: handleUpdateTransaction,
    deleteTransaction: handleDeleteTransaction
  };
}
