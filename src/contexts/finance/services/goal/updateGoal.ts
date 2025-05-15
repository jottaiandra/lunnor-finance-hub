
import { Goal } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { FinanceAction } from "../../types";
import { toast } from "@/components/ui/sonner";

export const updateGoal = async (
  goal: Goal,
  userId: string,
  dispatch: React.Dispatch<FinanceAction>
): Promise<Goal | null> => {
  if (!userId) return null;
  
  try {
    // Prepare data for Supabase
    const goalData = {
      title: goal.title,
      target: goal.target,
      current: goal.current,
      type: goal.type,
      period: goal.period,
      start_date: goal.start_date instanceof Date ? goal.start_date.toISOString() : goal.start_date,
      end_date: goal.end_date instanceof Date ? goal.end_date.toISOString() : goal.end_date
    };
    
    // Update in Supabase
    const { error, data } = await supabase
      .from('goals')
      .update(goalData)
      .eq('id', goal.id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    
    // Map the goal from database to frontend format
    const updatedGoal: Goal = {
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
    
    // Update local state
    dispatch({ type: "UPDATE_GOAL", payload: updatedGoal });
    
    return updatedGoal;
  } catch (error: any) {
    console.error("Erro ao atualizar meta:", error);
    toast.error("Erro ao atualizar meta");
    throw error;
  }
};
