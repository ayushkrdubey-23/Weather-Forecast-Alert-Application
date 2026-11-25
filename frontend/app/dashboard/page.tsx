"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useWeather } from "@/hooks/useWeather";
import { useAlerts } from "@/hooks/useAlerts";
import { useSettings } from "@/hooks/useSettings";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { WeatherCard } from "@/components/WeatherCard";
import { StatCard } from "@/components/StatCard";
import { AlertCard } from "@/components/AlertCard";
import { LineChartWidget, BarChartWidget } from "@/components/Charts";
const WeatherMap = dynamic(() => import("@/components/WeatherMap").then((mod) => mod.WeatherMap), { ssr: false });
const SavedCitiesMap = dynamic(() => import("@/components/WeatherMap").then((mod) => mod.SavedCitiesMap), { ssr: false });
import { useCities } from "@/hooks/useCities";
import {
  Plus,
  RefreshCw,
  Bell,
  Calendar,
  MapPin,
  Thermometer,
  Droplets,
  Wind,
} from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [apiConnected, setApiConnected] = useState(true);
  const [dataMode, setDataMode] = useState<"Live" | "Simulation">("Live");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    currentWeather,
    loading: weatherLoading,
    error: weatherError,
    fetchCurrentWeather,
    setCurrentWeather,
  } = useWeather();
  const { alerts, summary, fetchAlerts } = useAlerts();
  const { settings, setDataMode: setAppDataMode, setTheme: setAppTheme } =
    useSettings();
  const { savedCities, fetchSavedCities } = useCities();

  useEffect(() => {
    setDataMode(settings.data_mode);
    setTheme(settings.theme as "dark" | "light");
    fetchAlerts();
    fetchSavedCities();
  }, []);

  const handleRefresh = async () => {
    if (currentWeather) {
      await fetchCurrentWeather(
        currentWeather.city,
        currentWeather.country,
        settings.data_mode
      );
      fetchAlerts();
    }
  };

  const handleSearch = async (q: string) => {
    try {
      const weather = await fetchCurrentWeather(q, undefined, settings.data_mode);
      setCurrentWeather(weather);
      await fetchAlerts();
    } catch {
      // Error handled in hook
    }
  };

  const recentAlerts = alerts.slice(0, 5);

  const forecastChartData = [
    { name: "Mon", value: 22 },
    { name: "Tue", value: 25 },
    { name: "Wed", value: 21 },
    { name: "Thu", value: 24 },
    { name: "Fri", value: 23 },
    { name: "Sat", value: 26 },
    { name: "Sun", value: 20 },
  ];

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
          onSearch={handleSearch}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className="p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row gap-6 mb-6">
            <div className="flex-1 lg:flex-2">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-white mb-2">
                  Weather Dashboard
                </h1>
                <p className="text-gray-400 text-sm">
                  Real-time weather monitoring and alert system
                </p>
              </div>

              {currentWeather ? (
                <WeatherCard weather={currentWeather} />
              ) : (
                <div className="bg-gray-800 rounded-2xl p-8 text-center border border-gray-700">
                  <p className="text-gray-400">No city selected</p>
                  <button
                    onClick={() => handleSearch("London")}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                  >
                    Load Default Weather
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
                  label="AQI"
                  value={currentWeather?.aqi || "--"}
                  unit=""
                  status={currentWeather && currentWeather.aqi! > 100 ? "warning" : "normal"}
                  type="aqi"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-gray-300">Active Alerts</h2>
                  <span
                  className={`px-2 py-0.5 rounded text-xs font-bold ${
                    summary.critical > 0
                      ? "bg-red-500/20 text-red-400"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                    {summary.total} active
                  </span>
                </div>
                {recentAlerts.length > 0 ? (
                  recentAlerts.map((alert) => (
                    <AlertCard key={alert.id} alert={alert} onDismiss={() => {}} />
                  ))
                ) : (
                  <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
                    <p className="text-sm text-gray-400">No active alerts</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <LineChartWidget
              data={forecastChartData}
              title="Temperature Trend"
              unit="°C"
              color="#3b82f6"
            />
            <BarChartWidget
              data={[
                { name: "Mon", value: 2 },
                { name: "Tue", value: 5 },
                { name: "Wed", value: 0 },
                { name: "Thu", value: 3 },
                { name: "Fri", value: 8 },
                { name: "Sat", value: 1 },
                { name: "Sun", value: 0 },
              ]}
              title="Rainfall Forecast"
              unit="mm"
              color="#14b8a6"
            />
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-sm font-semibold text-gray-300 mb-4">
              Weather Map & Saved Cities
            </h2>
            <WeatherMap
              center={currentWeather ? [currentWeather.lat, currentWeather.lon] : [20, 0]}
              zoom={5}
              cities={currentWeather ? [currentWeather] : []}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
