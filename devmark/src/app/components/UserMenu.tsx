'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { supabase } from "@/app/lib/supabaseClient";

interface UserMenuProps {
  isExpanded: boolean;
  // userId ya no hace falta
}

const UserMenu: React.FC<UserMenuProps> = ({ isExpanded }) => {
  const { userId } = useUser(); // 🔹 Tomamos el userId del contexto
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("Usuario");

  useEffect(() => {
    const fetchUserEmail = async () => {
      if (userId) {
        const { data, error } = await supabase
          .from("profiles")
          .select("email")
          .eq("id", userId)
          .single();

        if (data?.email) setUserEmail(data.email);
      }
    };
    fetchUserEmail();
  }, [userId]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const goToProfile = () => {
    router.push("/profile");
  };

  return (
    <div className="relative">
      {/* Botón de usuario */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center w-full p-2 rounded hover:bg-gray-700 transition-colors ${
          isExpanded ? "" : "justify-center"
        }`}
      >
        <span className="text-lg">👤</span>
        {isExpanded && <span className="ml-2">{userEmail}</span>}
      </button>

      {/* Menú desplegable */}
      {open && (
        <div className="absolute bottom-12 left-0 w-full bg-gray-900 border border-gray-700 rounded shadow-md flex flex-col z-50">
          <button
            onClick={goToProfile}
            className="p-2 text-left hover:bg-gray-700"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="p-2 text-left hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export { UserMenu };
