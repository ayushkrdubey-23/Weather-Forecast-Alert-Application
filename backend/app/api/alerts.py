from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List, Dict

from app.config import settings
from app.schemas.api import (
    AlertResponse,
    AlertHistoryEntry,
    AlertThresholds,
    AlertCheckRequest,
    DataMode,
    AlertSeverity,
)
from app.services.alert_service import alert_service

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.get("", response_model=List[AlertResponse])
async def get_active_alerts():
    """Get all active (non-dismissed) alerts."""
    return alert_service.get_active_alerts()


@router.get("/history", response_model=List[AlertHistoryEntry])
async def get_alert_history():
    """Get alert history."""
    return alert_service.get_alert_history()


@router.post("/check", response_model=List[AlertResponse])
async def check_alerts(request: AlertCheckRequest):
    """Check weather data against thresholds and generate alerts."""
    try:
        return alert_service.check_alerts(
            city=request.city,
            country=request.country,
            lat=request.lat,
            lon=request.lon,
            temperature=request.temperature,
            feels_like=request.feels_like,
            humidity=request.humidity,
            pressure=request.pressure,
            wind_speed=request.wind_speed,
            rainfall=request.rainfall,
            cloud_coverage=request.cloud_coverage,
            weather_condition=request.weather_condition,
            aqi=request.aqi,
            data_mode=request.data_mode,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/settings", response_model=AlertThresholds)
async def get_alert_settings():
    """Get current alert threshold settings."""
    return alert_service.get_thresholds()


@router.put("/settings", response_model=AlertThresholds)
async def update_alert_settings(thresholds: AlertThresholds):
    """Update alert threshold settings."""
    try:
        return alert_service.update_thresholds(thresholds)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/summary", response_model=Dict[str, int])
async def get_alert_summary():
    """Get summary counts of alerts by severity."""
    return alert_service.get_alert_summary()
