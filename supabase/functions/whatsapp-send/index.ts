
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestData {
  apiToken?: string;
  senderNumber?: string;
  recipientNumber: string;
  message: string;
  userId?: string;
  eventType?: string;
  templateData?: Record<string, string>; // Dados para template
  messageType?: 'text' | 'template' | 'image' | 'file' | 'button';
  mediaUrl?: string; // URL para mídia (imagens, documentos)
}

// Configurações padrão da Evolution API
const DEFAULT_API_TOKEN = "DF53146D34F6-4999-A172-475485A2AC7C";
const DEFAULT_SENDER_NUMBER = "558391618969";
const EVOLUTION_API_BASE_URL = "https://evolution.anayaatendente.online";

serve(async (req) => {
  console.log("Requisição recebida para envio de WhatsApp:", new Date().toISOString());
  
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get request data
    const data: RequestData = await req.json();
    const { 
      apiToken = DEFAULT_API_TOKEN, 
      senderNumber = DEFAULT_SENDER_NUMBER, 
      recipientNumber, 
      message, 
      userId, 
      eventType = "message_send", 
      templateData,
      messageType = "text",
      mediaUrl
    } = data;

    // Validar campos obrigatórios
    if (!recipientNumber || !message) {
      return new Response(
        JSON.stringify({ error: "Campos obrigatórios ausentes: recipientNumber e message são necessários" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Enviando mensagem para ${recipientNumber} usando ${senderNumber}`);

    // Preparar o corpo da requisição conforme o tipo de mensagem
    let apiEndpoint = `${EVOLUTION_API_BASE_URL}/message/sendText/${senderNumber}`;
    let requestBody: any = {
      number: recipientNumber,
      options: {
        delay: 1200
      }
    };

    switch (messageType) {
      case 'text':
        requestBody.textMessage = { text: message };
        break;
      
      case 'template':
        apiEndpoint = `${EVOLUTION_API_BASE_URL}/message/sendTemplate/${senderNumber}`;
        requestBody = {
          number: recipientNumber,
          templateName: message,
          templateData: templateData || {}
        };
        break;
      
      case 'image':
        apiEndpoint = `${EVOLUTION_API_BASE_URL}/message/sendImage/${senderNumber}`;
        requestBody = {
          number: recipientNumber,
          image: mediaUrl,
          caption: message
        };
        break;
        
      case 'file':
        apiEndpoint = `${EVOLUTION_API_BASE_URL}/message/sendFile/${senderNumber}`;
        requestBody = {
          number: recipientNumber,
          document: mediaUrl,
          fileName: message
        };
        break;
        
      case 'button':
        apiEndpoint = `${EVOLUTION_API_BASE_URL}/message/sendButton/${senderNumber}`;
        requestBody = {
          number: recipientNumber,
          buttonText: message,
          buttons: templateData ? Object.values(templateData) : ['Sim', 'Não'],
          title: "Botões",
          footer: "Powered by Evolution API"
        };
        break;
    }

    // Chamada à Evolution API
    let success = false;
    let responseData = null;
    let errorMessage = null;

    try {
      console.log(`Chamando endpoint: ${apiEndpoint}`);
      console.log(`Corpo da requisição: ${JSON.stringify(requestBody)}`);
      
      const evolutionResponse = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": apiToken
        },
        body: JSON.stringify(requestBody)
      });
      
      responseData = await evolutionResponse.json();
      success = evolutionResponse.ok && responseData?.status === 'success';
      
      console.log(`Resposta da Evolution API: ${JSON.stringify(responseData)}`);
      
      if (!success) {
        errorMessage = responseData?.error?.message || "Falha ao enviar mensagem";
        console.error(`Erro na resposta: ${errorMessage}`);
      }
    } catch (apiError) {
      console.error("Erro ao chamar Evolution API:", apiError);
      errorMessage = apiError.message;
      responseData = { error: apiError.message };
    }
    
    // Registrar o log da mensagem na tabela whatsapp_logs (para interface do usuário)
    if (userId) {
      const { error: logError } = await supabase
        .from('whatsapp_logs')
        .insert({
          user_id: userId,
          event_type: eventType,
          message: message,
          recipient: recipientNumber,
          status: success ? 'sent' : 'failed',
          error_message: errorMessage
        });
        
      if (logError) {
        console.error("Erro ao registrar mensagem em whatsapp_logs:", logError);
      }
    }
    
    // Registrar log detalhado da mensagem em whatsapp_message_logs (para admin)
    const { error: detailedLogError } = await supabase
      .from('whatsapp_message_logs')
      .insert({
        number: recipientNumber,
        message: message,
        status: success ? 'success' : 'failed',
        response: responseData
      });
      
    if (detailedLogError) {
      console.error("Erro ao registrar log detalhado da mensagem:", detailedLogError);
    }

    // Retornar resposta
    return new Response(
      JSON.stringify({ 
        success: success,
        message: success ? "Mensagem enviada com sucesso" : "Erro ao enviar mensagem",
        errorDetails: errorMessage,
        responseData: responseData
      }),
      { 
        status: success ? 200 : 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Erro interno:", error);
    
    return new Response(
      JSON.stringify({ error: "Erro interno do servidor", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
