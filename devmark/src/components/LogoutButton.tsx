"use client";
import { supabase } from "@/lib/supabaseClient";

export default function LogoutButton() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload(); // refresca la página
  };

  return (
    <button 
      onClick={handleLogout} 
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Cerrar Sesión
    </button>
  );
}
