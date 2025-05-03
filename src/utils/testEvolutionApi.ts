
import { supabase } from "@/integrations/supabase/client";

// Interface para os dados do teste
interface TestData {
  recipientNumber: string;
  message: string;
}

/**
 * Testa o envio de mensagem pela Evolution API
 * @param data Dados para teste
 * @returns Resultado do teste
 */
export const testSendMessage = async (data: TestData) => {
  try {
    const { recipientNumber, message } = data;
    
    const response = await supabase.functions.invoke('whatsapp-send', {
      body: {
        recipientNumber,
        message
      }
    });
    
    return {
      success: response.data?.success,
      message: response.data?.message,
      data: response.data
    };
  } catch (error) {
    console.error("Erro ao testar envio de mensagem:", error);
    return {
      success: false,
      error: error.message || "Erro desconhecido ao enviar mensagem",
      data: null
    };
  }
};

/**
 * Recupera os últimos logs de webhook
 * @param limit Número máximo de logs para retornar
 * @returns Logs de webhook
 */
export const getLatestWebhookLogs = async (limit = 5) => {
  try {
    const { data, error } = await supabase
      .from('evolution_webhook_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) throw error;
    
    return {
      success: true,
      logs: data
    };
  } catch (error) {
    console.error("Erro ao obter logs de webhook:", error);
    return {
      success: false,
      error: error.message,
      logs: []
    };
  }
};
