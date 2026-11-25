"use client";

import { useState, useCallback, useEffect } from "react";
import { apiService } from "@/services/api";
import { AppSettings, AppSettingsUpdate } from "@/types";

const DEFAULT_SETTINGS: AppSettings = {
  temperature_threshold: 40,
  rainfall_threshold: 7.5,
  humidity_threshold: 85,
  wind_speed_threshold: 50,
  aqi_threshold: 100,
  temperature_unit: "celsius",
  wind_speed_unit: "kmh",
  default_city: undefined,
  refresh_interval: 300,
  theme: "dark",
  notifications_enabled: true,
  data_mode: "Live",
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = useCallback(async () => {
    try {
      const thresholds = await apiService.getAlertThresholds();
      const saved = localStorage.getItem("weather-app-settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed, ...thresholds });
      } else {
        setSettings({ ...DEFAULT_SETTINGS, ...thresholds });
      }
    } catch (err: any) {
      setError(err.message || "Failed to load settings");
      setSettings(DEFAULT_SETTINGS);
    }
  }, []);

  const updateSettings = useCallback(async (updates: AppSettingsUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.updateSettings(updates);
      const newSettings = { ...settings, ...data };
      setSettings(newSettings);
      localStorage.setItem("weather-app-settings", JSON.stringify(newSettings));
      return newSettings;
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || "Failed to update settings";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [settings]);

  const setDataMode = useCallback(async (mode: "Live" | "Simulation") => {
    const newSettings = { ...settings, data_mode: mode };
    setSettings(newSettings);
    localStorage.setItem("weather-app-settings", JSON.stringify(newSettings));
    try {
      await apiService.updateSettings({ data_mode: mode });
    } catch {
      // Backend may not have this exact endpoint, local persistence is enough
    }
    return newSettings;
  }, [settings]);

  const setTheme = useCallback((theme: string) => {
    const newSettings = { ...settings, theme };
    setSettings(newSettings);
    localStorage.setItem("weather-app-settings", JSON.stringify(newSettings));
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    return newSettings;
  }, [settings]);

  return {
    settings,
    loading,
    error,
    updateSettings,
    setDataMode,
    setTheme,
    loadSettings,
  };
}
