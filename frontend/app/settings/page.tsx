"use client";

import { useEffect, useState } from "react";
import { useSettings } from "@/hooks/useSettings";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { Save, AlertTriangle, Droplets, Wind, Gauge, Palette, Monitor, Bell } from "lucide-react";

export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [apiConnected, setApiConnected] = useState(true);
  const [dataMode, setDataMode] = useState<"Live" | "Simulation">("Live");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [showToast, setShowToast] = useState(false);

  const {
    settings,
    loading,
    updateSettings,
    setDataMode: setAppDataMode,
    setTheme: setAppTheme,
  } = useSettings();

  useEffect(() => {
    setDataMode(settings.data_mode);
    setTheme(settings.theme as "dark" | "light");
  }, []);

  const handleUpdate = async (field: keyof typeof settings, value: any) => {
    try {
      const updates: any = {};
      updates[field] = value;
      await updateSettings(updates);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch {
      // Error handled in hook
    }
  };

  const handleDataModeChange = async (mode: "Live" | "Simulation") => {
    setDataMode(mode);
    await setAppDataMode(mode);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
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
          onRefresh={() => {}}
          onSearch={() => {}}
          searchQuery=""
          setSearchQuery={() => {}}
        />

        {showToast && (
          <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top">
            <Save size={18} className="mr-2" />
            <span className="text-sm font-medium">Settings saved</span>
          </div>
        )}

        <main className="p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
            <p className="text-gray-400 text-sm">
              Configure application preferences and alert thresholds
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
                <h2 className="text-sm font-semibold text-gray-300 mb-6">
                  Alert Thresholds
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm text-gray-300">Temperature Max</label>
                      <p className="text-xs text-gray-500">Trigger alert above this temperature</p>
                    </div>
                    <input
                      type="number"
                      value={settings.temperature_threshold}
                      onChange={(e) => handleUpdate("temperature_threshold", parseFloat(e.target.value))}
                      className="w-24 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm text-gray-300">Rainfall Max</label>
                      <p className="text-xs text-gray-500">Trigger alert above this rainfall rate</p>
                    </div>
                    <input
                      type="number"
                      value={settings.rainfall_threshold}
                      onChange={(e) => handleUpdate("rainfall_threshold", parseFloat(e.target.value))}
                      className="w-24 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm text-gray-300">Humidity Max</label>
                      <p className="text-xs text-gray-500">Trigger alert above this humidity level</p>
                    </div>
                    <input
                      type="number"
                      value={settings.humidity_threshold}
                      onChange={(e) => handleUpdate("humidity_threshold", parseInt(e.target.value))}
                      className="w-24 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm text-gray-300">Wind Speed Max</label>
                      <p className="text-xs text-gray-500">Trigger alert above this wind speed</p>
                    </div>
                    <input
                      type="number"
                      value={settings.wind_speed_threshold}
                      onChange={(e) => handleUpdate("wind_speed_threshold", parseFloat(e.target.value))}
                      className="w-24 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm text-gray-300">AQI Max</label>
                      <p className="text-xs text-gray-500">Trigger alert above this air quality index</p>
                    </div>
                    <input
                      type="number"
                      value={settings.aqi_threshold}
                      onChange={(e) => handleUpdate("aqi_threshold", parseInt(e.target.value))}
                      className="w-24 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-sm font-semibold text-gray-300 mb-6">
                  General Preferences
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Monitor size={20} className="text-blue-400" />
                      <div>
                        <label className="block text-sm text-gray-300">Data Mode</label>
                        <p className="text-xs text-gray-500">Live API or simulation data</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDataModeChange("Live")}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          dataMode === "Live"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        Live
                      </button>
                      <button
                        onClick={() => handleDataModeChange("Simulation")}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          dataMode === "Simulation"
                            ? "bg-amber-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        Simulation
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Palette size={20} className="text-purple-400" />
                      <div>
                        <label className="block text-sm text-gray-300">Theme</label>
                        <p className="text-xs text-gray-500">Dark or light mode</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setTheme("dark");
                          setAppTheme("dark");
                        }}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          theme === "dark"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        Dark
                      </button>
                      <button
                        onClick={() => {
                          setTheme("light");
                          setAppTheme("light");
                        }}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          theme === "light"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        Light
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell size={20} className="text-red-400" />
                      <div>
                        <label className="block text-sm text-gray-300">Notifications</label>
                        <p className="text-xs text-gray-500">Enable in-app alert notifications</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications_enabled}
                        onChange={(e) =>
                          handleUpdate("notifications_enabled", e.target.checked)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
                <h2 className="text-sm font-semibold text-gray-300 mb-4">
                  Default Thresholds
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Temperature</span>
                    <span>40°C</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Rainfall</span>
                    <span>7.5 mm/h</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Humidity</span>
                    <span>85%</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Wind Speed</span>
                    <span>50 km/h</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>AQI</span>
                    <span>100</span>
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
