"use client";

import { useEffect, useState } from "react";
import { useWeather } from "@/hooks/useWeather";
import { useSettings } from "@/hooks/useSettings";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { apiService } from "@/services/api";
import { Download, FileText, Clock, Search as SearchIcon } from "lucide-react";

export default function Reports() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [apiConnected, setApiConnected] = useState(true);
  const [dataMode, setDataMode] = useState<"Live" | "Simulation">("Live");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    currentWeather,
    loading: weatherLoading,
    error,
    fetchCurrentWeather,
  } = useWeather();
  const { settings } = useSettings();

  useEffect(() => {
    setDataMode(settings.data_mode);
    setTheme(settings.theme as "dark" | "light");
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await apiService.getReports();
      setReports(data);
    } catch {
      // ignore
    }
  };

  const handleGenerateReport = async (format: "csv" | "json") => {
    if (!currentWeather) return;
    setLoading(true);
    try {
      const report = await apiService.generateReport({
        city: currentWeather.city,
        format,
      });
      setLoading(false);
      loadReports();
      alert(`Report generated: ${report.filename}`);
    } catch (err: any) {
      setLoading(false);
      alert(err.message || "Failed to generate report");
    }
  };

  const handleDownload = async (filename: string, format: "csv" | "json") => {
    setLoading(true);
    try {
      if (format === "csv") {
        await apiService.downloadCsv(filename);
      } else {
        await apiService.downloadJson(filename);
      }
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      alert(err.message || "Failed to download report");
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
          }}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onRefresh={() => {}}
          onSearch={() => {}}
          searchQuery=""
          setSearchQuery={() => {}}
        />

        <main className="p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Historical Reports</h1>
            <p className="text-gray-400 text-sm">
              Generate and download weather reports in CSV and JSON formats
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-sm font-semibold text-gray-300 mb-4">
                  Generate Report
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-2">City</label>
                    <input
                      type="text"
                      defaultValue={currentWeather?.city || ""}
                      className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleGenerateReport("csv")}
                      disabled={loading}
                      className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors font-medium disabled:opacity-50"
                    >
                      {loading ? "Generating..." : <Download size={18} className="mr-2" />}
                      Download CSV
                    </button>
                    <button
                      onClick={() => handleGenerateReport("json")}
                      disabled={loading}
                      className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium disabled:opacity-50"
                    >
                      {loading ? "Generating..." : <Download size={18} className="mr-2" />}
                      Download JSON
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Reports include: city, date, weather condition, temperature, humidity, wind speed, rainfall, AQI, data source, and data mode.
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-sm font-semibold text-gray-300 mb-4">
                  Report History
                </h2>
                {reports.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText size={48} className="mx-auto mb-4 text-gray-500" />
                    <p className="text-sm text-gray-400">No reports generated yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reports.map((report) => (
                      <div key={report.id} className="p-3 rounded-lg bg-gray-700/30 border border-gray-600/50">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium text-gray-300">{report.city}</span>
                          <span className="text-xs text-gray-500">{report.format.toUpperCase()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <span>{report.record_count} records</span>
                          <span>•</span>
                          <span>{report.data_mode}</span>
                          <span>•</span>
                          <span>{new Date(report.generated_at).toLocaleString()}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDownload(report.filename, report.format as any)}
                            disabled={loading}
                            className="flex-1 px-2 py-1.5 bg-blue-600/20 text-blue-400 text-xs rounded hover:bg-blue-600/30 transition-colors disabled:opacity-50"
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 h-fit">
                <h2 className="text-sm font-semibold text-gray-300 mb-4">
                  Current Data Source
                </h2>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <div
                    className={`w-3 h-3 rounded-full ${dataMode === "Live" ? "bg-green-500" : "bg-amber-500"}`}
                  />
                    <span className="font-medium text-gray-300">Mode: {dataMode}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-gray-500">Last updated: {new Date().toLocaleTimeString()}</span>
                  </div>
                  {currentWeather && (
                    <div className="flex items-center gap-3">
                      <SearchIcon size={16} className="text-blue-400" />
                      <span className="text-gray-500">City: {currentWeather.city}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
