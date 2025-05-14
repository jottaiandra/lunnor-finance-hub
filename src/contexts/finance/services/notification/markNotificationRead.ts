
import { supabase } from "@/integrations/supabase/client";

// Mark a notification as read
export const markNotificationRead = async (id: string, userId: string, dispatch: any) => {
  if (!userId) return;
  
  try {
    // Update in Supabase
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);
    
    if (error) throw error;
    
    // Update local state
    dispatch({ type: "MARK_NOTIFICATION_READ", payload: id });
  } catch (error: any) {
    console.error("Erro ao marcar notificação como lida:", error);
    throw error;
  }
};
