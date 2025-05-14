
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
      const data = await fetchTransactions(user.id);
      dispatch({ type: "SET_TRANSACTIONS", payload: data });
    } catch (error: any) {
      console.error("Error fetching transactions:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: { key: 'transactions', value: false } });
    }
  }, [user, dispatch]);

  // Add transaction with proper type
  const handleAddTransaction = useCallback(async (transaction: Omit<Transaction, "id" | "user_id" | "created_at">) => {
    if (!user) return;
    
    try {
      const newTransaction = await addTransaction(user.id, transaction);
      dispatch({ type: "ADD_TRANSACTION", payload: newTransaction });
      return newTransaction;
    } catch (error: any) {
      console.error("Error adding transaction:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  }, [user, dispatch]);

  const handleUpdateTransaction = useCallback(async (transaction: Transaction) => {
    if (!user) return;
    
    try {
      await updateTransaction(transaction, user.id);
      dispatch({ type: "UPDATE_TRANSACTION", payload: transaction });
    } catch (error: any) {
      console.error("Error updating transaction:", error);
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    }
  }, [user, dispatch]);

  const handleDeleteTransaction = useCallback(async (id: string, deleteOptions?: { deleteAllFuture?: boolean }) => {
    if (!user) return;
    
    try {
      await deleteTransaction(id, user.id, deleteOptions);
      dispatch({ type: "DELETE_TRANSACTION", payload: id });
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
