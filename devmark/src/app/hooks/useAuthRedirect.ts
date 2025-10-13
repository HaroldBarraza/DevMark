"use client";
import { useEffect } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";

/**
 * Custom hook that redirects unauthenticated users to the auth page
 * Checks for authenticated user on component mount and redirects if not logged in
 * 
 * @example
 * // Use in a component that requires authentication
 * function ProtectedComponent() {
 *   useAuthRedirect();
 *   return <div>Protected content</div>;
 * }
 */
export const useAuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    /**
     * Checks if user is authenticated and redirects to auth page if not
     */
    const checkAuthentication = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/auth");
      }
    };

    checkAuthentication();
  }, [router]);
};