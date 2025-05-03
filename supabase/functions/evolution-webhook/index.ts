
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
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
    const webhookData = await req.json();
    console.log("Received webhook data:", webhookData);

    // Determine the event type and extract relevant info
    let eventType = "unknown";
    let senderNumber = "";
    let recipientNumber = "";
    let content = "";
    let status = "received";
    let messageType = "text";
    let errorMessage = null;

    // Process based on Evolution API webhook structure
    if (webhookData.event) {
      eventType = webhookData.event;
      
      if (webhookData.data) {
        // For message events
        if (eventType.includes("message") && webhookData.data.key) {
          senderNumber = webhookData.data.key.remoteJid?.replace("@s.whatsapp.net", "") || "";
          recipientNumber = webhookData.data.key.id?.participant || webhookData.instance || "";
          
          // Extract message content
          if (webhookData.data.message) {
            if (webhookData.data.message.conversation) {
              content = webhookData.data.message.conversation;
            } else if (webhookData.data.message.extendedTextMessage) {
              content = webhookData.data.message.extendedTextMessage.text;
            } else if (webhookData.data.message.imageMessage) {
              content = webhookData.data.message.imageMessage.caption || "Image received";
              messageType = "image";
            } else {
              content = JSON.stringify(webhookData.data.message);
              messageType = "other";
            }
          }
        }
        
        // For status events
        if (eventType.includes("status") || eventType.includes("connection")) {
          status = eventType;
          content = JSON.stringify(webhookData.data);
        }
      }
    }

    // Store webhook data in the evolution_webhook_events table
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
      console.error("Error logging webhook event:", webhookLogError);
      throw webhookLogError;
    }

    // Return successful response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Webhook received and processed successfully" 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    
    return new Response(
      JSON.stringify({ error: "Error processing webhook", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
