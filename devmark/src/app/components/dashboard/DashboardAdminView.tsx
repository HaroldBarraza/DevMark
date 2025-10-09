import StatsCard from "./StatsCard";

interface DashboardStats {
  totalCollections: number;
  totalBookmarks: number;
  totalTags: number;
}

export default function DashboardAdminView({ stats }: { stats: DashboardStats }) {
  return (
    <section className="grid md:grid-cols-3 gap-4">
      <StatsCard title="Total Colecciones" value={stats?.totalCollections ?? 0} />
      <StatsCard title="Total Bookmarks" value={stats?.totalBookmarks ?? 0} />
      <StatsCard title="Total Tags" value={stats?.totalTags ?? 0} />
    </section>
  );
}

