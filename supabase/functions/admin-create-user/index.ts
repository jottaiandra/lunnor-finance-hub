
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          persistSession: false,
        }
      }
    );

    // Create a Supabase client with the request's authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );

    // Verify the requesting user is an admin
    const {
      data: { user },
    } = await supabase.auth.getUser();
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not authenticated" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if the user is an admin using RPC function
    const { data: isAdmin, error: adminCheckError } = await supabase.rpc("is_admin", { 
      user_id: user.id 
    });

    if (adminCheckError || !isAdmin) {
      return new Response(
        JSON.stringify({ error: "Unauthorized. Only admins can perform this action." }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get the request body
    const requestData = await req.json();
    
    // Check what action to perform
    if (requestData.action === "delete") {
      // Delete user action
      const { userId } = requestData;
      
      if (!userId) {
        return new Response(
          JSON.stringify({ error: "User ID is required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
      
      if (deleteError) {
        return new Response(
          JSON.stringify({ error: deleteError.message }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      return new Response(
        JSON.stringify({ success: true }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } else {
      // Create user action
      const { email, password, firstName, lastName, isAdmin: makeUserAdmin } = requestData;

      // Create the user with the service role key
      const { data, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          first_name: firstName,
          last_name: lastName
        }
      });

      if (createUserError) {
        return new Response(
          JSON.stringify({ error: createUserError.message }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // If user should be admin, update their role in the profiles table
      if (makeUserAdmin && data.user) {
        const { error: updateRoleError } = await supabaseAdmin
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', data.user.id);
        
        if (updateRoleError) {
          return new Response(
            JSON.stringify({ 
              warning: "Usuário criado, mas houve um erro ao definir o papel de administrador",
              error: updateRoleError.message,
              user: data.user
            }),
            {
              status: 207, // Partial success
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      }

      // Return the created user
      return new Response(
        JSON.stringify({ user: data.user }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
