"use client";

import { useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { Info, Github, FileText, Database, Layers, Shield, Clock } from "lucide-react";

export default function About() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={`lg:pl-64 transition-all duration-300 min-h-screen`}>
        <Navbar
          apiConnected={true}
          dataMode="Live"
          theme="dark"
          toggleTheme={() => {}}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onRefresh={() => {}}
          onSearch={() => {}}
          searchQuery=""
          setSearchQuery={() => {}}
        />

        <main className="p-6 lg:p-8">
          <div className="max-w-4xl">
            <h1 className="text-2xl font-bold text-white mb-6">About Project</h1>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
              <h2 className="text-lg font-bold text-white mb-3">Weather Forecast & Alert Application</h2>
              <p className="text-gray-400 mb-4">
                A professional, full-stack weather analytics platform built with Python, FastAPI,
                Next.js, React, Tailwind CSS, and the OpenWeatherMap API. Features real-time weather
                monitoring, 5-day forecasts, automated alert generation, interactive maps, multi-city
                comparison, simulation mode, and downloadable CSV/JSON reports.
              </p>
              <p className="text-gray-400">
                Developed as a Python course project and GitHub portfolio project demonstrating
                practical skills in REST API development, third-party API integration, data processing,
                data visualization, and full-stack application development.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <Info size={20} className="text-blue-400" />
                  Objectives
                </h3>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li>• Real-time weather information for any city</li>
                  <li>• 5-day forecast with 3-hour intervals</li>
                  <li>• Configurable weather alert thresholds</li>
                  <li>• Multi-city monitoring and comparison</li>
                  <li>• Interactive weather maps with Leaflet</li>
                  <li>• Data visualization with Recharts</li>
                  <li>• Simulation mode for offline demo</li>
                  <li>• Downloadable CSV and JSON reports</li>
                </ul>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <Layers size={20} className="text-purple-400" />
                  Technology Stack
                </h3>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li>• Backend: Python, FastAPI, Uvicorn</li>
                  <li>• Data: Pandas, NumPy, Pydantic</li>
                  <li>• Frontend: Next.js 14, React 18, TypeScript</li>
                  <li>• Styling: Tailwind CSS</li>
                  <li>• Icons: Lucide React</li>
                  <li>• Charts: Recharts</li>
                  <li>• Maps: Leaflet, React Leaflet</li>
                  <li>• Weather: OpenWeatherMap API</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <FileText size={20} className="text-green-400" />
                  Key Features
                </h3>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li className="flex items-center gap-2">✓ Current & forecast weather</li>
                  <li className="flex items-center gap-2">✓ Multi-city monitoring</li>
                  <li className="flex items-center gap-2">✓ Automated alert generation</li>
                  <li className="flex items-center gap-2">✓ Interactive maps</li>
                  <li className="flex items-center gap-2">✓ Customizable thresholds</li>
                  <li className="flex items-center gap-2">✓ Live/Simulation modes</li>
                  <li className="flex items-center gap-2">✓ CSV/JSON report downloads</li>
                  <li className="flex items-center gap-2">✓ Dark/Light theme</li>
                </ul>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <Shield size={20} className="text-red-400" />
                  Security & Best Practices
                </h3>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li className="flex items-center gap-2">✓ API keys in environment variables</li>
                  <li className="flex items-center gap-2">✓ CORS restricted to frontend origin</li>
                  <li className="flex items-center gap-2">✓ Input validation with Pydantic</li>
                  <li className="flex items-center gap-2">✓ No secrets in frontend code</li>
                  <li className="flex items-center gap-2">✓ Error handling & timeouts</li>
                  <li className="flex items-center gap-2">✓ Rate limit awareness</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                <Github size={20} className="text-gray-400" />
                Repository
              </h3>
              <p className="text-gray-400 mb-4">
                This project is designed for GitHub portfolio presentation with complete
                documentation, setup instructions, and professional code structure.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
                >
                  View on GitHub
                </a>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
