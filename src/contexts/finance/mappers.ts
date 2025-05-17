
import { Transaction, TransactionType, PaymentMethod, Goal, Alert, Notification } from "@/types";
import { v4 as uuidv4 } from "uuid";

// Map Supabase data to our application's internal types
export const mapTransactionFromDB = (item: any): Transaction => ({
  id: item.id,
  date: new Date(item.date),
  description: item.description,
  amount: Number(item.amount),
  category: item.category,
  paymentMethod: item.payment_method as PaymentMethod,
  type: item.type as TransactionType,
  contact: item.contact,
  isRecurrent: item.is_recurrent || false,
  recurrenceFrequency: item.recurrence_frequency,
  recurrenceInterval: item.recurrence_interval,
  recurrenceStartDate: item.recurrence_start_date ? new Date(item.recurrence_start_date) : undefined,
  recurrenceEndDate: item.recurrence_end_date ? new Date(item.recurrence_end_date) : undefined,
  parentTransactionId: item.parent_transaction_id,
  isOriginal: item.is_original !== false
});

export const mapGoalFromDB = (item: any): Goal => {
  try {
    if (!item || !item.id) {
      console.error("Received invalid goal data:", item);
      throw new Error("Dados inválidos de meta");
    }

    return {
      id: item.id,
      title: item.title || "",
      target: typeof item.target === 'number' ? item.target : Number(item.target) || 0,
      current: typeof item.current === 'number' ? item.current : Number(item.current) || 0,
      type: item.type as 'income' | 'expense-reduction',
      period: item.period as 'weekly' | 'monthly' | 'yearly',
      startDate: item.start_date ? new Date(item.start_date) : new Date(),
      endDate: item.end_date ? new Date(item.end_date) : new Date()
    };
  } catch (error) {
    console.error("Error mapping goal data:", error, item);
    // Return a minimal valid object to prevent UI errors
    return {
      id: item.id || uuidv4(),
      title: "Erro nos dados",
      target: 0,
      current: 0,
      type: 'income',
      period: 'monthly',
      startDate: new Date(),
      endDate: new Date()
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
