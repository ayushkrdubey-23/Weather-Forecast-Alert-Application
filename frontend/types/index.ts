export type DataMode = "Live" | "Simulation";
export type AlertSeverity = "Information" | "Advisory" | "Warning" | "Critical";
export type TemperatureUnit = "celsius" | "fahrenheit";
export type WindSpeedUnit = "kmh" | "ms" | "mph";

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface CurrentWeather {
  city: string;
  country: string;
  lat: number;
  lon: number;
  temperature: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  wind_deg?: number;
  wind_dir?: string;
  visibility?: number;
  cloud_coverage: number;
  weather_condition: string;
  weather_description: string;
  weather_icon: string;
  sunrise?: number;
  sunset?: number;
  rainfall?: number;
  aqi?: number;
  aqi_category?: string;
  timestamp: string;
  data_mode: DataMode;
  source: string;
}

export interface ForecastEntry {
  dt: number;
  dt_txt: string;
  temperature: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  wind_deg?: number;
  cloud_coverage: number;
  weather_condition: string;
  weather_description: string;
  weather_icon: string;
  pop: number;
  rainfall?: number;
  snow?: number;
}

export interface ForecastResponse {
  city: string;
  country: string;
  lat: number;
  lon: number;
  forecast: ForecastEntry[];
  data_mode: DataMode;
  source: string;
}

export interface AirQuality {
  city: string;
  country: string;
  lat: number;
  lon: number;
  aqi: number;
  aqi_category: string;
  components: Record<string, number>;
  timestamp: string;
  data_mode: DataMode;
}

export interface Alert {
  id: string;
  city: string;
  country: string;
  parameter: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  measured_value: number;
  threshold: number;
  unit: string;
  timestamp: string;
  is_forecast?: boolean;
  dismissed?: boolean;
}

export interface AlertThresholds {
  temperature_max: number;
  rainfall_max: number;
  humidity_max: number;
  wind_speed_max: number;
  aqi_max: number;
}

export interface AlertCheckRequest {
  city: string;
  country: string;
  lat: number;
  lon: number;
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  rainfall: number;
  cloud_coverage: number;
  weather_condition: string;
  aqi?: number;
  data_mode: DataMode;
}

export interface ReportRequest {
  city: string;
  start_date?: string;
  end_date?: string;
  format: "csv" | "json";
}

export interface AppSettingsUpdate {
  temperature_threshold?: number;
  rainfall_threshold?: number;
  humidity_threshold?: number;
  wind_speed_threshold?: number;
  aqi_threshold?: number;
  temperature_unit?: TemperatureUnit;
  wind_speed_unit?: WindSpeedUnit;
  default_city?: string;
  refresh_interval?: number;
  theme?: string;
  notifications_enabled?: boolean;
  data_mode?: DataMode;
}

export interface SavedCity {
  id: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  added_at: string;
}

export interface SaveCityRequest {
  city: string;
  country: string;
  lat: number;
  lon: number;
}

export interface CitySearchResult {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
}

export interface SimulationWeather {
  city: string;
  country: string;
  lat: number;
  lon: number;
  temperature: number;
  feels_like: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  wind_deg: number;
  rainfall: number;
  cloud_coverage: number;
  weather_condition: string;
  weather_description: string;
  aqi?: number;
  data_mode: DataMode;
  source: string;
}

export interface ReportInfo {
  id: string;
  city: string;
  generated_at: string;
  format: string;
  filename: string;
  record_count: number;
  data_mode: DataMode;
}

export interface AppSettings {
  temperature_threshold: number;
  rainfall_threshold: number;
  humidity_threshold: number;
  wind_speed_threshold: number;
  aqi_threshold: number;
  temperature_unit: TemperatureUnit;
  wind_speed_unit: WindSpeedUnit;
  default_city?: string;
  refresh_interval: number;
  theme: string;
  notifications_enabled: boolean;
  data_mode: DataMode;
}

export interface AlertSummary {
  total: number;
  critical: number;
  warning: number;
  advisory: number;
  information: number;
}

export interface WeatherDataPoint {
  city: string;
  country: string;
  date: string;
  weather_condition: string;
  temperature: number;
  humidity: number;
  wind_speed: number;
  rainfall: number;
  aqi?: number;
  data_source: string;
  data_mode: DataMode;
}
