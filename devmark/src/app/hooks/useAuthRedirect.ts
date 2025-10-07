// src/app/hooks/useAuthRedirect.ts
"use client";

import { useEffect } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";

export const useAuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/auth"); 
      }
    };

    checkUser();
  }, [router]); 
};
