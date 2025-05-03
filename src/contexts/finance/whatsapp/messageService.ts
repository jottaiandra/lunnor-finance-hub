
import { formatCurrency } from "@/lib/utils";
import { fetchWhatsappConfig } from "./configService";
import { getDefaultTemplate } from "./templateService";
import { logWhatsappMessage } from "./logsService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

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
    
    // Send message via Edge Function
    for (const recipient of config.recipientNumbers) {
      try {
        const response = await supabase.functions.invoke('whatsapp-send', {
          body: {
            apiToken: config.apiToken,
            senderNumber: config.senderNumber,
            recipientNumber: recipient,
            message: message,
            userId: userId,
            eventType: eventType
          }
        });
        
        console.log('Edge function response:', response);
        
        if (response.error) {
          throw new Error(response.error);
        }
        
      } catch (error) {
        console.error("Error calling WhatsApp send function:", error);
        toast.error(`Erro ao enviar mensagem para ${recipient}`);
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
    return false;
  }
};
