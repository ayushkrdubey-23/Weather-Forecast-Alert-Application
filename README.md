# Weather Forecast & Alert Application

A professional, full-stack weather analytics platform built with Python, FastAPI, Next.js, React, Tailwind CSS, and the OpenWeatherMap API. Features real-time weather monitoring, 5-day forecasts, automated alert generation, interactive maps, multi-city comparison, simulation mode, and downloadable CSV/JSON reports.

## Problem Statement

Weather information is critical for daily planning, travel, agriculture, and safety. Existing weather applications often lack multi-city monitoring, customizable alert thresholds, interactive maps, and downloadable reports in a single unified dashboard. This project delivers a complete, production-grade weather forecasting and alerting system.

## Objectives

- Fetch real-time weather and 5-day forecasts via OpenWeatherMap API
- Generate configurable weather alerts based on user-defined thresholds
- Support multi-city monitoring and comparison
- Display interactive weather maps with markers and overlays
- Visualize weather data with responsive charts
- Provide a simulation mode for offline demonstration
- Generate downloadable CSV and JSON weather reports
- Deliver a professional dark/light-themed responsive dashboard

## Features

- **Live Weather**: Current conditions for any city (temperature, humidity, wind, pressure, visibility, sunrise/sunset)
- **5-Day Forecast**: Hourly and daily forecasts with temperature, rain probability, humidity, wind
- **Weather Alerts**: Configurable thresholds with severity levels (Info, Advisory, Warning, Critical)
- **Interactive Map**: Leaflet + OpenStreetMap with weather markers and popups
- **City Comparison**: Side-by-side comparison of multiple cities with bar/line charts
- **Simulation Mode**: Offline demo with realistic sample data and multiple scenarios
- **Reports**: Generate and download CSV/JSON reports with filters
- **Settings**: Persist thresholds, units, theme, refresh interval, default city
- **Dark/Light Theme**: Full theme support
- **Responsive Dashboard**: Works on desktop, tablet, and mobile

## Technology Stack

### Backend
- Python 3.10+
- FastAPI
- Uvicorn
- Requests
- Pandas, NumPy
- Pydantic
- Python-dotenv

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Lucide React Icons
- Recharts
- Leaflet / React Leaflet
- Axios

