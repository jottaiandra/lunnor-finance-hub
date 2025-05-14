
import { supabase } from "@/integrations/supabase/client";
import { mapNotificationFromDB } from "../../mappers";

// Fetch notifications from Supabase
export const fetchNotifications = async (userId: string, dispatch: any) => {
  if (!userId) return;
  
  try {
    dispatch({ type: "SET_LOADING", payload: { key: 'notifications', value: true } });
    
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    const mappedNotifications = data.map(mapNotificationFromDB);
    dispatch({ type: "SET_NOTIFICATIONS", payload: mappedNotifications });
  } catch (error: any) {
    console.error("Erro ao buscar notificações:", error);
    dispatch({ type: "SET_ERROR", payload: error.message });
  } finally {
    dispatch({ type: "SET_LOADING", payload: { key: 'notifications', value: false } });
  }
};
