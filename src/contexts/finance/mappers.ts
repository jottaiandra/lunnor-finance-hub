
import { Transaction, TransactionType, PaymentMethod, Goal, Alert, Notification } from "@/types";
import { v4 as uuidv4 } from "uuid";

// Map Supabase data to our application's internal types
export const mapTransactionFromDB = (item: any): Transaction => ({
  id: item.id,
  user_id: item.user_id,
  date: new Date(item.date),
  description: item.description,
  amount: Number(item.amount),
  category: item.category,
  payment_method: item.payment_method as PaymentMethod,
  type: item.type as TransactionType,
  contact: item.contact,
  is_recurrent: item.is_recurrent || false,
  recurrence_frequency: item.recurrence_frequency,
  recurrence_interval: item.recurrence_interval,
  recurrence_start_date: item.recurrence_start_date ? new Date(item.recurrence_start_date) : undefined,
  recurrence_end_date: item.recurrence_end_date ? new Date(item.recurrence_end_date) : undefined,
  parent_transaction_id: item.parent_transaction_id,
  is_original: item.is_original !== false,
  created_at: item.created_at
});

export const mapGoalFromDB = (item: any): Goal => {
  try {
    if (!item || !item.id) {
      console.error("Received invalid goal data:", item);
      throw new Error("Dados inválidos de meta");
    }

    return {
      id: item.id,
      user_id: item.user_id,
      title: item.title || "",
      target: typeof item.target === 'number' ? item.target : Number(item.target) || 0,
      current: typeof item.current === 'number' ? item.current : Number(item.current) || 0,
      type: item.type as 'income' | 'expense-reduction',
      period: item.period as 'weekly' | 'monthly' | 'yearly',
      start_date: item.start_date ? new Date(item.start_date) : new Date(),
      end_date: item.end_date ? new Date(item.end_date) : new Date(),
      created_at: item.created_at
    };
  } catch (error) {
    console.error("Error mapping goal data:", error, item);
    // Return a minimal valid object to prevent UI errors
    return {
      id: item.id || uuidv4(),
      user_id: item.user_id || "",
      title: "Erro nos dados",
      target: 0,
      current: 0,
      type: 'income',
      period: 'monthly',
      start_date: new Date(),
      end_date: new Date(),
      created_at: new Date()
    };
  }
};

export const mapAlertFromDB = (item: any): Alert => ({
  id: item.id,
  message: item.message,
  type: item.type as 'warning' | 'info' | 'success' | 'danger',
  read: item.read,
  createdAt: new Date(item.created_at)
});

export const mapNotificationFromDB = (item: any): Notification => ({
  id: item.id,
  message: item.message,
  type: item.type,
  relatedTransactionId: item.related_transaction_id,
  isRead: item.is_read || false,
  createdAt: new Date(item.created_at)
});
