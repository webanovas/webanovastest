import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify caller is admin
    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: caller } } = await callerClient.auth.getUser();
    if (!caller) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Check caller is admin
    const { data: isAdmin } = await adminClient.rpc("has_role", { _user_id: caller.id, _role: "admin" });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { action, email } = await req.json();

    if (action === "list") {
      // List all admins
      const { data: roles } = await adminClient.from("user_roles").select("*").eq("role", "admin");
      const admins = [];
      for (const role of roles || []) {
        const { data: { user } } = await adminClient.auth.admin.getUserById(role.user_id);
        admins.push({ id: role.id, user_id: role.user_id, email: user?.email || "unknown" });
      }
      return new Response(JSON.stringify({ admins }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "add") {
      if (!email) {
        return new Response(JSON.stringify({ error: "Email is required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // Check if user exists
      const { data: { users } } = await adminClient.auth.admin.listUsers();
      let targetUser = users?.find((u) => u.email === email);

      if (!targetUser) {
        // Create user with random password
        const tempPassword = crypto.randomUUID();
        const { data: newUser, error: createErr } = await adminClient.auth.admin.createUser({
          email,
          password: tempPassword,
          email_confirm: true,
        });
        if (createErr) {
          return new Response(JSON.stringify({ error: createErr.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        targetUser = newUser.user;
      }

      // Send a password reset email so the new admin can set their own password
      const origin = req.headers.get("origin") || req.headers.get("referer")?.replace(/\/$/, "") || supabaseUrl;
      const { error: resetErr } = await adminClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/reset-password`,
      });
      const resetSent = !resetErr;
      if (resetErr) {
        console.error("Failed to send reset email:", resetErr.message);
      }

      // Check if already admin
      const { data: existing } = await adminClient.from("user_roles").select("id").eq("user_id", targetUser.id).eq("role", "admin").maybeSingle();
      if (existing) {
        return new Response(JSON.stringify({ error: "User is already an admin" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // Add admin role
      const { error: insertErr } = await adminClient.from("user_roles").insert({ user_id: targetUser.id, role: "admin" });
      if (insertErr) {
        return new Response(JSON.stringify({ error: insertErr.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      return new Response(JSON.stringify({ success: true, email, resetSent }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "remove") {
      if (!email) {
        return new Response(JSON.stringify({ error: "Email is required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      // Don't let admin remove themselves
      if (caller.email === email) {
        return new Response(JSON.stringify({ error: "Cannot remove yourself" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const { data: { users } } = await adminClient.auth.admin.listUsers();
      const targetUser = users?.find((u) => u.email === email);
      if (!targetUser) {
        return new Response(JSON.stringify({ error: "User not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const { error: delErr } = await adminClient.from("user_roles").delete().eq("user_id", targetUser.id).eq("role", "admin");
      if (delErr) {
        return new Response(JSON.stringify({ error: delErr.message }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
