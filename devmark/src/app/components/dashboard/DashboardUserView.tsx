import StatsCard from "./StatsCard";
import type { useDashboardData } from "@/app/hooks/useDashboardData";

interface DashboardUserViewProps {
  stats: ReturnType<typeof useDashboardData>["stats"];
  recentBookmarks: ReturnType<typeof useDashboardData>["recentBookmarks"];
}

export default function DashboardUserView({ stats, recentBookmarks }: DashboardUserViewProps) {
  return (
    <>
      <section className="grid md:grid-cols-3 gap-4 mb-6">
        <StatsCard title="Mis Colecciones" value={stats?.totalCollections ?? 0} />
        <StatsCard title="Mis Bookmarks" value={stats?.totalBookmarks ?? 0} />
        <StatsCard title="Mis Tags" value={stats?.totalTags ?? 0} />
      </section>

      <section>
        <h2 className="font-semibold text-lg mb-2">📚 Bookmarks recientes</h2>
        <ul className="space-y-1">
          {recentBookmarks.length === 0 ? (
            <li className="text-sm text-gray-500 dark:text-gray-400">No hay bookmarks recientes.</li>
          ) : (
            recentBookmarks.map((b) => (
              <li key={b.id} className="text-sm text-gray-600 dark:text-gray-300">
                <a href={b.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {b.title}
                </a>{" "}
                <span className="text-xs text-gray-400">
                  ({new Date(b.createdAt).toLocaleDateString()})
                </span>
              </li>
            ))
          )}
        </ul>
      </section>
    </>
  );
}
