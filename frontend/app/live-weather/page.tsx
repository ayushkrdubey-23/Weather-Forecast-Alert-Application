"use client";

import { useEffect, useState } from "react";
import { useWeather } from "@/hooks/useWeather";
import { useAlerts } from "@/hooks/useAlerts";
import { useSettings } from "@/hooks/useSettings";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { WeatherCard } from "@/components/WeatherCard";
import { StatCard } from "@/components/StatCard";
import { AlertCard } from "@/components/AlertCard";
import {
  Search,
  RefreshCw,
  Sun,
  Cloud,
  Droplets,
  Wind,
  Archive,
  Eye,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

export default function LiveWeather() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [apiConnected, setApiConnected] = useState(true);
  const [dataMode, setDataMode] = useState<"Live" | "Simulation">("Live");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const {
    currentWeather,
    loading,
    error,
    fetchCurrentWeather,
    setCurrentWeather,
  } = useWeather();
  const { alerts, fetchAlerts } = useAlerts();
  const { settings, setDataMode: setAppDataMode, setTheme: setAppTheme } =
    useSettings();

  useEffect(() => {
    setDataMode(settings.data_mode);
    setTheme(settings.theme as "dark" | "light");
    fetchAlerts();
    if (settings.default_city) {
      fetchCurrentWeather(settings.default_city, undefined, settings.data_mode);
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const weather = await fetchCurrentWeather(
        searchQuery,
        undefined,
        settings.data_mode
      );
      setCurrentWeather(weather);
      await fetchAlerts();
    } catch {
      // handled in hook
    }
  };

  const handleRefresh = async () => {
    if (currentWeather) {
      await fetchCurrentWeather(
        currentWeather.city,
        currentWeather.country,
        settings.data_mode
      );
      await fetchAlerts();
    }
  };

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
            setAppTheme(theme === "dark" ? "light" : "dark");
          }}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onRefresh={handleRefresh}
          onSearch={(q) => setSearchQuery(q)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className="p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Live Weather</h1>
            <p className="text-gray-400 text-sm">
              Current weather conditions for any location worldwide
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 mb-6">
            <div className="flex-1 lg:flex-2">
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter city name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pl-10 rounded-xl bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </form>

              {loading ? (
                <div className="bg-gray-800 rounded-xl p-8 text-center border border-gray-700 animate-pulse">
                  <div className="text-gray-400 text-lg mb-2">Loading weather data...</div>
                </div>
              ) : error ? (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              ) : currentWeather ? (
                <WeatherCard weather={currentWeather} />
              ) : (
                <div className="bg-gray-800 rounded-xl p-8 text-center border border-gray-700">
                  <div className="text-gray-400 text-lg mb-4">Search for a city to view live weather</div>
                  <button
                    onClick={() => setSearchQuery("London")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                  >
                    Try London
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 lg:flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <StatCard
                  label="Temperature"
                  value={currentWeather?.temperature || "--"}
                  unit="°C"
                  status="normal"
                  type="temperature"
                />
                <StatCard
                  label="Feels Like"
                  value={currentWeather?.feels_like || "--"}
                  unit="°C"
                  status="normal"
                  type="temperature"
                />
                <StatCard
                  label="Humidity"
                  value={currentWeather?.humidity || "--"}
                  unit="%"
                  status="normal"
                  type="humidity"
                />
                <StatCard
                  label="Wind Speed"
                  value={currentWeather?.wind_speed || "--"}
                  unit="km/h"
                  status="normal"
                  type="wind"
                />
                <StatCard
                  label="Pressure"
                  value={currentWeather?.pressure || "--"}
                  unit="hPa"
                  status="normal"
                  type="wind"
                />
                <StatCard
                  label="Visibility"
                  value={currentWeather?.visibility
                    ? Math.round(currentWeather.visibility / 1000)
                    : "--"}
                  unit="km"
                  status="normal"
                />
                <StatCard
                  label="Cloud Coverage"
                  value={currentWeather?.cloud_coverage || "--"}
                  unit="%"
                  status="normal"
                  type="wind"
                />
                {currentWeather?.aqi !== undefined && (
                  <StatCard
                    label="Air Quality Index"
                    value={currentWeather.aqi}
                    unit=""
                    status={currentWeather.aqi > 100 ? "warning" : "normal"}
                    type="aqi"
                  />
                )}
              </div>

              <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <h2 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-amber-400" />
                  Active Alerts
                </h2>
                {alerts.length > 0 ? (
                  alerts.slice(0, 5).map((alert) => (
                    <AlertCard key={alert.id} alert={alert} onDismiss={() => {}} />
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-400">No active alerts</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
