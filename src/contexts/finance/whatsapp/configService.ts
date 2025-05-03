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

// Test WhatsApp connection
export const testWhatsappConnection = async (
  apiToken: string,
  senderNumber: string,
  recipientNumber: string
): Promise<boolean> => {
  const EVOLUTION_API_BASE_URL = "https://evolution.anayaatendente.online";
  
  try {
    // Fazer uma chamada para a Evolution API para enviar uma mensagem de teste
    const evolutionResponse = await fetch(`${EVOLUTION_API_BASE_URL}/message/sendText/${senderNumber}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": apiToken
      },
      body: JSON.stringify({
        number: recipientNumber,
        options: {
          delay: 1200
        },
        textMessage: {
          text: "Teste de conexão com a Evolution API realizado com sucesso."
        }
      })
    });
    
    const responseData = await evolutionResponse.json();
    console.log('Resposta da API Evolution (teste):', responseData);
    
    return evolutionResponse.ok && responseData?.status === 'success';
  } catch (error) {
    console.error("Erro ao testar conexão WhatsApp:", error);
    return false;
  }
};
