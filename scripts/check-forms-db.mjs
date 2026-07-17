import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = {};
for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim().replace(/^"|"$/g, "");
}
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const userId = "6e037975-54db-4705-b239-28ef18f95eb8";

async function run() {
  const { data: forms, error } = await supabase
    .from("forms")
    .select("id, slug, headline, user_id")
    .eq("user_id", userId);
  
  if (error) {
    console.error("Error fetching forms:", error);
    return;
  }
  
  console.log(`User has ${forms.length} forms in DB:`);
  console.log(JSON.stringify(forms, null, 2));
}

run();
