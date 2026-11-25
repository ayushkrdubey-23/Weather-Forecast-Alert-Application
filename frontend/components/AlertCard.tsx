"use client";

import { Alert } from "@/types";
import { AlertTriangle, Info, X } from "lucide-react";

const SEVERITY_CONFIG: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  Critical: { color: "text-red-500", bg: "bg-red-500/10 border-red-500/20", icon: AlertTriangle },
  Warning: { color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20", icon: AlertTriangle },
  Advisory: { color: "text-yellow-500", bg: "bg-yellow-500/10 border-yellow-500/20", icon: AlertTriangle },
  Information: { color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20", icon: Info },
};

export function AlertCard({
  alert,
  onDismiss,
}: {
  alert: Alert;
  onDismiss: (id: string) => void;
}) {
  const config = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.Information;

  return (
    <div className={`flex gap-3 p-4 rounded-xl border ${config.bg} border-${config.color.split("-")[1] || "red"}-200`}>
      <div className="flex-shrink-0 mt-0.5">
        <config.icon size={20} className={config.color} />
      </div>
      <div className="flex-1">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-bold text-gray-800 dark:text-white">{alert.title}</span>
          <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full bg-${config.color.split("-")[1] || "red"}-100 text-${config.color.split("-")[1] || "red"}-600 dark:bg-${config.color.split("-")[1] || "red"}-200 dark:text-${config.color.split("-")[1] || "red"}-800`}
        >
            {alert.severity}
          </span>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
          {alert.description}
        </p>
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span>📍 {alert.city}, {alert.country}</span>
          <span>📊 {alert.measured_value} {alert.unit} (threshold: {alert.threshold})</span>
          <span>🕒 {new Date(alert.timestamp).toLocaleString()}</span>
          {alert.is_forecast && <span className="text-blue-500">Forecast</span>}
        </div>
      </div>
      <button
        onClick={() => onDismiss(alert.id)}
        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
        aria-label="Dismiss alert"
      >
        <X size={18} />
      </button>
    </div>
  );
}
