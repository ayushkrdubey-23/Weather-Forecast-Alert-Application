from fastapi import APIRouter, HTTPException, Query, Body
from fastapi.responses import FileResponse
from typing import List, Dict, Any

from app.schemas.api import ReportRequest, ReportInfo, DataMode
from app.services.report_service import report_service

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("", response_model=List[ReportInfo])
async def get_reports():
    """Get list of all generated reports."""
    return report_service.get_reports()


@router.post("/generate", response_model=ReportInfo)
async def generate_report(request: ReportRequest = Body(...)):
    """Generate a CSV or JSON weather report for a city."""
    try:
        # Build mock weather data for the report
        weather_data = [
            {
                "city": request.city,
                "country": "Unknown",
                "date": __import__("datetime").datetime.utcnow().isoformat(),
                "weather_condition": "Unknown",
                "temperature": 0.0,
                "humidity": 0,
                "wind_speed": 0.0,
                "rainfall": 0.0,
                "aqi": None,
                "data_source": "API",
                "data_mode": DataMode.LIVE.value,
            }
        ]
        return report_service.generate_report(
            city=request.city,
            weather_data=weather_data,
            fmt=request.format,
            data_mode=DataMode.LIVE,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/download/csv")
async def download_csv(filename: str = Query(..., description="Report filename")):
    """Download a CSV report file."""
    filepath = report_service.get_report_path(filename)
    if not filepath:
        raise HTTPException(status_code=404, detail="Report file not found")
    return FileResponse(
        path=filepath,
        media_type="text/csv",
        filename=filename,
    )


@router.get("/download/json")
async def download_json(filename: str = Query(..., description="Report filename")):
    """Download a JSON report file."""
    filepath = report_service.get_report_path(filename)
    if not filepath:
        raise HTTPException(status_code=404, detail="Report file not found")
    return FileResponse(
        path=filepath,
        media_type="application/json",
        filename=filename,
    )
