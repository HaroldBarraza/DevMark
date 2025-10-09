import StatsCard from "./StatsCard";
import { TrendingUp } from "lucide-react";
interface DashboardStats {
  totalCollections: number;
  totalBookmarks: number;
  totalTags: number;
  totalUsers?: number;
}

export default function DashboardAdminView({ stats }: { stats: DashboardStats }) {
  return (
    <section className="grid md:grid-cols-4 gap-4">
      <StatsCard
        icon={TrendingUp}
        label="Mis Colecciones"
        value={stats?.totalCollections ?? 0}
        color="bg-purple-500"
      />
      <StatsCard
        icon={TrendingUp}
        label="Mis Bookmarks"
        value={stats?.totalBookmarks ?? 0}
        color="bg-indigo-500"
      />
      <StatsCard
        icon={TrendingUp}
        label="Mis Tags"
        value={stats?.totalTags ?? 0}
        color="bg-green-500"
      />
      <StatsCard
        icon={TrendingUp}
        label="Total Usuarios"
        value={stats?.totalUsers ?? 0}
        color="bg-red-500"
      />

    </section>
  );
}

