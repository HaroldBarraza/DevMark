"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import type { Profile, Bookmark } from "@/app/lib/types";

interface DashboardStats {
  totalBookmarks: number;
  totalCollections: number;
  totalTags: number;
  totalUsers?: number; // solo para admins
}

export function useDashboardData() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookmarks, setRecentBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1️⃣ Obtener sesión actual
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) return;

        const userId = session.user.id;

        // 2️⃣ Obtener perfil
        const { data: userProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (!userProfile) return;
        setProfile(userProfile);

        // 3️⃣ Obtener estadísticas
        const countQuery = (table: string, filterByUser = true) =>
          filterByUser && userProfile.role !== "ADMIN"
            ? supabase.from(table).select("*", { count: "exact", head: true }).eq("user_id", userId)
            : supabase.from(table).select("*", { count: "exact", head: true });

        const [
          bookmarksRes,
          collectionsRes,
          tagsRes,
          usersRes,
        ] = await Promise.all([
          countQuery("bookmarks"),
          countQuery("collections"),
          countQuery("tags"),
          userProfile.role === "ADMIN" ? countQuery("profiles", false) : Promise.resolve({ count: 0 }),
        ]);

        setStats({
          totalBookmarks: bookmarksRes.count ?? 0,
          totalCollections: collectionsRes.count ?? 0,
          totalTags: tagsRes.count ?? 0,
          totalUsers: userProfile.role === "ADMIN" ? usersRes.count ?? 0 : undefined,
        });

        // 4️⃣ Bookmarks recientes para usuarios normales
        if (userProfile.role !== "ADMIN") {
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
