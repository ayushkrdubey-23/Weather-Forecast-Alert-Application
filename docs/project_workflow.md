# Project Workflow

## Development Phases

### Phase 1: Architecture & Folder Structure
- Created complete folder structure (backend, frontend, data, outputs, docs)
- Configuration files: requirements.txt, package.json, tsconfig.json, tailwind.config.js, next.config.js
- Environment templates: .env.example, .gitignore
- Pydantic settings config

### Phase 2: Backend Development
- Pydantic models and schemas for all data types
- WeatherService: OpenWeatherMap API integration with simulation fallback
- AlertService: Threshold-based alert generation with duplicate prevention
- ReportService: CSV/JSON report generation
- SimulationService: 6 predefined weather scenarios
- FastAPI routes: /api/weather/*, /api/cities/*, /api/alerts/*, /api/reports/*, /api/simulation/*
- CORS configuration, health/status endpoints

### Phase 3: Frontend Development
- TypeScript types for all API models
- Axios API service client
- Custom hooks: useWeather, useAlerts, useCities, useSimulation, useSettings, useTheme
- Reusable components: Sidebar, Navbar, WeatherCard, StatCard, AlertCard, charts, maps
- All 9 pages: Dashboard, Live Weather, Forecast, Weather Map, Alerts, City Comparison, Reports, Settings, About
- Dark/light theme support, responsive design

### Phase 4: Integration Testing
- Backend health check: 200 OK
- Current weather (simulation): 200 OK
- Forecast (simulation): 200 OK
- Simulation scenarios: 200 OK
- Alerts summary: 200 OK
- Reports: 200 OK
- Cities search: 200 OK
- Frontend dashboard: 200 OK

### Phase 5: Documentation & Final Review
- Architecture documentation
- API documentation
- Project workflow documentation
- Sample data files
- README with installation instructions

## Running the Application

### Backend Terminal
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
# Edit .env and add your OpenWeatherMap API key
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Frontend Terminal
```powershell
cd frontend
npm install
npm run dev
```

### Access URLs
- Backend API: http://127.0.0.1:8000
- Swagger UI: http://127.0.0.1:8000/docs
- Frontend: http://localhost:3000

## Testing Checklist

1. [ ] Backend health check
2. [ ] Current weather API (Live & Simulation)
3. [ ] Forecast API (Live & Simulation)
4. [ ] City search
5. [ ] Multiple-city selection
6. [ ] Weather map
7. [ ] Temperature alerts
8. [ ] Rain alerts
9. [ ] Humidity alerts
10. [ ] Wind alerts
11. [ ] Simulation mode
12. [ ] CSV report generation
13. [ ] JSON report generation
14. [ ] Settings persistence
15. [ ] Frontend/backend connectivity
16. [ ] Error handling (invalid city, API failure)
17. [ ] Responsive design

## Simulation Scenarios

| Scenario | Description | Conditions |
|----------|-------------|------------|
| normal | Typical weather | Mixed conditions |
| heavy_rain | Rainy conditions | High rainfall, humidity |
| heatwave | Hot weather | High temperatures |
| high_humidity | Humid conditions | High moisture |
| strong_wind | Windy conditions | High wind speeds |
| multi_alert | Multiple simultaneous alerts | Extreme conditions |

## File Structure

```
Weather-Forecast-Alert-Application/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── api/ (weather.py, alerts.py, cities.py, reports.py, simulation.py)
│   │   ├── services/ (weather_service.py, alert_service.py, report_service.py, simulation_service.py)
│   │   ├── schemas/api.py
│   │   └── utils/
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── app/ (dashboard, live-weather, forecast, weather-map, alerts, city-comparison, reports, settings, about)
│   ├── components/ (Sidebar, Navbar, WeatherCard, StatCard, AlertCard, Charts, WeatherMap)
│   ├── hooks/ (useWeather, useAlerts, useCities, useSimulation, useSettings, useTheme)
│   ├── services/api.ts
│   └── types/index.ts
├── docs/
│   ├── architecture.md
│   ├── api_documentation.md
│   └── project_workflow.md
├── data/
├── outputs/
│   ├── reports/
│   └── alerts/
├── .gitignore
├── LICENSE
└── README.md
```
