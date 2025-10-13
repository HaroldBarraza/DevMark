import { supabase } from "@/app/lib/supabaseClient";

/**
 * Registers a new user with email and password
 * @param email - User's email address
 * @param password - User's password
 * @returns Supabase auth response with user data and potential error
 */
export const signUpUser = async (email: string, password: string) => {
  return supabase.auth.signUp({ email, password });
};

/**
 * Authenticates an existing user with email and password
 * @param email - User's email address
 * @param password - User's password
 * @returns Supabase auth response with session data and potential error
 */
export const signInUser = async (email: string, password: string) => {
  return supabase.auth.signInWithPassword({ email, password });
};

/**
 * Retrieves user profile data from the database
 * @param userId - The unique identifier of the user
 * @returns User profile data and potential error
 */
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return { data, error };
};

/**
 * Updates the user profile's last modified timestamp
 * @param userId - The unique identifier of the user to update
 * @returns Update operation result with data and potential error
 */
export const updateProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .update({ updatedAt: new Date().toISOString() })
    .eq("id", userId);
  return { data, error };
};