// supabase.js – shared Supabase client for the server
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

let supabaseUrl = process.env.SUPABASE_URL;
let supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("⚠️ SUPABASE_URL or SUPABASE_ANON_KEY missing in .env file. Running in local demo mode.");
  supabaseUrl = "https://example.supabase.co";
  supabaseKey = "demo-key";
}

// Clean URL formatting (removes trailing slashes or /rest/v1 if included)
supabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
