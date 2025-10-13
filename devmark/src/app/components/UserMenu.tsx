'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import { supabase } from "@/app/lib/supabaseClient";

interface UserMenuProps {
  isExpanded: boolean;
}

/**
 * UserMenu component that displays user information and provides account actions
 * Shows dropdown menu with profile and logout options
 */
const UserMenu: React.FC<UserMenuProps> = ({ isExpanded }) => {
  const { userId } = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("User");

  // Fetch user email when userId changes
  useEffect(() => {
    const fetchUserEmail = async () => {
      if (userId) {
        const { data } = await supabase
          .from("profiles")
          .select("email")
          .eq("id", userId)
          .single();

        if (data?.email) setUserEmail(data.email);
      }
    };
    fetchUserEmail();
  }, [userId]);

  /**
   * Handles user logout by signing out and redirecting to login page
   */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  /**
   * Navigates to user profile page
   */
  const goToProfile = () => {
    router.push("/profile");
  };

  return (
    <div className="relative">
      {/* User Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center w-full p-2 rounded hover:bg-gray-700 transition-colors ${
          isExpanded ? "" : "justify-center"
        }`}
        aria-label="User menu"
        aria-expanded={open}
      >
        <span className="text-lg">👤</span>
        {isExpanded && <span className="ml-2 truncate">{userEmail}</span>}
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute bottom-12 left-0 w-full bg-gray-900 border border-gray-700 rounded shadow-md flex flex-col z-50">
          <button
            onClick={goToProfile}
            className="p-2 text-left hover:bg-gray-700 transition-colors"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="p-2 text-left hover:bg-gray-700 transition-colors border-t border-gray-700"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export { UserMenu };