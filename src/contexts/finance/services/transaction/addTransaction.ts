
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types";
import { FinanceAction } from "../../types";

// Modified function signature to receive proper transaction type
export const addTransaction = async (
  transaction: Omit<Transaction, "id">,
  dispatch: React.Dispatch<FinanceAction>
): Promise<Transaction | null> => {
  try {
    // Convert Date objects to ISO strings for Supabase compatibility
    const preparedTransaction = {
      ...transaction,
      date: transaction.date instanceof Date 
        ? transaction.date.toISOString() 
        : transaction.date,
      created_at: transaction.created_at instanceof Date 
        ? transaction.created_at.toISOString() 
        : transaction.created_at,
      recurrence_start_date: transaction.recurrence_start_date instanceof Date 
        ? transaction.recurrence_start_date.toISOString() 
        : transaction.recurrence_start_date,
      recurrence_end_date: transaction.recurrence_end_date instanceof Date 
        ? transaction.recurrence_end_date.toISOString() 
        : transaction.recurrence_end_date
    };

    const { data, error } = await supabase
      .from("transactions")
      .insert(preparedTransaction)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (data) {
      dispatch({
        type: "ADD_TRANSACTION",
        payload: data as Transaction,
      });
      return data as Transaction;
    }

    return null;
  } catch (error: any) {
    console.error("Error adding transaction:", error);
    throw error;
  }
};
