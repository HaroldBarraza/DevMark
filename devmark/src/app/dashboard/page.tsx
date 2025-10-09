"use client";

import { useDashboardData } from "@/app/hooks/useDashboardData";
import DashboardUserView from "@/app/components/dashboard/DashboardUserView";
import DashboardAdminView from "@/app/components/dashboard/DashboardAdminView";

export default function DashboardPage() {
  const { profile, stats, recentBookmarks, loading } = useDashboardData(); // <- extraemos recentBookmarks

  if (loading) return <p className="p-4 text-gray-500">Cargando...</p>;
  if (!profile) return <p className="p-4 text-red-500">No se encontró el perfil.</p>;

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">
        Bienvenido {profile.name || "Usuario"} 👋
      </h1>

      {profile.role === "ADMIN" ? (
        <DashboardAdminView stats={stats} />
      ) : (
        <DashboardUserView stats={stats} recentBookmarks={recentBookmarks} /> // <- pasamos la prop
      )}
    </main>
  );
}
