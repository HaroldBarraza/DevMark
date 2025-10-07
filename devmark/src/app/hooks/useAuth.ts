// src/app/hooks/useAuth.ts
import { supabase } from "@/app/lib/supabaseClient";

// ======================================
// Interfaces
// ======================================
export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

export type ProfileUpdates = Partial<Omit<Profile, "id" | "email">>;

// Tipo genérico para las respuestas de Supabase
interface SupabaseResponse<T> {
  data: T | null;
  error: Error | null;
}

// ======================================
// Registro de usuario
// ======================================
export const signUpUser = async (
  email: string,
  password: string
): Promise<SupabaseResponse<{ user: { id: string; email: string } }>> => {
  const { data, error } = await supabase.auth.signUp({ email, password });

  return {
    data: data?.user
      ? { user: { id: data.user.id, email: data.user.email! } } // email forzado
      : null,
    error: error ?? null,
  };
};

// ======================================
// Inicio de sesión
// ======================================
export const signInUser = async (
  email: string,
  password: string
): Promise<SupabaseResponse<{ user: { id: string; email: string } }>> => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  return {
    data: data?.user
      ? { user: { id: data.user.id, email: data.user.email! } }
      : null,
    error: error ?? null,
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

  return {
    data: data ?? null,
    error: error ?? null,
  };
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
    .update(updates)
    .eq("id", userId)
    .single();

  return {
    data: data ?? null,
    error: error ?? null,
  };
};

// ======================================
// Cerrar sesión
// ======================================
export const signOutUser = async (): Promise<SupabaseResponse<null>> => {
  const { error } = await supabase.auth.signOut();
  return { data: null, error: error ?? null };
};
