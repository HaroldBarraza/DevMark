// src/app/page.tsx - CORREGIR
"use client";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/auth/login");
        return;
      }

      // Obtener información del perfil
      try {
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("name, email")
          .eq("id", session.user.id)
          .single();

        if (error) throw error;

        setUserName(profileData?.name || session.user.email || "Usuario");
      } catch (error) {
        console.error("Error fetching profile:", error);
        setUserName(session.user.email || "Usuario");
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Bienvenido, {userName}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-3">📚 Tus Bookmarks</h2>
          <p className="text-gray-600 mb-4">Gestiona todos tus enlaces guardados</p>
          <button 
            onClick={() => router.push("/bookmark")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Ver Bookmarks
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-3">🗂️ Colecciones</h2>
          <p className="text-gray-600 mb-4">Organiza por categorías</p>
          <button 
            onClick={() => router.push("/collections")}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Ver Colecciones
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold mb-3">🏷️ Etiquetas</h2>
          <p className="text-gray-600 mb-4">Encuentra por tags</p>
          <button 
            onClick={() => router.push("/bookmark")} // Redirigir a bookmarks con filtros de tags
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Explorar Tags
          </button>
        </div>
      </div>
    </div>
  );
}