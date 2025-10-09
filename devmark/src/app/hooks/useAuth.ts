import { supabase } from "@/app/lib/supabaseClient";
import type { Profile } from "@/app/lib/types";
import type { PostgrestError, AuthError } from "@supabase/supabase-js";

// ======================================
// Tipos e Interfaces
// ======================================
export type ProfileUpdates = Partial<Omit<Profile, "id">>;

// Acepta tanto errores de Auth como de PostgREST
interface SupabaseResponse<T> {
  data: T | null;
  error: PostgrestError | AuthError | null;
}

// ======================================
// Registro de usuario
// ======================================
export const signUpUser = async (
  email: string,
  password: string
): Promise<SupabaseResponse<{ user: { id: string; email: string } }>> => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error || !data.user) return { data: null, error };

  // Esperar a que el trigger cree el perfil
  let profile = null;
  for (let i = 0; i < 5; i++) {
    const { data: p } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (p) {
      profile = p;
      break;
    }

    await new Promise((res) => setTimeout(res, 300)); // Espera 300 ms
  }

  return {
    data: { user: { id: data.user.id, email: data.user.email! } },
    error: profile ? null : error,
  };
};

// ======================================
// Inicio de sesión
// ======================================
export const signInUser = async (
  email: string,
  password: string
): Promise<SupabaseResponse<{ user: { id: string; email: string } }>> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return {
    data: data?.user
      ? { user: { id: data.user.id, email: data.user.email! } }
      : null,
    error,
  };
};

// ======================================
// Obtener perfil
// ======================================
export const getProfile = async (
  userId: string
): Promise<SupabaseResponse<Profile>> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  return { data, error };
};

// ======================================
// Actualizar perfil
// ======================================
export const updateProfile = async (
  userId: string,
  updates: ProfileUpdates
): Promise<SupabaseResponse<Profile>> => {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      ...updates,
      updatedat: new Date().toISOString(),
    })
    .eq("id", userId)
    .single();

  return { data, error };
};

// ======================================
// Cerrar sesión
// ======================================
export const signOutUser = async (): Promise<SupabaseResponse<null>> => {
  const { error } = await supabase.auth.signOut();
  return { data: null, error };
};
