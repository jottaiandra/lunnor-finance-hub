
import { formatCurrency } from "@/lib/utils";
import { fetchWhatsappConfig } from "./configService";
import { getDefaultTemplate } from "./templateService";
import { logWhatsappMessage } from "./logsService";
import { supabase } from "@/integrations/supabase/client";

// Send WhatsApp message
export const sendWhatsappMessage = async (
  userId: string,
  config: any,
  eventType: string,
  data: Record<string, any>
): Promise<boolean> => {
  if (!userId || !config || !config.isEnabled) return false;
  
  try {
    // Fetch template for this event type
    const { data: templateData, error } = await supabase
      .from('whatsapp_templates')
      .select('*')
      .eq('user_id', userId)
      .eq('event_type', eventType)
      .single();
    
    if (error) {
      console.log("Error fetching message template, using default");
    }
    
    // Use default template if none found
    const messageTemplate = templateData?.message_template || getDefaultTemplate(eventType);
    
    // Replace placeholders in template
    let message = messageTemplate;
    Object.entries(data).forEach(([key, value]) => {
      // Format currency values
      if (key === 'valor' && typeof value === 'number') {
        value = formatCurrency(value);
      }
      // Format dates
      if (key === 'data' && value instanceof Date) {
        value = value.toLocaleDateString('pt-BR');
      }
      message = message.replace(`{${key}}`, String(value));
    });
    
    // In a real implementation, this would call the Evolution API to send the message
    // For now, we'll just log the message
    console.log(`WhatsApp message to ${config.recipientNumbers[0]}: ${message}`);
    
    // Log the sending attempt
    for (const recipient of config.recipientNumbers) {
      await logWhatsappMessage(userId, {
        eventType,
        message,
        recipient,
        status: 'sent' // In a real implementation, this would be 'pending' until confirmed
      });
    }
    
    return true;
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return false;
  }
};
