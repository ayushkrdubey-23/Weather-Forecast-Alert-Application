from fastapi import APIRouter, HTTPException, Query, Body
from typing import List, Dict, Any, Optional

from app.schemas.api import CitySearchResult, SavedCity, SaveCityRequest
from app.services.weather_service import weather_service

# In-memory saved cities store
_saved_cities: List[SavedCity] = []
_saved_city_id_counter = 1

router = APIRouter(prefix="/cities", tags=["cities"])


@router.get("/search", response_model=List[CitySearchResult])
async def search_cities(q: str = Query(..., min_length=1, description="City name to search")):
    """Search for cities by name."""
    try:
        results = weather_service.search_cities(q)
        return [CitySearchResult(**r) for r in results]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/saved", response_model=List[SavedCity])
async def get_saved_cities():
    """Get list of saved cities."""
    return list(_saved_cities)


@router.post("/saved", response_model=SavedCity)
async def save_city(request: SaveCityRequest):
    """Save a city to the user's saved locations."""
    global _saved_city_id_counter
    # Check for duplicate
    for c in _saved_cities:
        if c.city.lower() == request.city.lower() and c.country.lower() == request.country.lower():
            raise HTTPException(status_code=400, detail="City already saved")

    saved_city = SavedCity(
        id=str(_saved_city_id_counter),
        city=request.city,
        country=request.country,
        lat=request.lat,
        lon=request.lon,
        added_at=__import__("datetime").datetime.utcnow(),
    )
    _saved_city_id_counter += 1
    _saved_cities.append(saved_city)
    return saved_city


@router.delete("/saved/{city_id}")
async def delete_saved_city(city_id: str):
    """Remove a saved city by ID."""
    global _saved_cities
    for i, c in enumerate(_saved_cities):
        if c.id == city_id:
            _saved_cities.pop(i)
            return {"message": "City removed successfully"}
    raise HTTPException(status_code=404, detail="Saved city not found")
