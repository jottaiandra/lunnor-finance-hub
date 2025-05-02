
import { supabase } from "@/integrations/supabase/client";
import { mapNotificationFromDB, mapAlertFromDB } from "./mappers";

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

// Fetch alerts from Supabase
export const fetchAlerts = async (userId: string, dispatch: any) => {
  if (!userId) return;
  
  try {
    dispatch({ type: "SET_LOADING", payload: { key: 'alerts', value: true } });
    
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    const mappedAlerts = data.map(mapAlertFromDB);
    dispatch({ type: "SET_ALERTS", payload: mappedAlerts });
  } catch (error: any) {
    console.error("Erro ao buscar alertas:", error);
    dispatch({ type: "SET_ERROR", payload: error.message });
  } finally {
    dispatch({ type: "SET_LOADING", payload: { key: 'alerts', value: false } });
  }
};

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

// Check if there are any unread notifications
export const hasUnreadNotifications = (notifications: any[]) => {
  return notifications.some(notification => !notification.isRead);
};
