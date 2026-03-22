const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1'
const AIR_QUALITY_BASE_URL = 'https://air-quality-api.open-meteo.com/v1'
const ARCHIVE_BASE_URL = 'https://archive-api.open-meteo.com/v1'

export async function fetchCurrentWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m',
    daily: 'temperature_2m_max,temperature_2m_min,sunrise,sunset',
    timezone: 'auto',
  })

  const response = await fetch(`${WEATHER_BASE_URL}/forecast?${params}`)
  if (!response.ok) throw new Error('Failed to fetch current weather')
  return response.json()
}

export async function fetchHourlyWeather(latitude, longitude, date) {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    hourly: 'temperature_2m,relative_humidity_2m,precipitation,visibility,windspeed_10m',
    timezone: 'auto',
  })

  if (date) {
    params.append('start_date', date)
    params.append('end_date', date)
  }

  const response = await fetch(`${WEATHER_BASE_URL}/forecast?${params}`)
  if (!response.ok) throw new Error('Failed to fetch hourly weather')
  return response.json()
}

export async function fetchAirQuality(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    hourly: 'pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,european_aqi',
    timezone: 'auto',
  })

  const response = await fetch(`${AIR_QUALITY_BASE_URL}/air-quality?${params}`)
  if (!response.ok) throw new Error('Failed to fetch air quality data')
  return response.json()
}

export async function fetchHistoricalWeather(latitude, longitude, startDate, endDate) {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    start_date: startDate,
    end_date: endDate,
    daily: 'temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum,windspeed_10m_max,sunrise,sunset',
    timezone: 'auto',
  })

  const response = await fetch(`${ARCHIVE_BASE_URL}/archive?${params}`)
  if (!response.ok) throw new Error('Failed to fetch historical weather')
  return response.json()
}