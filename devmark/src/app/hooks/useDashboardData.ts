"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import type { Profile, Bookmark } from "@/app/lib/types";

interface DashboardStats {
  totalBookmarks: number;
  totalCollections: number;
  totalTags: number;
}

export function useDashboardData() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookmarks, setRecentBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1️ Obtener sesión actual
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const userId = session.user.id;

        // 2️ Obtener perfil
        const { data: userProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        setProfile(userProfile);

        // 3️ Obtener estadísticas
        const countQuery = (table: string) =>
          userProfile?.role === "ADMIN"
            ? supabase.from(table).select("*", { count: "exact", head: true })
            : supabase.from(table).select("*", { count: "exact", head: true }).eq("user_id", userId);

        const [{ count: totalBookmarks }, { count: totalCollections }, { count: totalTags }] =
          await Promise.all([
            countQuery("bookmarks"),
            countQuery("collections"),
            countQuery("tags"),
          ]);

        setStats({
          totalBookmarks: totalBookmarks ?? 0,
          totalCollections: totalCollections ?? 0,
          totalTags: totalTags ?? 0,
        });

        // 4️ Bookmarks recientes (solo para el usuario, admins pueden modificar si quieren)
        if (userProfile?.role !== "ADMIN") {
          const { data: recent } = await supabase
            .from("bookmarks")
            .select("*")
            .eq("user_id", userId)
            .order("createdAt", { ascending: false })
            .limit(5);

          setRecentBookmarks(recent ?? []);
        }

      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { profile, stats, recentBookmarks, loading };
}
