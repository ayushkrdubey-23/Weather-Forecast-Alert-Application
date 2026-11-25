from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class AlertSeverity(str, Enum):
    INFO = "Information"
    ADVISORY = "Advisory"
    WARNING = "Warning"
    CRITICAL = "Critical"


class DataMode(str, Enum):
    LIVE = "Live"
    SIMULATION = "Simulation"


class TemperatureUnit(str, Enum):
    CELSIUS = "celsius"
    FAHRENHEIT = "fahrenheit"


class WindSpeedUnit(str, Enum):
    KMH = "kmh"
    MS = "ms"
    MPH = "mph"


# --- Weather Schemas ---

class Coordinates(BaseModel):
    lat: float
    lon: float


class CurrentWeatherResponse(BaseModel):
    city: str
    country: str
    lat: float
    lon: float
    temperature: float
    feels_like: float
    temp_min: float
    temp_max: float
    humidity: int
    pressure: int
    wind_speed: float
    wind_deg: Optional[int] = None
    wind_dir: Optional[str] = None
    visibility: Optional[int] = None
    cloud_coverage: int
    weather_condition: str
    weather_description: str
    weather_icon: str
    sunrise: Optional[int] = None
    sunset: Optional[int] = None
    rainfall: Optional[float] = 0.0
    aqi: Optional[int] = None
    aqi_category: Optional[str] = None
    timestamp: datetime
    data_mode: DataMode
    source: str


class ForecastEntryResponse(BaseModel):
    dt: int
    dt_txt: str
    temperature: float
    feels_like: float
    temp_min: float
    temp_max: float
    humidity: int
    pressure: int
    wind_speed: float
    wind_deg: Optional[int] = None
    cloud_coverage: int
    weather_condition: str
    weather_description: str
    weather_icon: str
    pop: float
    rainfall: Optional[float] = 0.0
    snow: Optional[float] = 0.0


class ForecastResponse(BaseModel):
    city: str
    country: str
    lat: float
    lon: float
    forecast: List[ForecastEntryResponse]
    data_mode: DataMode
    source: str


class AirQualityResponse(BaseModel):
    city: str
    country: str
    lat: float
    lon: float
    aqi: int
    aqi_category: str
    components: Dict[str, float]
    timestamp: datetime
    data_mode: DataMode


# --- City Schemas ---

class CitySearchRequest(BaseModel):
    q: str = Field(..., min_length=1, description="City name to search")


class CitySearchResult(BaseModel):
    name: str
    country: str
    lat: float
    lon: float


class SavedCity(BaseModel):
    id: str
    city: str
    country: str
    lat: float
    lon: float
    added_at: datetime


class SaveCityRequest(BaseModel):
    city: str = Field(..., min_length=1)
    country: str
    lat: float
    lon: float


# --- Alert Schemas ---

class AlertThresholds(BaseModel):
    temperature_max: float = Field(40.0, ge=-50, le=100)
    rainfall_max: float = Field(7.5, ge=0, le=100)
    humidity_max: int = Field(85, ge=0, le=100)
    wind_speed_max: float = Field(50.0, ge=0, le=200)
    aqi_max: int = Field(100, ge=0, le=500)


class AlertResponse(BaseModel):
    id: str
    city: str
    country: str
    parameter: str
    severity: AlertSeverity
    title: str
    description: str
    measured_value: float
    threshold: float
    unit: str
    timestamp: datetime
    is_forecast: bool = False
    dismissed: bool = False


class AlertHistoryEntry(BaseModel):
    id: str
    city: str
    parameter: str
    severity: AlertSeverity
    title: str
    measured_value: float
    threshold: float
    unit: str
    timestamp: datetime
    is_forecast: bool
    dismissed: bool


class AlertCheckRequest(BaseModel):
    city: str
    country: str
    lat: float
    lon: float
    temperature: float
    feels_like: float
    humidity: int
    pressure: int
    wind_speed: float
    rainfall: float
    cloud_coverage: int
    weather_condition: str
    aqi: Optional[int] = None
    data_mode: DataMode = DataMode.LIVE


# --- Simulation Schemas ---

class SimulationScenario(BaseModel):
    id: str
    name: str
    description: str


class SimulationWeatherResponse(BaseModel):
    city: str
    country: str
    lat: float
    lon: float
    temperature: float
    feels_like: float
    humidity: int
    pressure: int
    wind_speed: float
    wind_deg: int
    rainfall: float
    cloud_coverage: int
    weather_condition: str
    weather_description: str
    aqi: Optional[int] = None
    data_mode: DataMode = DataMode.SIMULATION
    source: str = "Simulation"


class ActivateSimulationRequest(BaseModel):
    scenario_id: str


# --- Report Schemas ---

class ReportRequest(BaseModel):
    city: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    format: str = Field("csv", pattern="^(csv|json)$")


class ReportInfo(BaseModel):
    id: str
    city: str
    generated_at: datetime
    format: str
    filename: str
    record_count: int
    data_mode: DataMode


# --- Settings Schemas ---

class AppSettings(BaseModel):
    temperature_threshold: float = 40.0
    rainfall_threshold: float = 7.5
    humidity_threshold: int = 85
    wind_speed_threshold: float = 50.0
    aqi_threshold: int = 100
    temperature_unit: TemperatureUnit = TemperatureUnit.CELSIUS
    wind_speed_unit: WindSpeedUnit = WindSpeedUnit.KMH
    default_city: Optional[str] = None
    refresh_interval: int = 300
    theme: str = "dark"
    notifications_enabled: bool = True
    data_mode: DataMode = DataMode.LIVE


class AppSettingsUpdate(BaseModel):
    temperature_threshold: Optional[float] = None
    rainfall_threshold: Optional[float] = None
    humidity_threshold: Optional[int] = None
    wind_speed_threshold: Optional[float] = None
    aqi_threshold: Optional[int] = None
    temperature_unit: Optional[TemperatureUnit] = None
    wind_speed_unit: Optional[WindSpeedUnit] = None
    default_city: Optional[str] = None
    refresh_interval: Optional[int] = None
    theme: Optional[str] = None
    notifications_enabled: Optional[bool] = None
    data_mode: Optional[DataMode] = None


# --- Health / Status ---

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str


class StatusResponse(BaseModel):
    api_connected: bool
    data_mode: DataMode
    openweather_configured: bool
    timestamp: datetime