### Weather Data
- OpenWeatherMap API (Current weather, 5-day forecast, Air pollution)

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Next.js Frontend (Port 3000)            │
│  Dashboard | Live Weather | Forecast | Map | Alerts          │
│  Comparison | Reports | Settings | About                      │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/JSON (CORS)
┌──────────────────────▼──────────────────────────────────────┐
│                    FastAPI Backend (Port 8000)               │
│  /api/weather/* | /api/cities/* | /api/alerts/*              │
│  /api/reports/* | /api/simulation/* | /api/health            │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/JSON
┌──────────────────────▼──────────────────────────────────────┐
│                OpenWeatherMap API                            │
│  Current Weather | 5-Day Forecast | Air Quality              │
└─────────────────────────────────────────────────────────────┘
```

Backend modules are separated into:
- `app/api/` — Route handlers (weather, cities, alerts, reports, simulation)
- `app/services/` — Business logic (weather_service, forecast_service, alert_service, report_service)
- `app/models/` — Domain models
- `app/schemas/` — Pydantic request/response schemas
- `app/config.py` — Pydantic settings from `.env`
- `app/main.py` — FastAPI application entry point

## Folder Structure

```
Weather-Forecast-Alert-Application/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── api/ (weather.py, alerts.py, cities.py, reports.py, simulation.py)
│   │   ├── services/ (weather_service.py, forecast_service.py, alert_service.py, report_service.py)
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── utils/
│   │   └── data/
│   ├── tests/
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── app/ (dashboard, live-weather, forecast, weather-map, alerts, city-comparison, reports, settings, about)
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── types/
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── next.config.js
├── data/
├── outputs/
│   ├── reports/
│   └── alerts/
├── docs/
├── .gitignore
├── README.md
└── LICENSE
```

## Installation Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- An OpenWeatherMap API key (free tier: https://openweathermap.org/api)

### Backend Setup (PowerShell)

```powershell
# 1. Navigate to backend
cd backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
.\venv\Scripts\Activate.ps1

# 4. Install dependencies
pip install -r requirements.txt

# 5. Copy environment template and configure
Copy-Item .env.example .env
# Edit .env and add your OpenWeatherMap API key

# 6. Start the server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Backend URL: `http://127.0.0.1:8000`  
Swagger UI: `http://127.0.0.1:8000/docs`

### Frontend Setup (PowerShell)

```powershell
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Frontend URL: `http://localhost:3000`

### API Key Configuration

1. Sign up at https://openweathermap.org/api
2. Obtain a free API key
3. Copy `backend/.env.example` to `backend/.env`
4. Set `OPENWEATHER_API_KEY=your_key_here` in `.env`
5. Never commit `.env` — it is listed in `.gitignore`

## Simulation Mode

Simulation mode works without an API key or internet connection. Generate realistic sample weather data for multiple cities with scenarios:

- Normal weather
- Heavy rainfall
- Heatwave
- High humidity
- Strong wind
- Multiple simultaneous alerts

Activate via:
```
GET  /api/simulation/scenarios
POST /api/simulation/activate
```

In the frontend, toggle the "Live / Simulation" switch in the top navigation bar.

## API Documentation

FastAPI provides automatic interactive documentation:

- **Swagger UI**: `http://127.0.0.1:8000/docs`
- **ReDoc**: `http://127.0.0.1:8000/redoc`

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Backend health check |
| GET | /api/status | API connection status |
| GET | /api/weather/current | Current weather for a city |
| GET | /api/weather/forecast | 5-day forecast |
| GET | /api/weather/air-quality | Air quality data |
| GET | /api/cities/search | Search cities |
| GET | /api/cities/saved | List saved cities |
| POST | /api/cities/saved | Save a city |
| DELETE | /api/cities/saved/{city_id} | Remove saved city |
| GET | /api/alerts | Active alerts |
| GET | /api/alerts/history | Alert history |
| POST | /api/alerts/check | Check alerts |
| GET | /api/alerts/settings | Alert threshold settings |
| PUT | /api/alerts/settings | Update alert thresholds |
| GET | /api/reports | List reports |
| POST | /api/reports/generate | Generate report |
| GET | /api/reports/download/csv | Download CSV report |
| GET | /api/reports/download/json | Download JSON report |
| GET | /api/simulation/scenarios | List simulation scenarios |
| POST | /api/simulation/activate | Activate simulation mode |
| GET | /api/simulation/weather | Get simulated weather |

## Screenshots

Screenshots will be added to the `images/` directory after the frontend is built:
- `images/dashboard.png` — Main dashboard
- `images/forecast.png` — Forecast page
- `images/weather_map.png` — Interactive map
- `images/alerts.png` — Alerts page

## Testing

Test cases cover:
1. Backend health check
2. Current weather API
3. Forecast API
4. City search
5. Multiple-city selection
6. Weather map
7. Temperature, rain, humidity, wind alerts
8. Simulation mode
9. CSV/JSON report generation
10. Settings persistence
11. Frontend/backend connectivity
12. Error handling (invalid city, API failure, missing data)
13. Responsive design

Run backend tests:
```powershell
cd backend
pytest tests/
```

## Limitations

- Requires an OpenWeatherMap API key for live mode (free tier has rate limits)
- Simulation data is generated, not real observations
- No user authentication (future improvement)
- Data stored in local files (CSV/JSON), not a database
- Email/SMS notifications not implemented (future improvement)

## Future Improvements

- User authentication and authorization
- PostgreSQL database for persistence
- Scheduled background weather monitoring
- Email and SMS alert delivery
- Additional weather providers
- Machine learning-based weather prediction
- Docker containerization
- Cloud deployment (AWS/Azure/GCP)

## Learning Outcomes

- REST API design with FastAPI
- Third-party API integration (OpenWeatherMap)
- Asynchronous data fetching and error handling
- Data processing with Pandas/NumPy
- Interactive data visualization with Recharts
- Interactive mapping with Leaflet
- Full-stack TypeScript/Next.js development
- Responsive UI design with Tailwind CSS
- Environment-based configuration and secret management
- CORS configuration and API security
- Simulation mode for offline development

## License

MIT License
