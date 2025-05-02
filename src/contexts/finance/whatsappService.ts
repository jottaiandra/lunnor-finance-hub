
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { formatCurrency } from "@/lib/utils";

// Types for WhatsApp configuration
export interface WhatsappConfig {
  id: string;
  userId: string;
  apiToken: string;
  senderNumber: string;
  recipientNumbers: string[];
  isEnabled: boolean;
  notificationFrequency: 'immediate' | 'daily' | 'critical';
  createdAt: Date;
  updatedAt: Date;
}

// Types for message templates
export interface WhatsappTemplate {
  id: string;
  userId: string;
  eventType: string;
  messageTemplate: string;
  createdAt: Date;
  updatedAt: Date;
}

// Types for message logs
export interface WhatsappLog {
  id: string;
  userId: string;
  eventType: string;
  message: string;
  recipient: string;
  status: string;
  sentAt: Date;
  errorMessage?: string;
}

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

// Fetch WhatsApp templates
export const fetchWhatsappTemplates = async (userId: string): Promise<WhatsappTemplate[]> => {
  if (!userId) return [];
  
  try {
    const { data, error } = await supabase
      .from('whatsapp_templates')
      .select('*')
      .eq('user_id', userId)
      .order('event_type');
    
    if (error) throw error;
    
    if (!data) return [];
    
    return data.map(template => ({
      id: template.id,
      userId: template.user_id,
      eventType: template.event_type,
      messageTemplate: template.message_template,
      createdAt: new Date(template.created_at),
      updatedAt: new Date(template.updated_at)
    }));
  } catch (error: any) {
    console.error("Error fetching WhatsApp templates:", error);
    return [];
  }
};

// Save WhatsApp template
export const saveWhatsappTemplate = async (
  userId: string,
  template: { eventType: string; messageTemplate: string }
): Promise<WhatsappTemplate | null> => {
  if (!userId) return null;
  
  try {
    // Check if template exists
    const { data: existingTemplate } = await supabase
      .from('whatsapp_templates')
      .select('id')
      .eq('user_id', userId)
      .eq('event_type', template.eventType)
      .single();
    
    const templateData = {
      user_id: userId,
      event_type: template.eventType,
      message_template: template.messageTemplate,
      updated_at: new Date().toISOString()
    };
    
    if (existingTemplate) {
      // Update existing template
      const { data, error } = await supabase
        .from('whatsapp_templates')
        .update(templateData)
        .eq('id', existingTemplate.id)
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        userId: data.user_id,
        eventType: data.event_type,
        messageTemplate: data.message_template,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } else {
      // Create new template
      const { data, error } = await supabase
        .from('whatsapp_templates')
        .insert(templateData)
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        userId: data.user_id,
        eventType: data.event_type,
        messageTemplate: data.message_template,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    }
  } catch (error: any) {
    console.error("Error saving WhatsApp template:", error);
    toast.error("Erro ao salvar modelo de mensagem");
    return null;
  }
};

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

// Send WhatsApp message
export const sendWhatsappMessage = async (
  userId: string,
  config: WhatsappConfig,
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

// Default templates for different event types
const getDefaultTemplate = (eventType: string): string => {
  switch (eventType) {
    case 'new_income':
      return "Olá! Uma nova receita de {valor} foi registrada com a descrição: {descricao}.";
    case 'new_expense':
      return "Atenção! Uma nova despesa de {valor} foi registrada com a descrição: {descricao}.";
    case 'upcoming_expense':
      return "Lembrete: Você tem {count} despesa(s) a vencer nos próximos dias, totalizando {valor}.";
    case 'goal_achieved':
      return "Parabéns! Sua meta '{titulo}' foi atingida com sucesso!";
    case 'low_balance':
      return "Alerta! Seu saldo atual de {valor} está abaixo do limite definido.";
    case 'goal_updated':
      return "A meta '{titulo}' foi atualizada. Progresso atual: {progresso}%.";
    default:
      return "Notificação do Lunnor Caixa: {mensagem}";
  }
};

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
