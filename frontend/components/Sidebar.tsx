"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sun,
  Cloud,
  Map,
  AlertTriangle,
  BarChart3,
  SlidersHorizontal,
  Download,
  Settings,
  Info,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Live Weather", href: "/live-weather", icon: Sun },
  { name: "Forecast", href: "/forecast", icon: Cloud },
  { name: "Weather Map", href: "/weather-map", icon: Map },
  { name: "Alerts", href: "/alerts", icon: AlertTriangle },
  { name: "City Comparison", href: "/city-comparison", icon: SlidersHorizontal },
  { name: "Reports", href: "/reports", icon: Download },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "About", href: "/about", icon: Info },
];

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:relative lg:translate-x-0 lg:static`}
    >
      <div className="flex h-full flex-col">
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-700 bg-gray-900">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="font-bold text-xl tracking-tight">WeatherApp</span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
                onClick={onClose}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-700 bg-gray-900">
          <button
            onClick={onClose}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            <Menu size={20} />
            Close Menu
          </button>
        </div>
      </div>
    </aside>
  );
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 text-gray-300 hover:text-white"
    >
      <Menu size={24} />
    </button>
  );
}
