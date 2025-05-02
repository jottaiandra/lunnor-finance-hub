
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { WhatsappConfig } from "./types";

// Fetch WhatsApp configuration
export const fetchWhatsappConfig = async (userId: string): Promise<WhatsappConfig | null> => {
  if (!userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('whatsapp_config')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      if (error.code !== 'PGRST116') { // Not found error
        console.error("Error fetching WhatsApp config:", error);
      }
      return null;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      userId: data.user_id,
      apiToken: data.api_token,
      senderNumber: data.sender_number,
      recipientNumbers: data.recipient_numbers,
      isEnabled: data.is_enabled,
      notificationFrequency: data.notification_frequency as 'immediate' | 'daily' | 'critical',
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  } catch (error: any) {
    console.error("Error fetching WhatsApp config:", error);
    return null;
  }
};

// Save WhatsApp configuration
export const saveWhatsappConfig = async (
  userId: string, 
  config: Omit<WhatsappConfig, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<WhatsappConfig | null> => {
  if (!userId) return null;
  
  try {
    // Check if config exists
    const { data: existingConfig } = await supabase
      .from('whatsapp_config')
      .select('id')
      .eq('user_id', userId)
      .single();
    
    const configData = {
      user_id: userId,
      api_token: config.apiToken,
      sender_number: config.senderNumber,
      recipient_numbers: config.recipientNumbers,
      is_enabled: config.isEnabled,
      notification_frequency: config.notificationFrequency,
      updated_at: new Date().toISOString()
    };
    
    if (existingConfig) {
      // Update existing config
      const { data, error } = await supabase
        .from('whatsapp_config')
        .update(configData)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        userId: data.user_id,
        apiToken: data.api_token,
        senderNumber: data.sender_number,
        recipientNumbers: data.recipient_numbers,
        isEnabled: data.is_enabled,
        notificationFrequency: data.notification_frequency as 'immediate' | 'daily' | 'critical',
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } else {
      // Create new config
      const { data, error } = await supabase
        .from('whatsapp_config')
        .insert(configData)
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        userId: data.user_id,
        apiToken: data.api_token,
        senderNumber: data.sender_number,
        recipientNumbers: data.recipient_numbers,
        isEnabled: data.is_enabled,
        notificationFrequency: data.notification_frequency as 'immediate' | 'daily' | 'critical',
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    }
  } catch (error: any) {
    console.error("Error saving WhatsApp config:", error);
    toast.error("Erro ao salvar configuração do WhatsApp");
    return null;
  }
};

// Test WhatsApp configuration
export const testWhatsappConnection = async (
  apiToken: string,
  senderNumber: string,
  recipientNumber: string
): Promise<boolean> => {
  try {
    // In a real implementation, this would call the Evolution API
    // For now, we'll simulate a successful connection
    const response = await fetch('https://api.example.com/evolution/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`
      },
      body: JSON.stringify({
        sender: senderNumber,
        recipient: recipientNumber,
        message: "Teste de conexão do Lunnor Caixa"
      })
    });
    
    // Since this is a simulation, we'll just return true
    return true;
    
    // In a real application, you'd check the response like this:
    // const data = await response.json();
    // return data.success === true;
  } catch (error) {
    console.error("Error testing WhatsApp connection:", error);
    return false;
  }
};
