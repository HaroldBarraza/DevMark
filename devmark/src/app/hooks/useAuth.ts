import { supabase } from "@/app/lib/supabaseClient";

export const signUpUser = async (email: string, password: string) => {
  return supabase.auth.signUp({ email, password });
};

export const signInUser = async (email: string, password: string) => {
  return supabase.auth.signInWithPassword({ email, password });
};

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
  return { data, error };
};
export const updateProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase.from("profiles").update(updates).eq("id", userId);
  return { data, error };
}