import random
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta

from app.config import settings
from app.schemas.api import (
    SimulationWeatherResponse,
    SimulationScenario,
    DataMode,
)

logger = logging.getLogger(__name__)

# Predefined simulation scenarios
SIMULATION_SCENARIOS: List[SimulationScenario] = [
    SimulationScenario(
        id="normal",
        name="Normal Weather",
        description="Typical weather conditions across multiple cities",
    ),
    SimulationScenario(
        id="heavy_rain",
        name="Heavy Rainfall",
        description="Rainy conditions with elevated rainfall and humidity",
    ),
    SimulationScenario(
        id="heatwave",
        name="Heatwave",
        description="Hot weather with high temperatures across cities",
    ),
    SimulationScenario(
        id="high_humidity",
        name="High Humidity",
        description="Humid conditions with elevated moisture levels",
    ),
    SimulationScenario(
        id="strong_wind",
        name="Strong Wind",
        description="Windy conditions with high wind speeds",
    ),
    SimulationScenario(
        id="multi_alert",
        name="Multiple Simultaneous Alerts",
        description="Extreme conditions triggering multiple alert types",
    ),
]

# City templates for simulation
SIMULATION_CITIES = [
    {"city": "New York", "country": "US", "lat": 40.7128, "lon": -74.0060},
    {"city": "London", "country": "GB", "lat": 51.5074, "lon": -0.1278},
    {"city": "Tokyo", "country": "JP", "lat": 35.6762, "lon": 139.6503},
    {"city": "Sydney", "country": "AU", "lat": -33.8688, "lon": 151.2093},
    {"city": "Dubai", "country": "AE", "lat": 25.2048, "lon": 55.2708},
    {"city": "Mumbai", "country": "IN", "lat": 19.0760, "lon": 72.8777},
]


class SimulationService:
    """Service for generating simulated weather data without an API key."""

    def __init__(self):
        self.active_scenario_id = "normal"

    def get_scenarios(self) -> List[SimulationScenario]:
        """Get list of available simulation scenarios."""
        return SIMULATION_SCENARIOS

    def activate_scenario(self, scenario_id: str) -> SimulationScenario:
        """Activate a simulation scenario."""
        for scenario in SIMULATION_SCENARIOS:
            if scenario.id == scenario_id:
                self.active_scenario_id = scenario_id
                return scenario
        raise ValueError(f"Scenario '{scenario_id}' not found")

    def get_current_scenario(self) -> SimulationScenario:
        """Get the currently active scenario."""
        for scenario in SIMULATION_SCENARIOS:
            if scenario.id == self.active_scenario_id:
                return scenario
        return SIMULATION_SCENARIOS[0]

    def get_weather_for_city(
        self, city_name: str, country: str
    ) -> SimulationWeatherResponse:
        """Generate simulated weather for a specific city."""
        city_template = None
        for c in SIMULATION_CITIES:
            if c["city"].lower() == city_name.lower():
                city_template = c
                break

        if city_template is None:
            city_template = {
                "city": city_name,
                "country": country,
                "lat": random.uniform(-90, 90),
                "lon": random.uniform(-180, 180),
            }

        scenario = self.get_current_scenario()
        return self._generate_city_weather(city_template, scenario)

    def get_all_cities_weather(self) -> List[SimulationWeatherResponse]:
        """Generate simulated weather for all predefined cities."""
        scenario = self.get_current_scenario()
        return [self._generate_city_weather(c, scenario) for c in SIMULATION_CITIES]

    def _generate_city_weather(
        self, city_template: Dict[str, Any], scenario: SimulationScenario
    ) -> SimulationWeatherResponse:
        """Generate weather data for a city based on the scenario."""
        city = city_template["city"]
        random.seed(hash(city + scenario.id) % 10000)

        # Base values per scenario
        scenario_modifiers = {
            "normal": {"temp": (15, 30), "humidity": (40, 70), "wind": (0, 15), "rain": (0, 2), "cloud": (0, 50)},
            "heavy_rain": {"temp": (10, 20), "humidity": (75, 95), "wind": (10, 30), "rain": (5, 25), "cloud": (70, 100)},
            "heatwave": {"temp": (35, 45), "humidity": (20, 50), "wind": (5, 20), "rain": (0, 1), "cloud": (0, 30)},
            "high_humidity": {"temp": (20, 30), "humidity": (80, 95), "wind": (0, 10), "rain": (0, 5), "cloud": (60, 90)},
            "strong_wind": {"temp": (10, 25), "humidity": (40, 70), "wind": (40, 70), "rain": (0, 3), "cloud": (30, 70)},
            "multi_alert": {"temp": (38, 45), "humidity": (85, 95), "wind": (50, 80), "rain": (10, 30), "cloud": (80, 100)},
        }

        mod = scenario_modifiers.get(scenario.id, scenario_modifiers["normal"])

        temp = round(random.uniform(*mod["temp"]), 1)
        humidity = random.randint(*mod["humidity"])
        wind_speed = round(random.uniform(*mod["wind"]), 1)
        rainfall = round(random.uniform(*mod["rain"]), 1)
        cloud_coverage = random.randint(*mod["cloud"])

        # Determine weather condition
        if rainfall > 10:
            condition = "Thunderstorm"
        elif rainfall > 2:
            condition = "Rain"
        elif cloud_coverage > 70:
            condition = "Clouds"
        elif wind_speed > 40:
            condition = "Squall"
        elif temp > 35:
            condition = "Clear"
        else:
            condition = "Clear"

        aqi = random.randint(1, 5)

        # Wind direction
        directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
        wind_deg = random.randint(0, 359)
        wind_dir = directions[round(wind_deg / 22.5) % 16]

        condition_map = {
            "Clear": "clear sky",
            "Clouds": "scattered clouds",
            "Rain": "light rain",
            "Thunderstorm": "thunderstorm",
            "Squall": "strong wind",
        }

        return SimulationWeatherResponse(
            city=city,
            country=city_template["country"],
            lat=city_template["lat"],
            lon=city_template["lon"],
            temperature=temp,
            feels_like=round(temp + random.uniform(-3, 3), 1),
            humidity=humidity,
            pressure=random.randint(990, 1030),
            wind_speed=wind_speed,
            wind_deg=wind_deg,
            rainfall=rainfall,
            cloud_coverage=cloud_coverage,
            weather_condition=condition,
            weather_description=condition_map.get(condition, condition.lower()),
            aqi=aqi,
            data_mode=DataMode.SIMULATION,
            source="Simulation",
        )


simulation_service = SimulationService()
