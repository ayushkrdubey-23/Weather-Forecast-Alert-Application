"use client";

import { useEffect, useState } from "react";
import { useAlerts } from "@/hooks/useAlerts";
import { useSettings } from "@/hooks/useSettings";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { AlertCard } from "@/components/AlertCard";
import { AlertTriangle, Filter, X, Clock, BarChart3 } from "lucide-react";

export default function Alerts() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [apiConnected, setApiConnected] = useState(true);
  const [dataMode, setDataMode] = useState<"Live" | "Simulation">("Live");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterCity, setFilterCity] = useState<string>("all");

  const {
    alerts,
    history,
    summary,
    loading,
    fetchAlerts,
    thresholds,
    checkAlerts,
  } = useAlerts();
  const { settings } = useSettings();

  useEffect(() => {
    setDataMode(settings.data_mode);
    setTheme(settings.theme as "dark" | "light");
    fetchAlerts();
  }, []);

  const severityOrder: Record<string, number> = {
    Critical: 0,
    Warning: 1,
    Advisory: 2,
    Information: 3,
  };

  const filteredAlerts = alerts
    .filter((a) => filterSeverity === "all" || a.severity === filterSeverity)
    .filter((a) => filterCity === "all" || a.city === filterCity)
    .sort(
      (a, b) =>
        severityOrder[a.severity] - severityOrder[b.severity] ||
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

  const cities = alerts
    .map((a) => a.city)
    .filter((city, index, self) => self.indexOf(city) === index);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={`lg:pl-64 transition-all duration-300 min-h-screen`}>
        <Navbar
          apiConnected={apiConnected}
          dataMode={dataMode}
          theme={theme}
          toggleTheme={() => {
            setTheme(theme === "dark" ? "light" : "dark");
          }}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onRefresh={fetchAlerts}
          onSearch={() => {}}
          searchQuery=""
          setSearchQuery={() => {}}
        />

        <main className="p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Weather Alerts</h1>
            <p className="text-gray-400 text-sm">
              Automated weather alert monitoring and management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <div className="text-xs text-gray-400 uppercase font-medium mb-1">Total Alerts</div>
              <div className="text-2xl font-bold text-white">{summary.total}</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <div className="text-xs text-gray-400 uppercase font-medium mb-1">Critical</div>
              <div className="text-2xl font-bold text-red-500">{summary.critical}</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <div className="text-xs text-gray-400 uppercase font-medium mb-1">Warnings</div>
              <div className="text-2xl font-bold text-amber-500">{summary.warning}</div>
            </div>
            <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <div className="text-xs text-gray-400 uppercase font-medium mb-1">Active</div>
              <div className="text-2xl font-bold text-blue-500">{alerts.length}</div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:flex-1">
              <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 mb-6">
                <h2 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-amber-400" />
                  Active Alerts
                </h2>
                <div className="flex items-center gap-2 mb-4">
                  <select
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-sm text-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="all">All Severities</option>
                    <option value="Critical">Critical</option>
                    <option value="Warning">Warning</option>
                    <option value="Advisory">Advisory</option>
                    <option value="Information">Information</option>
                  </select>
                  <select
                    value={filterCity}
                    onChange={(e) => setFilterCity(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-sm text-gray-300 focus:ring-2 focus:ring-blue-500 outline-none ml-2"
                  >
                    <option value="all">All Cities</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                {filteredAlerts.length > 0 ? (
                  filteredAlerts.map((alert) => (
                    <AlertCard
                      key={alert.id}
                      alert={alert}
                      onDismiss={() => {}}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-400">No active alerts matching filters</p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:flex-1 space-y-6">
              <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <h2 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-blue-400" />
                  Alert History
                </h2>
                {history.slice(0, 10).map((alert) => (
                  <div key={alert.id} className="p-3 rounded-lg bg-gray-700/30 border border-gray-600/50 mb-2">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-medium text-gray-300">{alert.title}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{alert.description}</p>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                      <span>📍 {alert.city}</span>
                      <span>📊 {alert.measured_value} {alert.unit}</span>
                      <span>🕒 {new Date(alert.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
                {history.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">No alert history</p>
                  </div>
                )}
              </div>

              <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <h2 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                  <BarChart3 size={18} className="text-green-400" />
                  Alert Threshold Settings
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Temperature Max (°C)</label>
                    <input
                      type="number"
                      value={thresholds.temperature_max}
                      className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Rainfall Max (mm/h)</label>
                    <input
                      type="number"
                      value={thresholds.rainfall_max}
                      className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Humidity Max (%)</label>
                    <input
                      type="number"
                      value={thresholds.humidity_max}
                      className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Wind Speed Max (km/h)</label>
                    <input
                      type="number"
                      value={thresholds.wind_speed_max}
                      className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">AQI Max</label>
                    <input
                      type="number"
                      value={thresholds.aqi_max}
                      className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
