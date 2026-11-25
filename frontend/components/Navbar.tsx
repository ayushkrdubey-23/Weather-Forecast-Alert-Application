"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Search, Clock, RefreshCw, Moon, Sun, Wifi, AlertCircle } from "lucide-react";
import { MobileMenuButton } from "./Sidebar";

export function Navbar({
  apiConnected,
  dataMode,
  theme,
  toggleTheme,
  onMenuClick,
  onRefresh,
  onSearch,
  searchQuery,
  setSearchQuery,
}: {
  apiConnected: boolean;
  dataMode: "Live" | "Simulation";
  theme: "dark" | "light";
  toggleTheme: () => void;
  onMenuClick: () => void;
  onRefresh: () => void;
  onSearch: (q: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}) {
  const pathname = usePathname();
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between px-6 border-b border-gray-700 bg-gray-900">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="p-2 text-gray-300 hover:text-white">
          <MobileMenuButton onClick={onMenuClick} />
        </button>
        <div className="hidden lg:flex items-center gap-2">
          <div
          className={`w-3 h-3 rounded-full ${apiConnected ? "bg-green-500" : "bg-red-500"}`}
        />
          <span className="text-sm font-medium text-gray-300">
            {apiConnected ? "API Connected" : "API Disconnected"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2">
          <input
            type="text"
            placeholder="Search city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-64"
          />
          <button
            type="submit"
            className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-500 transition-colors"
          >
            <Search size={18} />
          </button>
        </form>

        <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            {dataMode === "Live" ? (
              <Wifi size={14} className="text-green-400" />
            ) : (
              <AlertCircle size={14} className="text-amber-400" />
            )}
            <span>{dataMode} Mode</span>
          </div>
          <span className="px-2 py-1 rounded bg-gray-800 border border-gray-700">
            {new Date().toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-300 hover:text-white transition-colors"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={onRefresh}
            className="p-2 text-gray-300 hover:text-white transition-colors"
            title="Refresh weather data"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
