import StatsCard from "./StatsCard";

export default function DashboardAdminView({ stats }: { stats: any }) {
  return (
    <section className="grid md:grid-cols-3 gap-4">
      <StatsCard title="Total Colecciones" value={stats?.totalCollections ?? 0} />
      <StatsCard title="Total Bookmarks" value={stats?.totalBookmarks ?? 0} />
      <StatsCard title="Total Tags" value={stats?.totalTags ?? 0} />
    </section>
  );
}
