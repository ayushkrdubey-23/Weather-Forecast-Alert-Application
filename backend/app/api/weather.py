from fastapi import APIRouter, HTTPException, Query, Depends
from typing import Optional

from app.config import settings
from app.schemas.api import (
    CurrentWeatherResponse,
    ForecastResponse,
    AirQualityResponse,
    DataMode,
)
from app.services.weather_service import weather_service

router = APIRouter(prefix="/weather", tags=["weather"])


@router.get("/current", response_model=CurrentWeatherResponse)
async def get_current_weather(
    city: str = Query(..., min_length=1, description="City name"),
    country: Optional[str] = Query(None, description="Country code"),
    mode: Optional[DataMode] = Query(None, description="Data mode: Live or Simulation"),
):
    """Get current weather for a city."""
    data_mode = mode or DataMode.LIVE
    try:
        return weather_service.get_current_weather(city, country, data_mode)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/forecast", response_model=ForecastResponse)
async def get_forecast(
    city: str = Query(..., min_length=1, description="City name"),
    country: Optional[str] = Query(None, description="Country code"),
    mode: Optional[DataMode] = Query(None, description="Data mode: Live or Simulation"),
):
    """Get 5-day forecast with 3-hour intervals for a city."""
    data_mode = mode or DataMode.LIVE
    try:
        return weather_service.get_forecast(city, country, data_mode)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/air-quality", response_model=AirQualityResponse)
async def get_air_quality(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude"),
    city: str = Query(..., min_length=1, description="City name"),
    country: str = Query(..., description="Country code"),
    mode: Optional[DataMode] = Query(None, description="Data mode: Live or Simulation"),
):
    """Get air pollution/AQI data for a location."""
    data_mode = mode or DataMode.LIVE
    try:
        return weather_service.get_air_quality(lat, lon, city, country, data_mode)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
