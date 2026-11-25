"use client";

import { useEffect, useState } from "react";
import { useWeather } from "@/hooks/useWeather";
import { useCities } from "@/hooks/useCities";
import { useSettings } from "@/hooks/useSettings";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { BarChartWidget, LineChartWidget } from "@/components/Charts";
import { Search, SlidersHorizontal, RefreshCw, X } from "lucide-react";

interface ComparisonCity {
  city: string;
  country: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  rainfall: number;
  weather_condition: string;
  aqi?: number;
}

export default function CityComparison() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [apiConnected, setApiConnected] = useState(true);
  const [dataMode, setDataMode] = useState<"Live" | "Simulation">("Live");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [comparisonData, setComparisonData] = useState<ComparisonCity[]>([]);

  const {
    currentWeather,
    loading,
    error,
    fetchCurrentWeather,
  } = useWeather();
  const { savedCities, searchCities, searchResults } = useCities();
  const { settings } = useSettings();

  useEffect(() => {
    setDataMode(settings.data_mode);
    setTheme(settings.theme as "dark" | "light");
    updateComparison();
  }, [currentWeather, selectedCities]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const weather = await fetchCurrentWeather(
        searchQuery,
        undefined,
        settings.data_mode
      );
      addCityToComparison({
        city: weather.city,
        country: weather.country,
        temperature: weather.temperature,
        feels_like: weather.feels_like,
        humidity: weather.humidity,
        wind_speed: weather.wind_speed,
        rainfall: weather.rainfall || 0,
        weather_condition: weather.weather_condition,
        aqi: weather.aqi,
      });
      setSearchQuery("");
    } catch {
      // handled in hook
    }
  };

  const addCityToComparison = (weather: ComparisonCity) => {
    if (selectedCities.includes(weather.city)) return;
    setSelectedCities((prev) => [...prev, weather.city]);
    setComparisonData((prev) => [...prev, weather]);
  };

  const removeFromComparison = (city: string) => {
    setSelectedCities((prev) => prev.filter((c) => c !== city));
    setComparisonData((prev) => prev.filter((c) => c.city !== city));
  };

  const updateComparison = async () => {
    if (savedCities.length > 0 && comparisonData.length === 0) {
      const data: ComparisonCity[] = [];
      for (const city of savedCities.slice(0, 3)) {
        try {
          const w = await fetchCurrentWeather(
            city.city,
            city.country,
            settings.data_mode
          );
          data.push({
            city: w.city,
            country: w.country,
            temperature: w.temperature,
            feels_like: w.feels_like,
            humidity: w.humidity,
            wind_speed: w.wind_speed,
            rainfall: w.rainfall || 0,
            weather_condition: w.weather_condition,
            aqi: w.aqi,
          });
        } catch {
          // skip
        }
      }
      setComparisonData(data);
      setSelectedCities(data.map((d) => d.city));
    }
  };

  const temperatureChartData = comparisonData.map((c) => ({
    name: c.city,
    value: c.temperature,
  }));

  const humidityChartData = comparisonData.map((c) => ({
    name: c.city,
    value: c.humidity,
  }));

  const windChartData = comparisonData.map((c) => ({
    name: c.city,
    value: c.wind_speed,
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
          onRefresh={updateComparison}
          onSearch={() => {}}
          searchQuery=""
          setSearchQuery={() => {}}
        />

        <main className="p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">City Comparison</h1>
            <p className="text-gray-400 text-sm">
              Compare weather conditions across multiple locations
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/4 space-y-4">
              <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <h2 className="text-sm font-semibold text-gray-300 mb-4">
                  Select Cities
                </h2>
                <form onSubmit={handleSearch} className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search city..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 pl-10 rounded-xl bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </form>
                {searchResults.length > 0 && (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {searchResults.map((city) => (
                      <button
                        key={`${city.name}-${city.country}`}
                        onClick={() => {
                          setSearchQuery(city.name);
                          fetchCurrentWeather(
                            city.name,
                            city.country,
                            settings.data_mode
                          ).then((w) => {
                            addCityToComparison({
                              city: w.city,
                              country: w.country,
                              temperature: w.temperature,
                              feels_like: w.feels_like,
                              humidity: w.humidity,
                              wind_speed: w.wind_speed,
                              rainfall: w.rainfall || 0,
                              weather_condition: w.weather_condition,
                              aqi: w.aqi,
                            });
                          });
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-600 text-sm text-gray-300 transition-colors"
                      >
                        {city.name}, {city.country}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <h2 className="text-sm font-semibold text-gray-300 mb-4">
                  Saved Cities
                </h2>
                {savedCities.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center">No saved cities</p>
                ) : (
                  <div className="space-y-2">
                    {savedCities.map((city) => (
                      <button
                        key={city.id}
                        onClick={() => {
                          fetchCurrentWeather(
                            city.city,
                            city.country,
                            settings.data_mode
                          ).then((w) => {
                            addCityToComparison({
                              city: w.city,
                              country: w.country,
                              temperature: w.temperature,
                              feels_like: w.feels_like,
                              humidity: w.humidity,
                              wind_speed: w.wind_speed,
                              rainfall: w.rainfall || 0,
                              weather_condition: w.weather_condition,
                              aqi: w.aqi,
                            });
                          });
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-600 text-sm text-gray-300 transition-colors"
                      >
                        {city.city}, {city.country}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:flex-1">
              {comparisonData.length === 0 ? (
                <div className="bg-gray-800 rounded-xl p-12 text-center border border-gray-700">
                  <SlidersHorizontal size={48} className="mx-auto mb-4 text-gray-500" />
                  <p className="text-gray-400 text-lg">No cities selected for comparison</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Search for cities above to add them to the comparison
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {comparisonData.map((c) => (
                      <div
                        key={c.city}
                        className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-sm"
                      >
                        {c.city}, {c.country}
                        <button
                          onClick={() => removeFromComparison(c.city)}
                          className="ml-2 hover:text-red-400"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {comparisonData.map((c) => (
                      <div key={c.city} className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                        <h3 className="text-sm font-bold text-white mb-3">{c.city}, {c.country}</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Temperature</span>
                            <span className="text-gray-200 font-medium">{c.temperature}°C</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Feels Like</span>
                            <span className="text-gray-200">{c.feels_like}°C</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Humidity</span>
                            <span className="text-gray-200">{c.humidity}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Wind Speed</span>
                            <span className="text-gray-200">{c.wind_speed} km/h</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Rainfall</span>
                            <span className="text-gray-200">{c.rainfall} mm</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Condition</span>
                            <span className="text-gray-200 capitalize">{c.weather_condition}</span>
                          </div>
                          {c.aqi !== undefined && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">AQI</span>
                              <span className="text-gray-200">{c.aqi}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <BarChartWidget
                      data={temperatureChartData}
                      title="Temperature Comparison"
                      unit="°C"
                      color="#3b82f6"
                    />
                    <BarChartWidget
                      data={humidityChartData}
                      title="Humidity Comparison"
                      unit="%"
                      color="#14b8a6"
                    />
                    <BarChartWidget
                      data={windChartData}
                      title="Wind Speed Comparison"
                      unit="km/h"
                      color="#f59e0b"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
