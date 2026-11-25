# API Documentation

The Weather Forecast & Alert Application provides a RESTful API built with FastAPI. Interactive documentation is available at:

- **Swagger UI**: `http://127.0.0.1:8000/docs`
- **ReDoc**: `http://127.0.0.1:8000/redoc`

## Base URL

```
http://127.0.0.1:8000
```

## General Endpoints

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "weather-backend",
  "version": "1.0.0"
}
```

### GET /api/status
Get API connection and configuration status.

**Response:**
```json
{
  "api_connected": true,
  "data_mode": "Live",
  "openweather_configured": true,
  "timestamp": "2026-11-25T09:14:28.518590"
}
```

## Weather Endpoints

### GET /api/weather/current
Get current weather for a city.

**Query Parameters:**
- `city` (required): City name
- `country` (optional): Country code
- `mode` (optional): `Live` or `Simulation`

**Response:**
```json
{
  "city": "London",
  "country": "GB",
  "lat": 51.5074,
  "lon": -0.1278,
  "temperature": 18.5,
  "feels_like": 17.2,
  "temp_min": 16.0,
  "temp_max": 21.0,
  "humidity": 65,
  "pressure": 1015,
  "wind_speed": 12.5,
  "wind_deg": 240,
  "wind_dir": "WSW",
  "visibility": 10000,
  "cloud_coverage": 40,
  "weather_condition": "Clouds",
  "weather_description": "scattered clouds",
  "weather_icon": "03d",
  "sunrise": 1732512000,
  "sunset": 1732552000,
  "rainfall": 0.0,
  "aqi": 3,
  "aqi_category": "Moderate",
  "timestamp": "2026-11-25T09:15:12.626340",
  "data_mode": "Live",
  "source": "OpenWeatherMap API"
}
```

### GET /api/weather/forecast
Get 5-day forecast with 3-hour intervals.

**Query Parameters:**
- `city` (required): City name
- `country` (optional): Country code
- `mode` (optional): `Live` or `Simulation`

### GET /api/weather/air-quality
Get air pollution/AQI data.

**Query Parameters:**
- `lat` (required): Latitude
- `lon` (required): Longitude
- `city` (required): City name
- `country` (required): Country code
- `mode` (optional): `Live` or `Simulation`

## Cities Endpoints

### GET /api/cities/search
Search for cities by name.

**Query Parameters:**
- `q` (required): City name to search

### GET /api/cities/saved
Get list of saved cities.

### POST /api/cities/saved
Save a city to user's saved locations.

**Request Body:**
```json
{
  "city": "London",
  "country": "GB",
  "lat": 51.5074,
  "lon": -0.1278
}
```

### DELETE /api/cities/saved/{city_id}
Remove a saved city by ID.

## Alerts Endpoints

### GET /api/alerts
Get all active (non-dismissed) alerts.

### GET /api/alerts/history
Get alert history.

### GET /api/alerts/summary
Get alert summary counts by severity.

**Response:**
```json
{
  "total": 5,
  "critical": 1,
  "warning": 2,
  "advisory": 1,
  "information": 1
}
```

### POST /api/alerts/check
Check weather data against thresholds and generate alerts.

**Request Body:**
```json
{
  "city": "London",
  "country": "GB",
  "lat": 51.5,
  "lon": -0.1,
  "temperature": 45.0,
  "feels_like": 47.0,
  "humidity": 90,
  "pressure": 1010,
  "wind_speed": 60.0,
  "rainfall": 10.0,
  "cloud_coverage": 90,
  "weather_condition": "Storm",
  "aqi": 150,
  "data_mode": "Simulation"
}
```

### GET /api/alerts/settings
Get current alert threshold settings.

### PUT /api/alerts/settings
Update alert threshold settings.

**Request Body:**
```json
{
  "temperature_max": 40.0,
  "rainfall_max": 7.5,
  "humidity_max": 85,
  "wind_speed_max": 50.0,
  "aqi_max": 100
}
```

## Simulation Endpoints

### GET /api/simulation/scenarios
Get list of available simulation scenarios.

**Response:**
```json
[
  {"id": "normal", "name": "Normal Weather", "description": "Typical weather conditions"},
  {"id": "heavy_rain", "name": "Heavy Rainfall", "description": "Rainy conditions"},
  {"id": "heatwave", "name": "Heatwave", "description": "Hot weather conditions"},
  {"id": "high_humidity", "name": "High Humidity", "description": "Humid conditions"},
  {"id": "strong_wind", "name": "Strong Wind", "description": "Windy conditions"},
  {"id": "multi_alert", "name": "Multiple Simultaneous Alerts", "description": "Extreme conditions"}
]
```

### POST /api/simulation/activate
Activate a simulation scenario.

**Request Body:**
```json
{
  "scenario_id": "heatwave"
}
```

### GET /api/simulation/weather
Get simulated weather for all predefined cities.

### GET /api/simulation/weather/{city_name}
Get simulated weather for a specific city.

## Reports Endpoints

### GET /api/reports
Get list of all generated reports.

### POST /api/reports/generate
Generate a CSV or JSON weather report.

**Request Body:**
```json
{
  "city": "London",
  "format": "csv"
}
```

### GET /api/reports/download/csv
Download a CSV report file.

**Query Parameters:**
- `filename` (required): Report filename

### GET /api/reports/download/json
Download a JSON report file.

**Query Parameters:**
- `filename` (required): Report filename

## Default Alert Thresholds

| Parameter | Threshold | Alert |
|-----------|-----------|-------|
| Temperature | Above 40°C | High Temperature |
| Rainfall | Above 7.5 mm/h | Heavy Rain |
| Humidity | Above 85% | High Humidity |
| Wind Speed | Above 50 km/h | Strong Wind |
| AQI | Above 100 | Poor Air Quality |

## Error Responses

All endpoints return standard HTTP status codes with error details in the response body:

```json
{
  "detail": "Error message description"
}
```

Common errors:
- `400`: Bad request (invalid city, invalid parameters)
- `401`: Unauthorized (invalid API key)
- `404`: Not found (city not found, resource not found)
- `429`: Too many requests (API rate limit exceeded)
- `500`: Internal server error
