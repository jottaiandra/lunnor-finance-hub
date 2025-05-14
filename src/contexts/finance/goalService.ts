
import { supabase } from "@/integrations/supabase/client";
import { Goal } from "@/types";
import { mapGoalFromDB } from "./mappers";
import { toast } from "@/components/ui/sonner";

// Fetch goals from Supabase
export const fetchGoals = async (userId: string, dispatch: any) => {
  if (!userId) {
    console.log("No user authenticated, skipping goal fetch");
    return;
  }
  
  try {
    // Set loading state at the beginning
    dispatch({ type: "SET_LOADING", payload: { key: 'goals', value: true } });
    
    console.log("Fetching goals for user:", userId);
    
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Supabase error fetching goals:", error);
      throw error;
    }
    
    if (!data) {
      console.log("No goals data returned");
      dispatch({ type: "SET_GOALS", payload: [] });
      return;
    }
    
    console.log("Goals fetched successfully:", data.length);
    
    // Map the data and handle potential mapping errors
    const mappedGoals: Goal[] = [];
    
    for (const item of data) {
      try {
        const goal = mapGoalFromDB(item);
        mappedGoals.push(goal);
      } catch (mappingError) {
        console.error("Error mapping a goal:", mappingError, item);
        // Skip this item instead of breaking the whole list
      }
    }
    
    dispatch({ type: "SET_GOALS", payload: mappedGoals });
  } catch (error: any) {
    console.error("Error fetching goals:", error);
    toast.error("Erro ao carregar metas");
    dispatch({ type: "SET_ERROR", payload: error.message });
    // Set empty array on error to prevent UI issues
    dispatch({ type: "SET_GOALS", payload: [] });
  } finally {
    // Always set loading to false when done
    dispatch({ type: "SET_LOADING", payload: { key: 'goals', value: false } });
  }
};

// Add a new goal
export const addGoal = async (goal: Omit<Goal, "id">, userId: string, dispatch: any): Promise<Goal | null> => {
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
    
    // Add to local state
    const newGoal = mapGoalFromDB(data);
    dispatch({ type: "ADD_GOAL", payload: newGoal });
    
    return newGoal;
  } catch (error: any) {
    console.error("Erro ao adicionar meta:", error);
    toast.error("Erro ao salvar meta");
    throw error;
  }
};

// Update an existing goal
export const updateGoal = async (goal: Goal, userId: string, dispatch: any): Promise<Goal | null> => {
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
      .select()
      .single();
    
    if (error) throw error;
    
    // Update local state
    dispatch({ type: "UPDATE_GOAL", payload: goal });
    
    return goal;
  } catch (error: any) {
    console.error("Erro ao atualizar meta:", error);
    toast.error("Erro ao atualizar meta");
    throw error;
  }
};

// Delete a goal
export const deleteGoal = async (id: string, userId: string, dispatch: any) => {
  if (!userId) return;
  
  try {
    console.log("Deleting goal:", id);
    
    // Delete from Supabase
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Supabase error deleting goal:", error);
      throw error;
    }
    
    // Remove from local state
    dispatch({ type: "DELETE_GOAL", payload: id });
    console.log("Goal deleted successfully");
  } catch (error: any) {
    console.error("Error deleting goal:", error);
    toast.error("Erro ao excluir meta");
    throw error;
  }
};
