
import { supabase } from "@/integrations/supabase/client";
import { WhatsappLog } from "./types";

// Fetch WhatsApp logs
export const fetchWhatsappLogs = async (userId: string): Promise<WhatsappLog[]> => {
  if (!userId) return [];
  
  try {
    const { data, error } = await supabase
      .from('whatsapp_logs')
      .select('*')
      .eq('user_id', userId)
      .order('sent_at', { ascending: false });
    
    if (error) throw error;
    
    if (!data) return [];
    
    return data.map(log => ({
      id: log.id,
      userId: log.user_id,
      eventType: log.event_type,
      message: log.message,
      recipient: log.recipient,
      status: log.status,
      sentAt: new Date(log.sent_at),
      errorMessage: log.error_message
    }));
  } catch (error: any) {
    console.error("Error fetching WhatsApp logs:", error);
    return [];
  }
};

// Log WhatsApp message
export const logWhatsappMessage = async (
  userId: string,
  log: {
    eventType: string;
    message: string;
    recipient: string;
    status: string;
    errorMessage?: string;
  }
): Promise<void> => {
  if (!userId) return;
  
  try {
    await supabase.from('whatsapp_logs').insert({
      user_id: userId,
      event_type: log.eventType,
      message: log.message,
      recipient: log.recipient,
      status: log.status,
      error_message: log.errorMessage
    });
  } catch (error) {
    console.error("Error logging WhatsApp message:", error);
  }
};
