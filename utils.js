require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Fetch a user by Discord user ID from Supabase `users` table.
 * @param {string} userId Discord user ID
 * @returns {Promise<Object|null>} User data or null if not found
 */
async function getUser(userId) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error && error.code !== "PGRST116") { // Ignore 'no rows found' error
    console.error("Error fetching user:", error);
    return null;
  }
  return data;
}

/**
 * Insert or update a user record in Supabase `users` table.
 * The user object must have an `id` property.
 * @param {Object} user User data to upsert
 * @returns {Promise<Object|null>} Inserted/updated user data or null on error
 */
async function saveUser(user) {
  const { data, error } = await supabase
    .from("users")
    .upsert(user, { onConflict: "id" });

  if (error) {
    console.error("Error saving user:", error);
    return null;
  }
  return data;
}

module.exports = {
  supabase,
  getUser,
  saveUser,
};
