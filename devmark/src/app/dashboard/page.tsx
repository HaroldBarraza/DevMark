"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [display_name, setDisplayName] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setDisplayName(data.user?.user_metadata?.display_name || "");
    });
  }, []);

  if (!user) return <p className="text-center mt-10">No has iniciado sesión.</p>;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">Bienvenido, {display_name}</h1>
    </div>
  );
}
