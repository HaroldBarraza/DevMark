"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";

interface MonthlyTrend {
  month: string;
  bookmarks: number;
  tags: number;
  collections: number;
}

interface CreatedAtItem {
  created_at: string | null;
}

export function useDashboardTrends(userId?: string, role?: string) {
  const [trends, setTrends] = useState<MonthlyTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTrends = async () => {
      try {
        const isAdmin = role === "ADMIN";

        // Fetch bookmarks
        let bookmarksQuery = supabase.from("bookmarks").select("created_at");
        if (!isAdmin && userId) bookmarksQuery = bookmarksQuery.eq("user_id", userId);
        const { data: bookmarksData } = await bookmarksQuery;

        // Fetch tags
        let tagsQuery = supabase.from("tags").select("created_at");
        if (!isAdmin && userId) tagsQuery = tagsQuery.eq("user_id", userId);
        const { data: tagsData } = await tagsQuery;

        // Fetch collections
        let collectionsQuery = supabase.from("collections").select("created_at");
        if (!isAdmin && userId) collectionsQuery = collectionsQuery.eq("user_id", userId);
        const { data: collectionsData } = await collectionsQuery;

        // Procesar datos por mes
        const processDataByMonth = (data: CreatedAtItem[] = []) => {
          const counts: Record<string, number> = {};
          data.forEach(item => {
            if (item.created_at) {
              const date = new Date(item.created_at);
              const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
              counts[monthKey] = (counts[monthKey] || 0) + 1;
            }
          });
          return counts;
        };

        const bookmarksByMonth = processDataByMonth(bookmarksData ?? []);
        const tagsByMonth = processDataByMonth(tagsData ?? []);
        const collectionsByMonth = processDataByMonth(collectionsData ?? []);

        // Obtener todos los meses únicos
        const allMonths = Array.from(
          new Set([
            ...Object.keys(bookmarksByMonth),
            ...Object.keys(tagsByMonth),
            ...Object.keys(collectionsByMonth),
          ])
        ).sort();

        // Crear el array de tendencias
        const merged: MonthlyTrend[] = allMonths.map(month => ({
          month,
          bookmarks: bookmarksByMonth[month] ?? 0,
          tags: tagsByMonth[month] ?? 0,
          collections: collectionsByMonth[month] ?? 0,
        }));

        console.log("Trends data:", merged); // Debug
        setTrends(merged);
      } catch (error) {
        console.error("Error loading trends:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId || role === "ADMIN") {
      loadTrends();
    } else {
      setLoading(false);
    }
  }, [userId, role]);

  return { trends, loading };
}
