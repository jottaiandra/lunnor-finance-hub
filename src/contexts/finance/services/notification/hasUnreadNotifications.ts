
import { Notification } from "@/types";

// Check if there are any unread notifications
export const hasUnreadNotifications = (notifications: Notification[]) => {
  return notifications.some(notification => !notification.isRead);
};
