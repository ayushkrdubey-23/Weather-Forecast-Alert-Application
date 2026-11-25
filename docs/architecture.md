# System Architecture

## Overview

The Weather Forecast & Alert Application follows a clean, layered architecture with clear separation between the frontend, backend, and external services.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER (Next.js 14)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │  Dashboard  │  │  Live Weather│ │  Forecast   │  │  Weather Map │  │
│  │  Alerts     │  │  Comparison  │  │  Reports    │  │  Settings    │  │
│  │  About      │  └─────────────┘  └─────────────┘  └─────────────┘   │
│  └─────────────┘                                                       │
│         Tailwind CSS | Recharts | React Leaflet | Lucide React         │
└─────────────────────────────────────────────────────────────────────────┘
                               │ HTTP/JSON (Axios)
                               │ CORS (restricted to localhost:3000)
┌─────────────────────────────────────────────────────────────────────────┐
│                         API LAYER (FastAPI)                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│  │  Weather    │  │  Cities     │  │  Alerts     │  │  Reports    │  │
│  │  Simulation │  └─────────────┘  └─────────────┘  └─────────────┘   │
│  └─────────────┘                                                       │
│  Health | Status | OpenAPI/Swagger at /docs                             │
└─────────────────────────────────────────────────────────────────────────┘
                               │ HTTP/JSON (Requests)
┌─────────────────────────────────────────────────────────────────────────┐
│                         SERVICE LAYER (Python)                           │
│  WeatherService  │  ForecastService  │  AlertService  │  ReportService  │
│  SimulationService                                                      │
└─────────────────────────────────────────────────────────────────────────┘
                               │ HTTP/JSON
┌─────────────────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICE (OpenWeatherMap API)                   │
│  Current Weather | 5-Day Forecast | Air Quality | Geocoding              │
└─────────────────────────────────────────────────────────────────────────┘
```

## Layer Descriptions

### Client Layer (Next.js Frontend)
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with dark/light mode support
- **State Management**: React hooks (useState, useEffect) with custom hooks
- **Data Fetching**: Axios with API base URL configuration
- **Charts**: Recharts for responsive data visualization
- **Maps**: Leaflet with React Leaflet for interactive maps
- **Icons**: Lucide React

### API Layer (FastAPI Backend)
- **Framework**: FastAPI with Pydantic v2
- **ASGI Server**: Uvicorn
- **Data Validation**: Pydantic schemas for all request/response models
- **CORS**: Configured to allow only the frontend origin
- **Documentation**: Automatic Swagger UI at `/docs`, ReDoc at `/redoc`

### Service Layer (Python Business Logic)
- **WeatherService**: OpenWeatherMap API integration, simulation data generation
- **AlertService**: Threshold-based alert generation, duplicate prevention, severity classification
- **ReportService**: CSV and JSON report generation, file management
- **SimulationService**: Predefined weather scenarios, simulated data for offline mode
- **ReportService**: Report generation and file management

### Data Flow

1. **Live Mode**: Frontend → FastAPI → OpenWeatherMap API → FastAPI → Frontend
2. **Simulation Mode**: Frontend → FastAPI → SimulationService → Frontend (no external API)
3. **Alert Generation**: Weather data → AlertService (threshold check) → Alerts stored in memory
4. **Report Generation**: Weather data → ReportService → CSV/JSON file → Download

## Security

- API keys stored in backend `.env` only (never in frontend)
- CORS restricted to `http://localhost:3000`
- Input validation via Pydantic schemas
- No sensitive data in API responses
- Environment-based configuration

## Data Persistence

- Saved cities: In-memory list (lightweight, no database)
- Alerts: In-memory lists with duplicate prevention
- Reports: Local filesystem (CSV/JSON in `outputs/reports/`)
- Settings: Browser localStorage + backend thresholds

## Deployment Options

- **Development**: `uvicorn app.main:app --reload` + `npm run dev`
- **Production**: Uvicorn with workers + Next.js build (`npm run build`)
- **Future**: Docker containerization, cloud hosting (AWS/Azure/GCP)
