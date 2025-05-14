
import { supabase } from "@/integrations/supabase/client";
import { Transaction } from "@/types";
import { FinanceAction } from "../../types";

// Modified function signature to receive proper transaction type
export const addTransaction = async (
  transaction: Omit<Transaction, "id">,
  dispatch: React.Dispatch<FinanceAction>
): Promise<Transaction | null> => {
  try {
    const { data, error } = await supabase
      .from("transactions")
      .insert([transaction])
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
