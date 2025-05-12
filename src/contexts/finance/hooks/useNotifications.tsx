
import { useCallback } from "react";
import { fetchNotifications, fetchAlerts, markAlertRead, markNotificationRead, hasUnreadNotifications } from "../notificationService";

export function useNotifications(user: any, state: any, dispatch: any) {
  const handleFetchNotifications = useCallback(async () => {
    if (!user) return;
    await fetchNotifications(user.id, dispatch);
  }, [user, dispatch]);

  const handleFetchAlerts = useCallback(async () => {
    if (!user) return;
    await fetchAlerts(user.id, dispatch);
  }, [user, dispatch]);

  const handleMarkAlertRead = useCallback(async (id: string) => {
    if (!user) return;
    await markAlertRead(id, user.id, dispatch);
  }, [user, dispatch]);

  const handleMarkNotificationRead = useCallback(async (id: string) => {
    if (!user) return;
    await markNotificationRead(id, user.id, dispatch);
  }, [user, dispatch]);

  const handleHasUnreadNotifications = useCallback(() => {
    return hasUnreadNotifications(state.notifications);
  }, [state.notifications]);

  return {
    fetchNotifications: handleFetchNotifications,
    fetchAlerts: handleFetchAlerts,
    markAlertRead: handleMarkAlertRead,
    markNotificationRead: handleMarkNotificationRead,
    hasUnreadNotifications: handleHasUnreadNotifications
  };
}
