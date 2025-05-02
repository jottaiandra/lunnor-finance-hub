
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestData {
  apiToken: string;
  senderNumber: string;
  recipientNumber: string;
  message: string;
  userId: string;
  eventType: string;
}

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
    const data: RequestData = await req.json();
    const { apiToken, senderNumber, recipientNumber, message, userId, eventType } = data;

    // Validate required fields
    if (!apiToken || !senderNumber || !recipientNumber || !message || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Here you would normally call the Evolution API
    // For this implementation, we'll simulate a successful API call
    
    // In a real implementation, you would do something like:
    /*
    const response = await fetch("https://evolution-api.example.com/message/sendText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiToken}`
      },
      body: JSON.stringify({
        number: recipientNumber,
        options: {
          delay: 1200
        },
        textMessage: {
          text: message
        }
      })
    });
    
    const result = await response.json();
    const success = result.status === 'success';
    */
    
    // Simulating success for now
    const success = true;
    const errorMessage = success ? null : "Falha ao enviar mensagem";
    
    // Log the message in the database
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
      console.error("Error logging message:", logError);
    }

    // Return response
    return new Response(
      JSON.stringify({ 
        success: success,
        message: success ? "Mensagem enviada com sucesso" : "Erro ao enviar mensagem",
        errorDetails: errorMessage
      }),
      { 
        status: success ? 200 : 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error:", error);
    
    return new Response(
      JSON.stringify({ error: "Internal Server Error", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
