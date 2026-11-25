"use client";

import { useEffect, useState } from "react";
import { useWeather } from "@/hooks/useWeather";
import { useAlerts } from "@/hooks/useAlerts";
import { useSettings } from "@/hooks/useSettings";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { WeatherCard } from "@/components/WeatherCard";
import { StatCard } from "@/components/StatCard";
import { LineChartWidget, BarChartWidget } from "@/components/Charts";
import {
  Search,
  RefreshCw,
  Cloud,
  Clock,
  AlertTriangle,
  Droplets,
  Wind,
} from "lucide-react";

interface DailyForecast {
  day: string;
  date: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  rainfall: number;
}

export default function Forecast() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [apiConnected, setApiConnected] = useState(true);
  const [dataMode, setDataMode] = useState<"Live" | "Simulation">("Live");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const {
    currentWeather,
    forecast,
    loading,
    error,
    fetchForecast,
    setForecast,
  } = useWeather();
  const { alerts } = useAlerts();
  const { settings } = useSettings();

  useEffect(() => {
    setDataMode(settings.data_mode);
    setTheme(settings.theme as "dark" | "light");
    if (settings.default_city) {
      fetchForecast(settings.default_city, undefined, settings.data_mode);
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      await fetchForecast(searchQuery, undefined, settings.data_mode);
    } catch {
      // handled in hook
    }
  };

  const handleRefresh = async () => {
    if (currentWeather) {
      await fetchForecast(
        currentWeather.city,
        currentWeather.country,
        settings.data_mode
      );
    }
  };

  const dailyForecast: DailyForecast[] = [];
  if (forecast?.forecast) {
    const seenDates = new Set<string>();
    for (const entry of forecast.forecast) {
      const date = entry.dt_txt.split(" ")[0];
      if (!seenDates.has(date)) {
        seenDates.add(date);
        dailyForecast.push({
          day: new Date(date).toLocaleDateString(undefined, { weekday: "short" }),
          date,
          tempMax: entry.temp_max,
          tempMin: entry.temp_min,
          condition: entry.weather_condition,
          icon: entry.weather_icon,
          humidity: entry.humidity,
          windSpeed: entry.wind_speed,
          rainfall: entry.rainfall || 0,
        });
      }
      if (dailyForecast.length >= 5) break;
    }
  }

  const hourlyChartData = forecast?.forecast
    ? forecast.forecast.slice(0, 24).map((e, i) => ({
        name: `T+${i * 3}h`,
        value: e.temperature,
      }))
    : [];

  const dailyChartData = dailyForecast.map((d) => ({
    name: d.day,
    value: (d.tempMax + d.tempMin) / 2,
  }));

  const rainfallChartData = dailyForecast.map((d) => ({
    name: d.day,
    value: d.rainfall,
  }));

  const humidityChartData = dailyForecast.map((d) => ({
    name: d.day,
    value: d.humidity,
  }));

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
          onRefresh={handleRefresh}
          onSearch={(q) => setSearchQuery(q)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className="p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Weather Forecast</h1>
            <p className="text-gray-400 text-sm">
              5-day forecast with hourly breakdown
            </p>
          </div>

          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Enter city name for forecast..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 rounded-xl bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </form>

          {loading ? (
            <div className="bg-gray-800 rounded-xl p-8 text-center border border-gray-700 animate-pulse">
              <div className="text-gray-400 text-lg mb-2">Loading forecast data...</div>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {dailyForecast.map((day) => (
                  <div
                    key={day.date}
                    className="bg-gray-800 rounded-xl p-5 border border-gray-700"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-medium text-gray-300">{day.day}</span>
                      <span className="text-xs text-gray-500">{day.date}</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-white">{day.tempMax}°</span>
                      <span className="text-sm text-gray-400">{day.tempMin}°</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                      <span className="capitalize">{day.condition}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Droplets size={14} />
                        <span>{day.humidity}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Wind size={14} />
                        <span>{day.windSpeed} km/h</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <LineChartWidget
                  data={hourlyChartData}
                  title="Hourly Temperature Forecast"
                  unit="°C"
                  color="#3b82f6"
                />
                <BarChartWidget
                  data={rainfallChartData}
                  title="Daily Rainfall Forecast"
                  unit="mm"
                  color="#14b8a6"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LineChartWidget
                  data={dailyChartData}
                  title="Daily Average Temperature"
                  unit="°C"
                  color="#f59e0b"
                />
                <LineChartWidget
                  data={humidityChartData}
                  title="Humidity Trend"
                  unit="%"
                  color="#10b981"
                />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
