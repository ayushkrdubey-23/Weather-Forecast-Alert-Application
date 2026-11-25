"use client";

import {
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Archive,
  AlertTriangle,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  temperature: Thermometer,
  rainfall: Droplets,
  humidity: Droplets,
  wind: Wind,
  aqi: Archive,
  uv: Sun,
};

export function StatCard({
  label,
  value,
  unit,
  status,
  type = "temperature",
}: {
  label: string;
  value: string | number;
  unit: string;
  status: "normal" | "warning" | "critical";
  type?: string;
}) {
  const Icon = ICON_MAP[type] || Archive;
  const statusColors: Record<string, string> = {
    normal: "text-green-400",
    warning: "text-amber-400",
    critical: "text-red-400",
  };

  return (
    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-blue-500 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon size={20} className="text-blue-400" />
          <span className="text-xs font-medium text-gray-400 uppercase">{label}</span>
        </div>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[status]}`}>
          {status}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-white">{value}</span>
        <span className="text-sm text-gray-400">{unit}</span>
      </div>
    </div>
  );
}
