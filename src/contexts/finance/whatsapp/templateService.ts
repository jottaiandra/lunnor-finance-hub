
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { WhatsappTemplate } from "./types";

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

// Default templates for different event types
export const getDefaultTemplate = (eventType: string): string => {
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
