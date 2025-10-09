import { TrendingUp } from "lucide-react";
import type { SVGProps } from "react";

interface StatCardProps {
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  value: number;
  trend?: number;
  color: string;
}

export function StatsCard({ icon: Icon, label, value, trend, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
            <TrendingUp className="w-4 h-4" />
            <span>+{trend}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
export default StatsCard;