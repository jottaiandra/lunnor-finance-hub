
import { useCallback } from "react";
import { Transaction } from "@/types";
import { 
  fetchTransactions, 
  addTransaction,
  updateTransaction,
  deleteTransaction,
  generateRecurringTransactions,
  sendTransactionWebhook
} from "../services/transaction";
import { processNotification } from "../whatsappService";

export function useTransactions(user: any, state: any, dispatch: any) {
  const handleFetchTransactions = useCallback(async () => {
    if (!user) return;
    await fetchTransactions(user.id, dispatch);
  }, [user, dispatch]);

  const handleAddTransaction = useCallback(async (transactionData: Omit<Transaction, "id">) => {
    if (!user) return;
    const newTransaction = await addTransaction(transactionData, user.id, dispatch);
    
    // Send WhatsApp notification
    if (newTransaction) {
      const eventType = newTransaction.type === 'income' ? 'new_income' : 'new_expense';
      await processNotification(user.id, eventType, {
        descricao: newTransaction.description,
        valor: newTransaction.amount,
        categoria: newTransaction.category,
        data: newTransaction.date,
        nome: user.email?.split('@')[0] || 'Usuário'
      });
      
      // Send webhook to Make - This is already called in addTransaction.ts
    }
    
    // If this is a recurring transaction, generate future occurrences
    if (newTransaction?.isRecurrent && newTransaction?.recurrenceFrequency) {
      const newTransactions = await generateRecurringTransactions(newTransaction, user.id, dispatch);
      
      if (newTransactions && newTransactions.length > 0) {
        dispatch({ 
          type: "SET_TRANSACTIONS", 
          payload: [...state.transactions, ...newTransactions] 
        });
      }
    }
  }, [user, state.transactions, dispatch]);

  const handleUpdateTransaction = useCallback(async (transaction: Transaction, updateOptions?: { updateAllFuture?: boolean }) => {
    if (!user) return;
    const updatedTransaction = await updateTransaction(transaction, user.id, dispatch, updateOptions);
    
    // Send webhook to Make for updated transaction
    if (updatedTransaction) {
      await sendTransactionWebhook(updatedTransaction, user.id);
    }
    
    // Send WhatsApp notification for transaction updates
    await processNotification(user.id, 'transaction_updated', {
      descricao: transaction.description,
      valor: transaction.amount,
      categoria: transaction.category,
      data: transaction.date,
      nome: user.email?.split('@')[0] || 'Usuário'
    });
  }, [user, dispatch]);

  const handleDeleteTransaction = useCallback(async (id: string, deleteOptions?: { deleteAllFuture?: boolean }) => {
    if (!user) return;
    await deleteTransaction(id, user.id, dispatch, deleteOptions);
  }, [user, dispatch]);

  return {
    fetchTransactions: handleFetchTransactions,
    addTransaction: handleAddTransaction,
    updateTransaction: handleUpdateTransaction,
    deleteTransaction: handleDeleteTransaction
  };
}
