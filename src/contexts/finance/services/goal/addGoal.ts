
import { Goal } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { FinanceAction } from "../../types";
import { toast } from "@/components/ui/sonner";

export const addGoal = async (
  goal: Omit<Goal, "id" | "user_id" | "created_at">,
  userId: string,
  dispatch: React.Dispatch<FinanceAction>
): Promise<Goal | null> => {
  if (!userId) return null;
  
  try {
    // Prepare data for Supabase
    const goalData = {
      user_id: userId,
      title: goal.title,
      target: goal.target,
      current: goal.current || 0,
      type: goal.type,
      period: goal.period,
      start_date: goal.start_date instanceof Date ? goal.start_date.toISOString() : goal.start_date,
      end_date: goal.end_date instanceof Date ? goal.end_date.toISOString() : goal.end_date
    };
    
    // Insert into Supabase
    const { data, error } = await supabase
      .from('goals')
      .insert(goalData)
      .select()
      .single();
    
    if (error) throw error;
    
    // Map the goal from database to frontend format
    const newGoal: Goal = {
      id: data.id,
      user_id: data.user_id,
      title: data.title,
      target: data.target,
      current: data.current || 0,
      type: data.type,
      period: data.period,
      start_date: new Date(data.start_date),
      end_date: new Date(data.end_date),
      created_at: new Date(data.created_at)
    };
    
    // Add to local state
    dispatch({ type: "ADD_GOAL", payload: newGoal });
    
    return newGoal;
  } catch (error: any) {
    console.error("Erro ao adicionar meta:", error);
    toast.error("Erro ao salvar meta");
    throw error;
  }
};
