from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.schemas.api import HealthResponse, StatusResponse, DataMode
from app.api import weather, alerts, cities, reports, simulation
from app.services.alert_service import alert_service

app = FastAPI(
    title="Weather Forecast & Alert Application",
    description="A professional weather analytics platform with real-time data, forecasts, alerts, and reports.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware - restrict to frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include API routers with /api prefix
app.include_router(weather.router, prefix="/api")
app.include_router(alerts.router, prefix="/api")
app.include_router(cities.router, prefix="/api")
app.include_router(reports.router, prefix="/api")
app.include_router(simulation.router, prefix="/api")


@app.get("/api/health", response_model=HealthResponse, tags=["general"])
async def health():
    """Backend health check endpoint."""
    return HealthResponse(status="healthy", service="weather-backend", version="1.0.0")


@app.get("/api/status", response_model=StatusResponse, tags=["general"])
async def status():
    """Get API connection and configuration status."""
    return StatusResponse(
        api_connected=bool(settings.OPENWEATHER_API_KEY),
        data_mode=DataMode.LIVE,
        openweather_configured=bool(settings.OPENWEATHER_API_KEY),
        timestamp=__import__("datetime").datetime.utcnow(),
    )


@app.get("/api/alerts/summary", tags=["alerts"])
async def alert_summary():
    """Get alert summary counts."""
    return alert_service.get_alert_summary()


@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(status_code=404, content={"detail": "Not found"})


@app.exception_handler(500)
async def server_error_handler(request, exc):
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})
