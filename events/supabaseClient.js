const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://fpvpdpiblzbtniayptnj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwdnBkcGlibHpidG5pYXlwdG5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MjA4MDAsImV4cCI6MjA2ODQ5NjgwMH0.kItNXL58CCEjsxI0z2vF_r0mkMWhdTyR0UqzaZnCGf8; // keep this private and load from env in prod!

const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = supabase;
