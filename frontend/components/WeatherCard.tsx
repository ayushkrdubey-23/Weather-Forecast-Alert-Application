"use client";

import { CurrentWeather } from "@/types";
import {
  Thermometer,
  Droplets,
  Wind,
  Archive,
  Eye,
  Cloud,
  Sun,
} from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Clear: Sun,
  Clouds: Cloud,
  Rain: Cloud,
  Drizzle: Cloud,
  Thunderstorm: Cloud,
  Snow: Cloud,
  Mist: Cloud,
  default: Cloud,
};

export function WeatherCard({
  weather,
}: {
  weather: CurrentWeather;
}) {
  const Icon = ICON_MAP[weather.weather_condition] || ICON_MAP.default;
  const isDay = weather.weather_icon.includes("d");

  return (
    <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700">
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        <div className="flex flex-col items-start lg:items-center text-center lg:text-left">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold">{weather.city}, {weather.country}</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-600 text-xs text-white">
              {weather.data_mode}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-bold text-white">{Math.round(weather.temperature)}°</span>
            <span className="text-xl text-gray-400">C</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Icon size={32} className="text-yellow-400" />
            <span className="text-lg text-gray-300 capitalize">{weather.weather_description}</span>
          </div>
          <span className="text-gray-500 text-sm mt-2">
            Feels like {Math.round(weather.feels_like)}°C
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
          <StatRow
            icon={Thermometer}
            label="Min / Max"
            value={`${Math.round(weather.temp_min)}° / ${Math.round(weather.temp_max)}°`}
          />
          <StatRow
            icon={Droplets}
            label="Humidity"
            value={`${weather.humidity}%`}
          />
          <StatRow
            icon={Wind}
            label="Wind"
            value={`${weather.wind_speed} km/h ${weather.wind_dir || ""}`}
          />
          <StatRow
            icon={Archive}
            label="Pressure"
            value={`${weather.pressure} hPa`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 w-full lg:w-auto">
          <StatRow
            icon={Eye}
            label="Visibility"
            value={`${Math.round((weather.visibility || 10000) / 1000)} km`}
          />
          <StatRow
            icon={Droplets}
            label="Rainfall"
            value={`${weather.rainfall || 0} mm`}
          />
          <StatRow
            icon={Cloud}
            label="Clouds"
            value={`${weather.cloud_coverage}%`}
          />
          {weather.aqi !== undefined && (
            <StatRow
              icon={Archive}
              label="AQI"
              value={String(weather.aqi)}
            />
          )}
        </div>
      </div>

      {weather.sunrise && weather.sunset && (
        <div className="mt-6 pt-6 border-t border-gray-700 flex justify-between text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Sun size={16} className="text-yellow-400" />
            <span>Sunrise {new Date(weather.sunrise * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Sun size={16} className="text-gray-500" />
            <span>Sunset {new Date(weather.sunset * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function StatRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-gray-500 uppercase">{label}</span>
      <span className="text-sm font-medium text-gray-200">{value}</span>
    </div>
  );
}
