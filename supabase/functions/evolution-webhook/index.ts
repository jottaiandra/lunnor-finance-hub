
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Token secreto para validação do webhook (opcional)
const WEBHOOK_SECRET_TOKEN = "DF53146D34F6-4999-A172-475485A2AC7C"; // Usando o mesmo token da API por simplicidade

serve(async (req) => {
  console.log("Webhook recebido:", new Date().toISOString());
  
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Validar token do webhook (se presente no header)
    const authHeader = req.headers.get("authorization") || req.headers.get("apikey");
    if (WEBHOOK_SECRET_TOKEN && authHeader && !authHeader.includes(WEBHOOK_SECRET_TOKEN)) {
      console.error("Token de webhook inválido");
      return new Response(
        JSON.stringify({ error: "Token de webhook inválido" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get request data
    const webhookData = await req.json();
    console.log("Dados do webhook:", JSON.stringify(webhookData));

    // Determine the event type and extract relevant info
    let eventType = webhookData.event || "unknown";
    let senderNumber = "";
    let recipientNumber = "";
    let content = "";
    let status = "received";
    let messageType = "text";
    let errorMessage = null;

    // Process based on Evolution API webhook structure
    if (webhookData.data) {
      // Para eventos de mensagem
      if (eventType.includes("message") && webhookData.data.key) {
        senderNumber = webhookData.data.key.remoteJid?.replace("@s.whatsapp.net", "") || "";
        recipientNumber = webhookData.data.key.id?.participant || webhookData.instance || "";
        
        // Extrair conteúdo da mensagem
        if (webhookData.data.message) {
          if (webhookData.data.message.conversation) {
            content = webhookData.data.message.conversation;
          } else if (webhookData.data.message.extendedTextMessage) {
            content = webhookData.data.message.extendedTextMessage.text;
          } else if (webhookData.data.message.imageMessage) {
            content = webhookData.data.message.imageMessage.caption || "Imagem recebida";
            messageType = "image";
          } else if (webhookData.data.message.documentMessage) {
            content = webhookData.data.message.documentMessage.fileName || "Documento recebido";
            messageType = "document";
          } else if (webhookData.data.message.audioMessage) {
            content = "Áudio recebido";
            messageType = "audio";
          } else if (webhookData.data.message.videoMessage) {
            content = webhookData.data.message.videoMessage.caption || "Vídeo recebido";
            messageType = "video";
          } else if (webhookData.data.message.stickerMessage) {
            content = "Sticker recebido";
            messageType = "sticker";
          } else if (webhookData.data.message.locationMessage) {
            content = "Localização recebida";
            messageType = "location";
          } else if (webhookData.data.message.contactMessage) {
            content = "Contato recebido";
            messageType = "contact";
          } else {
            content = JSON.stringify(webhookData.data.message);
            messageType = "other";
          }
        }
      }
      
      // Para eventos de status e conexão
      if (eventType.includes("status") || eventType.includes("connection")) {
        status = eventType;
        content = JSON.stringify(webhookData.data);
      }
    }

    // Armazenar dados de webhook na tabela evolution_webhook_events
    const { data: webhookLogData, error: webhookLogError } = await supabase
      .from('evolution_webhook_events')
      .insert({
        event_type: eventType,
        sender_number: senderNumber,
        recipient_number: recipientNumber,
        content: content,
        message_type: messageType,
        status: status,
        raw_data: webhookData
      });
      
    if (webhookLogError) {
      console.error("Erro ao registrar evento de webhook:", webhookLogError);
      throw webhookLogError;
    }

    console.log("Webhook processado com sucesso:", eventType);

    // Retornar resposta bem-sucedida
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Webhook recebido e processado com sucesso",
        event: eventType
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    
    // Mesmo em caso de erro, retornamos 200 para evitar reenvios
    return new Response(
      JSON.stringify({ 
        success: false,
        error: "Erro ao processar webhook", 
        details: error.message 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
