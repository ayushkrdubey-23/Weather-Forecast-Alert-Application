"use client";

import { useState, useCallback } from "react";
import { apiService } from "@/services/api";
import {
  SimulationScenario,
  SimulationWeather,
} from "@/types";

export function useSimulation() {
  const [scenarios, setScenarios] = useState<SimulationScenario[]>([]);
  const [weather, setWeather] = useState<SimulationWeather[]>([]);
  const [activeScenario, setActiveScenarioState] = useState<string>("normal");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchScenarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getSimulationScenarios();
      setScenarios(data);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "Failed to fetch scenarios");
    } finally {
      setLoading(false);
    }
  }, []);

  const activateScenario = useCallback(async (scenarioId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.activateSimulation(scenarioId);
      setActiveScenarioState(scenarioId);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "Failed to activate scenario");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSimulationWeather = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getSimulationWeather();
      setWeather(data);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "Failed to fetch simulation weather");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCityWeather = useCallback(async (cityName: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getSimulationWeatherForCity(cityName);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "Failed to fetch city weather");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    scenarios,
    weather,
    activeScenario,
    loading,
    error,
    fetchScenarios,
    activateScenario,
    fetchSimulationWeather,
    fetchCityWeather,
    setActiveScenarioState,
    setWeather,
  };
}
