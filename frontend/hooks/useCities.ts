"use client";

import { useState, useCallback } from "react";
import { apiService } from "@/services/api";
import {
  CitySearchResult,
  SavedCity,
  SaveCityRequest,
} from "@/types";

export function useCities() {
  const [savedCities, setSavedCities] = useState<SavedCity[]>([]);
  const [searchResults, setSearchResults] = useState<CitySearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSavedCities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getSavedCities();
      setSavedCities(data);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "Failed to fetch saved cities");
    } finally {
      setLoading(false);
    }
  }, []);

  const searchCities = useCallback(async (q: string) => {
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.searchCities(q);
      setSearchResults(data);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "Failed to search cities");
    } finally {
      setLoading(false);
    }
  }, []);

  const saveCity = useCallback(async (request: SaveCityRequest) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.saveCity(request);
      setSavedCities((prev) => [...prev, data]);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "Failed to save city");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSavedCity = useCallback(async (cityId: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiService.deleteSavedCity(cityId);
      setSavedCities((prev) => prev.filter((c) => c.id !== cityId));
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "Failed to delete city");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    savedCities,
    searchResults,
    loading,
    error,
    fetchSavedCities,
    searchCities,
    saveCity,
    deleteSavedCity,
    setSearchResults,
  };
}
