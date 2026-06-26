import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface VitalsCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  status: 'Normal' | 'Warning' | 'Critical';
  trend?: string;
}

const VitalsCard: React.FC<VitalsCardProps> = ({
  title,
  value,
  unit,
  icon: Icon,
  status,
  trend
}) => {

  // 🌿 Softer modern colors
  const statusColors = {
    Normal: 'bg-green-50 text-green-600 border-green-200',
    Warning: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    Critical: 'bg-red-50 text-red-600 border-red-200',
  };

  const iconColors = {
    Normal: 'bg-green-100 text-green-600',
    Warning: 'bg-yellow-100 text-yellow-600',
    Critical: 'bg-red-100 text-red-600',
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">

      {/* TOP */}
      <div className="flex items-center justify-between mb-4">

        <div className={cn("p-2 rounded-xl", iconColors[status])}>
          <Icon size={20} />
        </div>

        <span
          className={cn(
            "text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border",
            statusColors[status]
          )}
        >
          {status}
        </span>
      </div>

      {/* CONTENT */}
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">
          {title}
        </p>

        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-slate-900">
            {value}
          </span>
          <span className="text-sm text-slate-400 font-medium">
            {unit}
          </span>
        </div>

        {trend && (
          <p className="text-xs text-slate-400 mt-2">
            <span
              className={cn(
                trend.startsWith('+')
                  ? "text-red-500"
                  : "text-green-500",
                "font-medium"
              )}
            >
              {trend}
            </span>{" "}
            from yesterday
          </p>
        )}
      </div>
    </div>
  );
};

export default VitalsCard;