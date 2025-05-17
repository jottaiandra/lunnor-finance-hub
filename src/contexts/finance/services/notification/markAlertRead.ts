
import { supabase } from "@/integrations/supabase/client";

// Mark an alert as read
export const markAlertRead = async (id: string, userId: string, dispatch: any) => {
  if (!userId) return;
  
  try {
    // Update in Supabase
    const { error } = await supabase
      .from('alerts')
      .update({ read: true })
      .eq('id', id);
    
    if (error) throw error;
    
    // Update local state
    dispatch({ type: "MARK_ALERT_READ", payload: id });
  } catch (error: any) {
    console.error("Erro ao marcar alerta como lido:", error);
    throw error;
  }
};
