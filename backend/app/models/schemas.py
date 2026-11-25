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


# --- Weather Models ---

class Coordinates(BaseModel):
    lat: float
    lon: float


class CurrentWeather(BaseModel):
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


class ForecastEntry(BaseModel):
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
    pop: float  # probability of precipitation
    rainfall: Optional[float] = 0.0
    snow: Optional[float] = 0.0


class ForecastResponse(BaseModel):
    city: str
    country: str
    lat: float
    lon: float
    forecast: List[ForecastEntry]
    data_mode: DataMode
    source: str


class AirQuality(BaseModel):
    city: str
    country: str
    lat: float
    lon: float
    aqi: int
    aqi_category: str
    components: Dict[str, float]
    timestamp: datetime
    data_mode: DataMode


# --- Alert Models ---

class AlertThresholds(BaseModel):
    temperature_max: float = 40.0
    rainfall_max: float = 7.5
    humidity_max: int = 85
    wind_speed_max: float = 50.0
    aqi_max: int = 100


class Alert(BaseModel):
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


# --- City Models ---

class SavedCity(BaseModel):
    id: str
    city: str
    country: str
    lat: float
    lon: float
    added_at: datetime


class CitySearchResult(BaseModel):
    name: str
    country: str
    lat: float
    lon: float


# --- Simulation Models ---

class SimulationScenario(BaseModel):
    id: str
    name: str
    description: str
    cities: List[Dict[str, Any]]


class SimulationWeather(BaseModel):
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


# --- Report Models ---

class ReportRequest(BaseModel):
    city: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    format: str = "csv"  # csv or json


class ReportInfo(BaseModel):
    id: str
    city: str
    generated_at: datetime
    format: str
    filename: str
    record_count: int
    data_mode: DataMode


# --- Settings Models ---

class AppSettings(BaseModel):
    temperature_threshold: float = 40.0
    rainfall_threshold: float = 7.5
    humidity_threshold: int = 85
    wind_speed_threshold: float = 50.0
    aqi_threshold: int = 100
    temperature_unit: TemperatureUnit = TemperatureUnit.CELSIUS
    wind_speed_unit: WindSpeedUnit = WindSpeedUnit.KMH
    default_city: Optional[str] = None
    refresh_interval: int = 300  # seconds
    theme: str = "dark"
    notifications_enabled: bool = True
    data_mode: DataMode = DataMode.LIVE
