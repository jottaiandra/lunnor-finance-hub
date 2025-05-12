import { useCallback } from "react";
import { Goal } from "@/types";
import { fetchGoals, addGoal, updateGoal, deleteGoal } from "../goalService";
import { processNotification } from "../whatsappService";

export function useGoals(user: any, dispatch: any) {
  const handleFetchGoals = useCallback(async () => {
    if (!user) return;
    await fetchGoals(user.id, dispatch);
  }, [user, dispatch]);

  const handleAddGoal = useCallback(async (goal: Omit<Goal, "id">): Promise<Goal | null> => {
    if (!user) return null;
    try {
      // Make sure addGoal returns the actual goal object
      const newGoal = await addGoal(goal, user.id, dispatch);
      
      // Send WhatsApp notification for new goal
      if (newGoal && typeof newGoal === 'object') {
        await processNotification(user.id, 'goal_updated', {
          titulo: newGoal.title || 'Nova Meta',
          progresso: 0,
          nome: user.email?.split('@')[0] || 'Usuário'
        });
      }
      
      return newGoal;
    } catch (error) {
      console.error("Error in handleAddGoal:", error);
      return null;
    }
  }, [user, dispatch]);

  const handleUpdateGoal = useCallback(async (goal: Goal): Promise<Goal | null> => {
    if (!user) return null;
    try {
      // Make sure updateGoal returns the actual goal object
      const updatedGoal = await updateGoal(goal, user.id, dispatch);
      
      // Send WhatsApp notification for goal updates
      if (updatedGoal && typeof updatedGoal === 'object') {
        const current = updatedGoal.current || 0;
        const target = updatedGoal.target || 1;
        const progress = Math.round((current / target) * 100);
        
        // If goal is achieved, send achievement notification
        if (current >= target) {
          await processNotification(user.id, 'goal_achieved', {
            titulo: updatedGoal.title || 'Meta',
            progresso: progress,
            nome: user.email?.split('@')[0] || 'Usuário'
          });
        } else {
          // Otherwise send regular update notification
          await processNotification(user.id, 'goal_updated', {
            titulo: updatedGoal.title || 'Meta',
            progresso: progress,
            nome: user.email?.split('@')[0] || 'Usuário'
          });
        }
      }
      
      return updatedGoal;
    } catch (error) {
      console.error("Error in handleUpdateGoal:", error);
      return null;
    }
  }, [user, dispatch]);

  const handleDeleteGoal = useCallback(async (id: string) => {
    if (!user) return;
    await deleteGoal(id, user.id, dispatch);
  }, [user, dispatch]);

  return {
    fetchGoals: handleFetchGoals,
    addGoal: handleAddGoal,
    updateGoal: handleUpdateGoal,
    deleteGoal: handleDeleteGoal
  };
}
