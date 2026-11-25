import requests
import logging
from typing import Optional, Dict, Any, List
from datetime import datetime

from app.config import settings
from app.schemas.api import (
    CurrentWeatherResponse,
    ForecastResponse,
    ForecastEntryResponse,
    AirQualityResponse,
    AlertSeverity,
    DataMode,
)

logger = logging.getLogger(__name__)


class WeatherService:
    """Service for fetching weather data from OpenWeatherMap API."""

    def __init__(self):
        self.api_key = settings.OPENWEATHER_API_KEY
        self.base_url = settings.OPENWEATHER_BASE_URL
        self.session = requests.Session()
        self.session.timeout = 10

    def _build_icon_url(self, icon_code: str) -> str:
        return f"https://openweathermap.org/img/wn/{icon_code}@2x.png"

    def _get_wind_direction(self, deg: Optional[int]) -> Optional[str]:
        if deg is None:
            return None
        directions = [
            "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
            "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW",
        ]
        index = round(deg / 22.5) % 16
        return directions[index]

    def _get_aqi_category(self, aqi: int) -> str:
        categories = {
            1: "Good",
            2: "Fair",
            3: "Moderate",
            4: "Poor",
            5: "Very Poor",
        }
        return categories.get(aqi, "Unknown")

    def get_current_weather(
        self, city: str, country: Optional[str] = None, data_mode: DataMode = DataMode.LIVE
    ) -> CurrentWeatherResponse:
        """Fetch current weather for a city."""
        query = f"{city},{country}" if country else city

        if data_mode == DataMode.SIMULATION or not self.api_key:
            return self._get_simulated_current_weather(city, country or "")

        try:
            params = {
                "q": query,
                "appid": self.api_key,
                "units": "metric",
            }
            response = self.session.get(f"{self.base_url}/weather", params=params)
            response.raise_for_status()
            data = response.json()

            coord = data.get("coord", {})
            main = data.get("main", {})
            wind = data.get("wind", {})
            weather_list = data.get("weather", [{}])
            weather = weather_list[0] if weather_list else {}
            sys = data.get("sys", {})

            return CurrentWeatherResponse(
                city=data.get("name", city),
                country=sys.get("country", country or ""),
                lat=coord.get("lat", 0.0),
                lon=coord.get("lon", 0.0),
                temperature=main.get("temp", 0.0),
                feels_like=main.get("feels_like", 0.0),
                temp_min=main.get("temp_min", 0.0),
                temp_max=main.get("temp_max", 0.0),
                humidity=main.get("humidity", 0),
                pressure=main.get("pressure", 0),
                wind_speed=wind.get("speed", 0.0),
                wind_deg=wind.get("deg"),
                wind_dir=self._get_wind_direction(wind.get("deg")),
                visibility=data.get("visibility"),
                cloud_coverage=data.get("clouds", {}).get("all", 0),
                weather_condition=weather.get("main", "Unknown"),
                weather_description=weather.get("description", ""),
                weather_icon=weather.get("icon", "01d"),
                sunrise=sys.get("sunrise"),
                sunset=sys.get("sunset"),
                rainfall=data.get("rain", {}).get("1h", 0.0),
                timestamp=datetime.utcnow(),
                data_mode=DataMode.LIVE,
                source="OpenWeatherMap API",
            )
        except requests.exceptions.HTTPError as e:
            if e.response is not None and e.response.status_code == 401:
                raise ValueError("Invalid OpenWeatherMap API key")
            if e.response is not None and e.response.status_code == 404:
                raise ValueError(f"City '{city}' not found")
            if e.response is not None and e.response.status_code == 429:
                raise ValueError("OpenWeatherMap API rate limit exceeded")
            logger.error(f"HTTP error fetching weather for {city}: {e}")
            raise ValueError(f"Failed to fetch weather data: {str(e)}")
        except requests.exceptions.RequestException as e:
            logger.error(f"Network error fetching weather for {city}: {e}")
            raise ValueError(f"Network error: Unable to reach weather service")
        except Exception as e:
            logger.error(f"Unexpected error fetching weather for {city}: {e}")
            raise ValueError(f"Unexpected error: {str(e)}")

    def get_forecast(
        self, city: str, country: Optional[str] = None, data_mode: DataMode = DataMode.LIVE
    ) -> ForecastResponse:
        """Fetch 5-day forecast with 3-hour intervals."""
        query = f"{city},{country}" if country else city

        if data_mode == DataMode.SIMULATION or not self.api_key:
            return self._get_simulated_forecast(city, country or "")

        try:
            params = {
                "q": query,
                "appid": self.api_key,
                "units": "metric",
            }
            response = self.session.get(f"{self.base_url}/forecast", params=params)
            response.raise_for_status()
            data = response.json()

            city_info = data.get("city", {})
            forecast_list = data.get("list", [])

            entries = []
            for item in forecast_list:
                main = item.get("main", {})
                wind = item.get("wind", {})
                weather_list = item.get("weather", [{}])
                weather = weather_list[0] if weather_list else {}
                entries.append(
                    ForecastEntryResponse(
                        dt=item.get("dt", 0),
                        dt_txt=item.get("dt_txt", ""),
                        temperature=main.get("temp", 0.0),
                        feels_like=main.get("feels_like", 0.0),
                        temp_min=main.get("temp_min", 0.0),
                        temp_max=main.get("temp_max", 0.0),
                        humidity=main.get("humidity", 0),
                        pressure=main.get("pressure", 0),
                        wind_speed=wind.get("speed", 0.0),
                        wind_deg=wind.get("deg"),
                        cloud_coverage=item.get("clouds", {}).get("all", 0),
                        weather_condition=weather.get("main", "Unknown"),
                        weather_description=weather.get("description", ""),
                        weather_icon=weather.get("icon", "01d"),
                        pop=item.get("pop", 0.0),
                        rainfall=item.get("rain", {}).get("3h", 0.0),
                        snow=item.get("snow", {}).get("3h", 0.0),
                    )
                )

            return ForecastResponse(
                city=city_info.get("name", city),
                country=city_info.get("country", country or ""),
                lat=city_info.get("coord", {}).get("lat", 0.0),
                lon=city_info.get("coord", {}).get("lon", 0.0),
                forecast=entries,
                data_mode=DataMode.LIVE,
                source="OpenWeatherMap API",
            )
        except requests.exceptions.HTTPError as e:
            if e.response is not None and e.response.status_code == 401:
                raise ValueError("Invalid OpenWeatherMap API key")
            if e.response is not None and e.response.status_code == 404:
                raise ValueError(f"City '{city}' not found")
            if e.response is not None and e.response.status_code == 429:
                raise ValueError("OpenWeatherMap API rate limit exceeded")
            logger.error(f"HTTP error fetching forecast for {city}: {e}")
            raise ValueError(f"Failed to fetch forecast data: {str(e)}")
        except requests.exceptions.RequestException as e:
            logger.error(f"Network error fetching forecast for {city}: {e}")
            raise ValueError(f"Network error: Unable to reach weather service")
        except Exception as e:
            logger.error(f"Unexpected error fetching forecast for {city}: {e}")
            raise ValueError(f"Unexpected error: {str(e)}")

    def get_air_quality(
        self, lat: float, lon: float, city: str, country: str,
        data_mode: DataMode = DataMode.LIVE
    ) -> AirQualityResponse:
        """Fetch air pollution/AQI data."""
        if data_mode == DataMode.SIMULATION or not self.api_key:
            return AirQualityResponse(
                city=city,
                country=country,
                lat=lat,
                lon=lon,
                aqi=3,
                aqi_category="Moderate",
                components={"co": 200.0, "no": 10.0, "no2": 20.0, "o3": 60.0, "so2": 5.0, "pm2_5": 12.0, "pm10": 20.0, "nh3": 5.0},
                timestamp=datetime.utcnow(),
                data_mode=DataMode.SIMULATION,
            )

        try:
            params = {
                "lat": lat,
                "lon": lon,
                "appid": self.api_key,
            }
            response = self.session.get(f"{self.base_url}/air_pollution", params=params)
            response.raise_for_status()
            data = response.json()

            list_data = data.get("list", [{}])
            main = list_data[0] if list_data else {}
            components = main.get("components", {})

            return AirQualityResponse(
                city=city,
                country=country,
                lat=lat,
                lon=lon,
                aqi=main.get("aqi", 3),
                aqi_category=self._get_aqi_category(main.get("aqi", 3)),
                components=components,
                timestamp=datetime.utcnow(),
                data_mode=DataMode.LIVE,
            )
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching air quality: {e}")
            raise ValueError(f"Failed to fetch air quality data: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error fetching air quality: {e}")
            raise ValueError(f"Unexpected error: {str(e)}")

    def search_cities(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Search for cities by name using OpenWeatherMap geocoding."""
        if not self.api_key:
            return []

        try:
            params = {
                "q": query,
                "limit": limit,
                "appid": self.api_key,
            }
            response = self.session.get("http://api.openweathermap.org/geo/1.0/direct", params=params)
            response.raise_for_status()
            data = response.json()

            results = []
            for item in data:
                results.append({
                    "name": item.get("name", ""),
                    "country": item.get("country", ""),
                    "lat": item.get("lat", 0.0),
                    "lon": item.get("lon", 0.0),
                })
            return results
        except requests.exceptions.RequestException as e:
            logger.error(f"Error searching cities: {e}")
            return []
        except Exception as e:
            logger.error(f"Unexpected error searching cities: {e}")
            return []

    def _get_simulated_current_weather(
        self, city: str, country: str
    ) -> CurrentWeatherResponse:
        """Generate simulated current weather data."""
        import random
        random.seed(hash(city) % 10000)

        conditions = ["Clear", "Clouds", "Rain", "Drizzle", "Thunderstorm", "Snow", "Mist"]
        condition = random.choice(conditions)

        temp_base = random.uniform(15, 30)
        if condition == "Clear":
            temp_base += 5
        elif condition == "Rain":
            temp_base -= 5
        elif condition == "Thunderstorm":
            temp_base -= 3

        return CurrentWeatherResponse(
            city=city,
            country=country,
            lat=random.uniform(-90, 90),
            lon=random.uniform(-180, 180),
            temperature=round(temp_base, 1),
            feels_like=round(temp_base + random.uniform(-3, 3), 1),
            temp_min=round(temp_base - 5, 1),
            temp_max=round(temp_base + 5, 1),
            humidity=random.randint(30, 90),
            pressure=random.randint(990, 1030),
            wind_speed=round(random.uniform(0, 30), 1),
            wind_deg=random.randint(0, 359),
            wind_dir=self._get_wind_direction(random.randint(0, 359)),
            visibility=random.randint(5000, 10000),
            cloud_coverage=random.randint(0, 100),
            weather_condition=condition,
            weather_description=condition.lower(),
            weather_icon="01d",
            sunrise=None,
            sunset=None,
            rainfall=round(random.uniform(0, 10), 1) if condition in ("Rain", "Thunderstorm", "Drizzle") else 0.0,
            aqi=random.randint(1, 5),
            aqi_category=self._get_aqi_category(random.randint(1, 5)),
            timestamp=datetime.utcnow(),
            data_mode=DataMode.SIMULATION,
            source="Simulation",
        )


    def _get_simulated_forecast(
        self, city: str, country: str
    ) -> ForecastResponse:
        """Generate simulated forecast data."""
        import random
        random.seed(hash(city + "forecast") % 10000)

        from datetime import timedelta
        entries = []
        base_temp = random.uniform(15, 30)

        for i in range(40):  # 5 days * 8 intervals (3-hourly)
            dt_txt = (datetime.utcnow() + timedelta(hours=i * 3)).strftime("%Y-%m-%d %H:%M:%S")
            temp_var = random.uniform(-5, 5)
            entries.append(
                ForecastEntryResponse(
                    dt=int(datetime.utcnow().timestamp()) + i * 10800,
                    dt_txt=dt_txt,
                    temperature=round(base_temp + temp_var, 1),
                    feels_like=round(base_temp + temp_var + random.uniform(-3, 3), 1),
                    temp_min=round(base_temp + temp_var - 3, 1),
                    temp_max=round(base_temp + temp_var + 3, 1),
                    humidity=random.randint(30, 90),
                    pressure=random.randint(990, 1030),
                    wind_speed=round(random.uniform(0, 30), 1),
                    wind_deg=random.randint(0, 359),
                    cloud_coverage=random.randint(0, 100),
                    weather_condition=random.choice(["Clear", "Clouds", "Rain"]),
                    weather_description="simulated",
                    weather_icon="01d",
                    pop=round(random.uniform(0, 1), 2),
                    rainfall=round(random.uniform(0, 5), 1),
                    snow=0.0,
                )
            )

        return ForecastResponse(
            city=city,
            country=country,
            lat=random.uniform(-90, 90),
            lon=random.uniform(-180, 180),
            forecast=entries,
            data_mode=DataMode.SIMULATION,
            source="Simulation",
        )


weather_service = WeatherService()
