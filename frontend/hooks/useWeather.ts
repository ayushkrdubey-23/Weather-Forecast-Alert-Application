"use client";

import { useState, useCallback, useEffect } from "react";
import { apiService } from "@/services/api";
import {
  CurrentWeather,
  ForecastResponse,
  AirQuality,
  DataMode,
} from "@/types";

export function useWeather() {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(
    null
  );
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [airQuality, setAirQuality] = useState<AirQuality | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentWeather = useCallback(
    async (
      city: string,
      country?: string,
      mode: DataMode = "Live"
    ) => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiService.getCurrentWeather(city, country, mode);
        setCurrentWeather(data);
        return data;
      } catch (err: any) {
        const msg = err.response?.data?.detail || err.message || "Failed to fetch weather";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchForecast = useCallback(
    async (city: string, country?: string, mode: DataMode = "Live") => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiService.getForecast(city, country, mode);
        setForecast(data);
        return data;
      } catch (err: any) {
        const msg = err.response?.data?.detail || err.message || "Failed to fetch forecast";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchAirQuality = useCallback(
    async (
      lat: number,
      lon: number,
      city: string,
      country: string,
      mode: DataMode = "Live"
    ) => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiService.getAirQuality(
          lat,
          lon,
          city,
          country,
          mode
        );
        setAirQuality(data);
        return data;
      } catch (err: any) {
        const msg = err.response?.data?.detail || err.message || "Failed to fetch air quality";
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    currentWeather,
    forecast,
    airQuality,
    loading,
    error,
    fetchCurrentWeather,
    fetchForecast,
    fetchAirQuality,
    setCurrentWeather,
    setForecast,
    setAirQuality,
  };
}
