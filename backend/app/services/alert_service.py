import uuid
import logging
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta

from app.config import settings
from app.schemas.api import (
    AlertResponse,
    AlertHistoryEntry,
    AlertThresholds,
    AlertSeverity,
    DataMode,
)

logger = logging.getLogger(__name__)

# Default thresholds
DEFAULT_THRESHOLDS = AlertThresholds()

# In-memory alert store (lightweight persistence)
_active_alerts: List[AlertResponse] = []
_alert_history: List[AlertHistoryEntry] = []

# Duplicate prevention: track last alert time per (city, parameter)
_last_alert_time: Dict[str, datetime] = {}
DUPLICATE_PREVENTION_MINUTES = 30


class AlertService:
    """Service for weather alert generation and management."""

    def __init__(self):
        self.thresholds = DEFAULT_THRESHOLDS

    def check_alerts(
        self, city: str, country: str, lat: float, lon: float,
        temperature: float, feels_like: float, humidity: int, pressure: int,
        wind_speed: float, rainfall: float, cloud_coverage: int,
        weather_condition: str, aqi: Optional[int] = None,
        data_mode: DataMode = DataMode.LIVE,
        is_forecast: bool = False,
    ) -> List[AlertResponse]:
        """Evaluate weather data against thresholds and generate alerts."""
        new_alerts: List[AlertResponse] = []
        now = datetime.utcnow()

        checks = [
            ("temperature", temperature, self.thresholds.temperature_max, "°C",
             f"Temperature in {city} is {temperature}°C, exceeding the threshold of {self.thresholds.temperature_max}°C.",
             AlertSeverity.WARNING if temperature > self.thresholds.temperature_max else AlertSeverity.INFO),
            ("rainfall", rainfall, self.thresholds.rainfall_max, "mm/h",
             f"Heavy rainfall in {city}: {rainfall} mm/h, exceeding threshold of {self.thresholds.rainfall_max} mm/h.",
             AlertSeverity.WARNING if rainfall > self.thresholds.rainfall_max else AlertSeverity.INFO),
            ("humidity", humidity, self.thresholds.humidity_max, "%",
             f"High humidity in {city}: {humidity}%, exceeding threshold of {self.thresholds.humidity_max}%.",
             AlertSeverity.WARNING if humidity > self.thresholds.humidity_max else AlertSeverity.INFO),
            ("wind_speed", wind_speed, self.thresholds.wind_speed_max, "km/h",
             f"Strong wind in {city}: {wind_speed} km/h, exceeding threshold of {self.thresholds.wind_speed_max} km/h.",
             AlertSeverity.WARNING if wind_speed > self.thresholds.wind_speed_max else AlertSeverity.INFO),
        ]

        if aqi is not None:
            checks.append(
                ("aqi", aqi, self.thresholds.aqi_max, "",
                 f"Poor air quality in {city}: AQI {aqi}, exceeding threshold of {self.thresholds.aqi_max}.",
                 AlertSeverity.WARNING if aqi > self.thresholds.aqi_max else AlertSeverity.INFO),
            )

        for parameter, measured_value, threshold, unit, description, base_severity in checks:
            if measured_value > threshold:
                alert_key = f"{city}:{parameter}"
                last_time = _last_alert_time.get(alert_key)

                if last_time and (now - last_time) < timedelta(minutes=DUPLICATE_PREVENTION_MINUTES):
                    continue

                _last_alert_time[alert_key] = now

                severity = base_severity
                if measured_value > threshold * 1.5:
                    severity = AlertSeverity.CRITICAL
                elif measured_value > threshold * 1.25:
                    severity = AlertSeverity.WARNING

                alert = AlertResponse(
                    id=str(uuid.uuid4()),
                    city=city,
                    country=country,
                    parameter=parameter,
                    severity=severity,
                    title=self._get_alert_title(parameter, severity),
                    description=description,
                    measured_value=measured_value,
                    threshold=threshold,
                    unit=unit,
                    timestamp=now,
                    is_forecast=is_forecast,
                    dismissed=False,
                )
                new_alerts.append(alert)
                _active_alerts.append(alert)

                history_entry = AlertHistoryEntry(
                    id=alert.id,
                    city=city,
                    parameter=parameter,
                    severity=severity,
                    title=alert.title,
                    measured_value=measured_value,
                    threshold=threshold,
                    unit=unit,
                    timestamp=now,
                    is_forecast=is_forecast,
                    dismissed=False,
                )
                _alert_history.append(history_entry)

        return new_alerts

    def get_active_alerts(self) -> List[AlertResponse]:
        """Get all active (non-dismissed) alerts."""
        return [a for a in _active_alerts if not a.dismissed]

    def get_alert_history(self) -> List[AlertHistoryEntry]:
        """Get alert history."""
        return list(_alert_history)

    def dismiss_alert(self, alert_id: str) -> bool:
        """Dismiss an alert by ID."""
        for alert in _active_alerts:
            if alert.id == alert_id:
                alert.dismissed = True
                return True
        return False

    def get_thresholds(self) -> AlertThresholds:
        """Get current alert thresholds."""
        return self.thresholds

    def update_thresholds(self, new_thresholds: AlertThresholds) -> AlertThresholds:
        """Update alert thresholds."""
        self.thresholds = new_thresholds
        return self.thresholds

    def clear_alerts(self) -> int:
        """Clear all active alerts. Returns count cleared."""
        count = len([a for a in _active_alerts if not a.dismissed])
        _active_alerts.clear()
        return count

    def _get_alert_title(self, parameter: str, severity: AlertSeverity) -> str:
        titles = {
            "temperature": "High Temperature Alert",
            "rainfall": "Heavy Rain Alert",
            "humidity": "High Humidity Alert",
            "wind_speed": "Strong Wind Alert",
            "aqi": "Poor Air Quality Alert",
        }
        return titles.get(parameter, f"{parameter.title()} Alert")

    def get_alert_summary(self) -> Dict[str, int]:
        """Get summary counts of alerts by severity."""
        active = self.get_active_alerts()
        summary = {
            "total": len(active),
            "critical": len([a for a in active if a.severity == AlertSeverity.CRITICAL]),
            "warning": len([a for a in active if a.severity == AlertSeverity.WARNING]),
            "advisory": len([a for a in active if a.severity == AlertSeverity.ADVISORY]),
            "information": len([a for a in active if a.severity == AlertSeverity.INFO]),
        }
        return summary


alert_service = AlertService()
