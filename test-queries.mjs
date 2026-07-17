import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

// Load environment variables manually
const env = {};
for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim().replace(/^"|"$/g, "");
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Use service role key to inspect database structure
const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function test() {
  console.log("Starting queries test...");
  
  // Find a user ID to test with
  const { data: { users } } = await admin.auth.admin.listUsers();
  if (!users?.length) {
    console.log("No users found in database to test queries with.");
    return;
  }
  
  const testUser = users[0];
  console.log(`Testing queries for User ID: ${testUser.id} (${testUser.email})`);
  
  try {
    console.log("1. Querying forms...");
    const formRes = await supabase
      .from("forms")
      .select("id, slug")
      .eq("user_id", testUser.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    console.log("Forms query done:", formRes.data, formRes.error);
    
    console.log("2. Querying testimonials...");
    const testRes = await supabase
      .from("testimonials")
      .select("id, status, rating, display_body, author_name, author_role, avatar_url, created_at")
      .eq("user_id", testUser.id);
    console.log("Testimonials query done: count =", testRes.data?.length, testRes.error);
    
    console.log("3. Querying profiles...");
    const profRes = await supabase
      .from("profiles")
      .select("is_lifetime, plan_tier, created_at, full_name")
      .eq("id", testUser.id)
      .maybeSingle();
    console.log("Profiles query done:", profRes.data, profRes.error);
    
  } catch (err) {
    console.error("Error during queries:", err);
  }
}

test();
