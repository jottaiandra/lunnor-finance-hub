
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.29.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceRole);

    // Get the request body
    const settings = await req.json();

    // Get the user from the request
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1] ?? '';
    
    // Verify the user is an admin
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) throw new Error('Unauthorized');
    
    // Check if user is admin
    const { data: isAdmin, error: adminError } = await supabase
      .rpc('is_admin', { user_id: user.id });
    
    if (adminError || !isAdmin) throw new Error('Unauthorized: Admin access required');

    // Update the settings
    const { data, error } = await supabase
      .from('customization_settings')
      .update({
        platform_name: settings.platform_name,
        primary_color: settings.primary_color,
        secondary_color: settings.secondary_color,
        accent_color: settings.accent_color,
        positive_color: settings.positive_color,
        negative_color: settings.negative_color,
        top_gradient: settings.top_gradient,
        bottom_gradient: settings.bottom_gradient
      })
      .eq('id', 1)
      .single();

    if (error) throw error;
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
