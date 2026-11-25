"use client";

import { useState, useCallback } from "react";
import { apiService } from "@/services/api";
import { Alert, AlertThresholds, AlertCheckRequest, AlertSummary } from "@/types";

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [history, setHistory] = useState<Alert[]>([]);
  const [summary, setSummary] = useState<AlertSummary>({
    total: 0,
    critical: 0,
    warning: 0,
    advisory: 0,
    information: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [thresholds, setThresholds] = useState<AlertThresholds>({
    temperature_max: 40,
    rainfall_max: 7.5,
    humidity_max: 85,
    wind_speed_max: 50,
    aqi_max: 100,
  });

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [active, hist, summ] = await Promise.all([
        apiService.getActiveAlerts(),
        apiService.getAlertHistory(),
        apiService.getAlertSummary(),
      ]);
      setAlerts(active);
      setHistory(hist);
      setSummary(summ);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "Failed to fetch alerts");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchThresholds = useCallback(async () => {
    try {
      const data = await apiService.getAlertThresholds();
      setThresholds(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "Failed to fetch thresholds");
    }
  }, []);

  const checkAlerts = useCallback(async (request: AlertCheckRequest) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.checkAlerts(request);
      return data;
    } catch (err: any) {
      const msg = err.response?.data?.detail || err.message || "Failed to check alerts";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateThresholds = useCallback(async (newThresholds: AlertThresholds) => {
    try {
      const data = await apiService.updateAlertThresholds(newThresholds);
      setThresholds(data);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "Failed to update thresholds");
      throw err;
    }
  }, []);

  return {
    alerts,
    history,
    summary,
    loading,
    error,
    thresholds,
    fetchAlerts,
    fetchThresholds,
    checkAlerts,
    updateThresholds,
  };
}
