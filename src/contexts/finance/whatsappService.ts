
import { WhatsappConfig, WhatsappTemplate, WhatsappLog } from './whatsapp/types';
import { fetchWhatsappConfig, saveWhatsappConfig, testWhatsappConnection, configureWebhook } from './whatsapp/configService';
import { fetchWhatsappTemplates, saveWhatsappTemplate, getDefaultTemplate } from './whatsapp/templateService';
import { fetchWhatsappLogs, logWhatsappMessage } from './whatsapp/logsService';
import { sendWhatsappMessage } from './whatsapp/messageService';

// Process notification by notification frequency
export const processNotification = async (
  userId: string,
  eventType: string,
  data: Record<string, any>
): Promise<void> => {
  try {
    // Get WhatsApp config
    const config = await fetchWhatsappConfig(userId);
    
    // If WhatsApp is not configured or disabled, exit early
    if (!config || !config.isEnabled) return;
    
    // Check if we should send now based on notification frequency
    switch (config.notificationFrequency) {
      case 'immediate':
        // Send immediately for all events
        await sendWhatsappMessage(userId, config, eventType, data);
        break;
      
      case 'daily':
        // For daily notifications, we'd typically queue these for a digest
        // In a real implementation, you'd store this in a "pending notifications" table
        // and a scheduled job would send a daily digest
        console.log(`Queued for daily digest: ${eventType}`);
        break;
      
      case 'critical':
        // Only send for critical events
        if (['low_balance', 'upcoming_expense', 'goal_achieved'].includes(eventType)) {
          await sendWhatsappMessage(userId, config, eventType, data);
        }
        break;
    }
  } catch (error) {
    console.error("Error processing notification:", error);
  }
};

// Re-export types
export type { WhatsappConfig, WhatsappTemplate, WhatsappLog };

// Re-export all WhatsApp related services
export {
  fetchWhatsappConfig,
  saveWhatsappConfig,
  testWhatsappConnection,
  configureWebhook,
  fetchWhatsappTemplates,
  saveWhatsappTemplate,
  getDefaultTemplate,
  fetchWhatsappLogs,
  logWhatsappMessage,
  sendWhatsappMessage
};
