"use client";

import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("Usuario");

  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Error al obtener la sesión:", sessionError.message);
          setLoading(false);
          return;
        }

        if (!session) {
          router.push("/auth/login");
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          console.error("Error al obtener perfil:", profileError.message);
        }

        setUserName(profileData?.full_name || session.user.email || "Usuario");
      } catch (err: unknown) {
        console.error("Error inesperado:", err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  if (loading) return <p>Cargando...</p>;

  return <h1>Bienvenido, {userName}</h1>;
}
