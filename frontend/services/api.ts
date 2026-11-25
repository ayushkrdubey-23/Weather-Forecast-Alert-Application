import axios, { AxiosInstance } from "axios";
import {
  CurrentWeather,
  ForecastResponse,
  AirQuality,
  CitySearchResult,
  SavedCity,
  SaveCityRequest,
  Alert,
  AlertThresholds,
  AlertCheckRequest,
  SimulationScenario,
  SimulationWeather,
  ReportInfo,
  ReportRequest,
  AppSettings,
  AppSettingsUpdate,
  AlertSummary,
  DataMode,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 15000,
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.code === "ECONNREFUSED") {
          console.error("Backend connection refused. Is the server running?");
        }
        return Promise.reject(error);
      }
    );
  }

  // Health
  async health() {
    const { data } = await this.client.get("/api/health");
    return data;
  }

  async status() {
    const { data } = await this.client.get("/api/status");
    return data;
  }

  // Weather
  async getCurrentWeather(
    city: string,
    country?: string,
    mode?: DataMode
  ): Promise<CurrentWeather> {
    const params: Record<string, string> = {};
    if (country) params.country = country;
    if (mode) params.mode = mode;
    const { data } = await this.client.get(`/api/weather/current`, {
      params: { city, ...params },
    });
    return data;
  }

  async getForecast(
    city: string,
    country?: string,
    mode?: DataMode
  ): Promise<ForecastResponse> {
    const params: Record<string, string> = {};
    if (country) params.country = country;
    if (mode) params.mode = mode;
    const { data } = await this.client.get(`/api/weather/forecast`, {
      params: { city, ...params },
    });
    return data;
  }

  async getAirQuality(
    lat: number,
    lon: number,
    city: string,
    country: string,
    mode?: DataMode
  ): Promise<AirQuality> {
    const params: Record<string, string> = {};
    if (mode) params.mode = mode;
    const { data } = await this.client.get(`/api/weather/air-quality`, {
      params: { lat, lon, city, country, ...params },
    });
    return data;
  }

  // Cities
  async searchCities(q: string): Promise<CitySearchResult[]> {
    const { data } = await this.client.get(`/api/cities/search`, {
      params: { q },
    });
    return data;
  }

  async getSavedCities(): Promise<SavedCity[]> {
    const { data } = await this.client.get(`/api/cities/saved`);
    return data;
  }

  async saveCity(request: SaveCityRequest): Promise<SavedCity> {
    const { data } = await this.client.post(`/api/cities/saved`, request);
    return data;
  }

  async deleteSavedCity(cityId: string): Promise<void> {
    await this.client.delete(`/api/cities/saved/${cityId}`);
  }

  // Alerts
  async getActiveAlerts(): Promise<Alert[]> {
    const { data } = await this.client.get(`/api/alerts`);
    return data;
  }

  async getAlertHistory(): Promise<Alert[]> {
    const { data } = await this.client.get(`/api/alerts/history`);
    return data;
  }

  async checkAlerts(request: AlertCheckRequest): Promise<Alert[]> {
    const { data } = await this.client.post(`/api/alerts/check`, request);
    return data;
  }

  async getAlertThresholds(): Promise<AlertThresholds> {
    const { data } = await this.client.get(`/api/alerts/settings`);
    return data;
  }

  async updateAlertThresholds(
    thresholds: AlertThresholds
  ): Promise<AlertThresholds> {
    const { data } = await this.client.put(
      `/api/alerts/settings`,
      thresholds
    );
    return data;
  }

  async getAlertSummary(): Promise<AlertSummary> {
    const { data } = await this.client.get(`/api/alerts/summary`);
    return data;
  }

  // Simulation
  async getSimulationScenarios(): Promise<SimulationScenario[]> {
    const { data } = await this.client.get(`/api/simulation/scenarios`);
    return data;
  }

  async activateSimulation(scenarioId: string): Promise<any> {
    const { data } = await this.client.post(`/api/simulation/activate`, {
      scenario_id: scenarioId,
    });
    return data;
  }

  async getSimulationWeather(): Promise<SimulationWeather[]> {
    const { data } = await this.client.get(`/api/simulation/weather`);
    return data;
  }

  async getSimulationWeatherForCity(
    cityName: string
  ): Promise<SimulationWeather> {
    const { data } = await this.client.get(
      `/api/simulation/weather/${encodeURIComponent(cityName)}`
    );
    return data;
  }

  // Reports
  async getReports(): Promise<ReportInfo[]> {
    const { data } = await this.client.get(`/api/reports`);
    return data;
  }

  async generateReport(request: ReportRequest): Promise<ReportInfo> {
    const { data } = await this.client.post(`/api/reports/generate`, request);
    return data;
  }

  async downloadCsv(filename: string): Promise<void> {
    const { data } = await this.client.get(`/api/reports/download/csv`, {
      params: { filename },
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  async downloadJson(filename: string): Promise<void> {
    const { data } = await this.client.get(`/api/reports/download/json`, {
      params: { filename },
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  // Settings
  async getSettings(): Promise<AppSettings> {
    const { data } = await this.client.get(`/api/alerts/settings`);
    return data as AppSettings;
  }

  async updateSettings(
    updates: AppSettingsUpdate
  ): Promise<AppSettings> {
    const { data } = await this.client.put(`/api/alerts/settings`, updates);
    return data as AppSettings;
  }
}

export const apiService = new ApiService();
