export default function StatsCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-800 shadow-sm">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}
