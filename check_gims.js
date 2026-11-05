const { createClient } = require("@supabase/supabase-js");
const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await s.from("colleges").select("id, name, slug, city, state, location, courses_count, created_at, description").ilike("name", "%GIMS%");
  console.log("GIMS count:", data?.length, "Error:", error);
  console.log("Colleges:", JSON.stringify(data, null, 2));

  // Also check recently added colleges
  const { data: recent } = await s.from("colleges").select("id, name, slug, courses_count, created_at").order("created_at", { ascending: false }).limit(5);
  console.log("Recent 5 colleges added:", recent);
}

run();
