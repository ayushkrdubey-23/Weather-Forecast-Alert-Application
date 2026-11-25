from fastapi import APIRouter, HTTPException, Body
from typing import List, Dict, Any

from app.schemas.api import (
    SimulationScenario,
    SimulationWeatherResponse,
    ActivateSimulationRequest,
    DataMode,
)
from app.services.simulation_service import simulation_service

router = APIRouter(prefix="/simulation", tags=["simulation"])


@router.get("/scenarios", response_model=List[SimulationScenario])
async def get_simulation_scenarios():
    """Get list of available simulation scenarios."""
    return simulation_service.get_scenarios()


@router.post("/activate")
async def activate_simulation(request: ActivateSimulationRequest = Body(...)):
    """Activate a simulation scenario."""
    try:
        scenario = simulation_service.activate_scenario(request.scenario_id)
        return {
            "message": f"Simulation mode activated: {scenario.name}",
            "scenario": scenario,
            "data_mode": DataMode.SIMULATION,
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/weather", response_model=List[SimulationWeatherResponse])
async def get_simulation_weather():
    """Get simulated weather for all predefined cities."""
    return simulation_service.get_all_cities_weather()


@router.get("/weather/{city_name}", response_model=SimulationWeatherResponse)
async def get_simulation_weather_for_city(city_name: str):
    """Get simulated weather for a specific city."""
    try:
        return simulation_service.get_weather_for_city(city_name, "Unknown")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
