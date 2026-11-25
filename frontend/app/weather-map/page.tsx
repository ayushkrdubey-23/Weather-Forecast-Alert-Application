"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useWeather } from "@/hooks/useWeather";
import { useCities } from "@/hooks/useCities";
import { useSettings } from "@/hooks/useSettings";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { Search } from "lucide-react";

const WeatherMapClient = dynamic(
  () => import("@/components/WeatherMap").then((mod) => mod.WeatherMap),
  { ssr: false }
);
const SavedCitiesMapClient = dynamic(
  () => import("@/components/WeatherMap").then((mod) => mod.SavedCitiesMap),
  { ssr: false }
);

export default function WeatherMapPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [apiConnected, setApiConnected] = useState(true);
  const [dataMode, setDataMode] = useState<"Live" | "Simulation">("Live");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const {
    currentWeather,
    loading,
    error,
    fetchCurrentWeather,
    setCurrentWeather,
  } = useWeather();
  const { savedCities, fetchSavedCities, saveCity, searchCities, searchResults } =
    useCities();
  const { settings } = useSettings();

  useEffect(() => {
    setDataMode(settings.data_mode);
    setTheme(settings.theme as "dark" | "light");
    fetchSavedCities();
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
      setSelectedCity(weather.city);
    } catch {
      // handled in hook
    }
  };

  const handleSaveCity = async (city: any) => {
    try {
      await saveCity({
        city: city.name,
        country: city.country,
        lat: city.lat,
        lon: city.lon,
      });
      fetchSavedCities();
    } catch {
      // handled in hook
    }
  };

  const mapCities = currentWeather ? [currentWeather] : [];

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
          onRefresh={() => {
            if (selectedCity) {
              fetchCurrentWeather(selectedCity, undefined, settings.data_mode);
            }
          }}
          onSearch={(q) => setSearchQuery(q)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main className="p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Weather Map</h1>
            <p className="text-gray-400 text-sm">
              Interactive geographical weather visualization with OpenStreetMap
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <h2 className="text-sm font-semibold text-gray-300 mb-4">
                  Search & Select City
                </h2>
                <form onSubmit={handleSearch} className="mb-4">
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

                {searchResults.length > 0 && (
                  <div className="space-y-2">
                    {searchResults.map((city) => (
                      <button
                        key={`${city.name}-${city.country}`}
                        onClick={() => {
                          setSearchQuery(city.name);
                          fetchCurrentWeather(
                            city.name,
                            city.country,
                            settings.data_mode
                          ).then((w) => setSelectedCity(w.city));
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-600 text-sm text-gray-300 transition-colors"
                      >
                        {city.name}, {city.country}
                      </button>
                    ))}
                  </div>
                )}

                {currentWeather && (
                  <div className="mt-4 p-4 rounded-xl bg-blue-600/10 border border-blue-500/20">
                    <h3 className="text-sm font-bold text-white mb-1">
                      {currentWeather.city}, {currentWeather.country}
                    </h3>
                    <p className="text-xs text-gray-300">
                      {Math.round(currentWeather.temperature)}°C •
                      {currentWeather.weather_condition}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Lat: {currentWeather.lat.toFixed(4)}, Lon:{" "}
                      {currentWeather.lon.toFixed(4)}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <h2 className="text-sm font-semibold text-gray-300 mb-4">
                  Saved Cities ({savedCities.length})
                </h2>
                {savedCities.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center">
                    No saved cities yet. Search and select a city to add it.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {savedCities.map((city) => (
                      <div
                        key={city.id}
                        onClick={() => {
                          setSelectedCity(city.city);
                          fetchCurrentWeather(
                            city.city,
                            city.country,
                            settings.data_mode
                          ).then((w) => setCurrentWeather(w));
                        }}
                        className="p-3 rounded-lg bg-gray-700/50 hover:bg-gray-600 cursor-pointer transition-colors group"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-200 group-hover:text-white">
                            {city.city}, {city.country}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-blue-400">
                            {city.lat.toFixed(2)}, {city.lon.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 h-[600px] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-sm font-semibold text-gray-300">
                    Live Weather Map
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>🟢 Live Mode</span>
                    <span>OpenStreetMap tiles</span>
                  </div>
                </div>
                <WeatherMapClient
                  center={
                    currentWeather
                      ? [currentWeather.lat, currentWeather.lon]
                      : [20, 0]
                  }
                  zoom={currentWeather ? 6 : 2}
                  cities={mapCities}
                />
                {currentWeather && (
                  <div className="mt-4 p-4 rounded-xl bg-gray-700 border border-gray-600">
                    <h3 className="text-sm font-bold text-white mb-2">
                      Selected Location
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">City</span>
                        <div className="text-gray-300">{currentWeather.city}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Country</span>
                        <div className="text-gray-300">{currentWeather.country}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Latitude</span>
                        <div className="text-gray-300">{currentWeather.lat.toFixed(4)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Longitude</span>
                        <div className="text-gray-300">{currentWeather.lon.toFixed(4)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Temperature</span>
                        <div className="text-gray-300">{Math.round(currentWeather.temperature)}°C</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Condition</span>
                        <div className="text-gray-300 capitalize">{currentWeather.weather_condition}</div>
                      </div>
                    </div>
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
