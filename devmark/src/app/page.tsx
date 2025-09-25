"use client";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/auth/login");
      } else {
        // Intentamos mostrar el nombre real si existe en el profile
        const { data: profileData, error } = await supabase
          .from("profiles") // si tenés tabla profiles con info del usuario
          .select("full_name")
          .eq("id", session.user.id)
          .single();

        if (profileData?.full_name) {
          setUserName(profileData.full_name);
        } else {
          // si no hay full_name, usamos email
          setUserName(session.user.email || "Usuario");
        }

        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  if (loading) return <p>Cargando...</p>;

  return <h1>Bienvenido, {userName}</h1>;
}
