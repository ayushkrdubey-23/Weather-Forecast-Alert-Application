"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useWeather } from "@/hooks/useWeather";
import { useCities } from "@/hooks/useCities";
import { CurrentWeather, SavedCity } from "@/types";

const LEAFLET_CSS =
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS =
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

function loadLeaflet() {
  return new Promise<void>((resolve) => {
    if (typeof window !== "undefined" && (window as any).L) {
      resolve();
      return;
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = LEAFLET_CSS;
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = LEAFLET_JS;
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

export function WeatherMap({
  center = [20, 0] as [number, number],
  zoom = 2,
  cities,
}: {
  center?: [number, number];
  zoom?: number;
  cities: CurrentWeather[];
}) {
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  useEffect(() => {
    loadLeaflet().then(() => setLeafletLoaded(true));
  }, []);

  if (!leafletLoaded) {
    return (
      <div className="h-[500px] bg-gray-800 rounded-xl flex items-center justify-center text-gray-500 border border-gray-700">
        Loading map...
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="h-[500px] w-full rounded-xl border border-gray-700"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {cities.map((city) => (
        <Marker key={city.city} position={[city.lat, city.lon]}>
          <Popup>
            <div className="p-2">
              <div className="font-bold text-gray-800 dark:text-white">
                {city.city}, {city.country}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {Math.round(city.temperature)}°C
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {city.weather_condition}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export function SavedCitiesMap({ savedCities }: { savedCities: SavedCity[] }) {
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  useEffect(() => {
    loadLeaflet().then(() => setLeafletLoaded(true));
  }, []);

  if (!leafletLoaded || savedCities.length === 0) {
    return (
      <div className="h-[500px] bg-gray-800 rounded-xl flex items-center justify-center text-gray-500 border border-gray-700">
        {savedCities.length === 0 ? "No saved cities to display" : "Loading map..."}
      </div>
    );
  }

  const center =
    savedCities.length > 0
      ? ([savedCities[0].lat, savedCities[0].lon] as [number, number])
      : ([20, 0] as [number, number]);

  return (
    <MapContainer
      center={center}
      zoom={3}
      className="h-[500px] w-full rounded-xl border border-gray-700"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {savedCities.map((city) => (
        <Marker key={city.id} position={[city.lat, city.lon]}>
          <Popup>
            <div className="p-2">
              <div className="font-bold text-gray-800 dark:text-white">
                {city.city}, {city.country}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
