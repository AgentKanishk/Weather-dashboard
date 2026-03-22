import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

const WMO_CODES = {
  0: { description: 'Clear sky', icon: '☀️' },
  1: { description: 'Mainly clear', icon: '🌤️' },
  2: { description: 'Partly cloudy', icon: '⛅' },
  3: { description: 'Overcast', icon: '☁️' },
  45: { description: 'Foggy', icon: '🌫️' },
  48: { description: 'Depositing rime fog', icon: '🌫️' },
  51: { description: 'Light drizzle', icon: '🌧️' },
  53: { description: 'Moderate drizzle', icon: '🌧️' },
  55: { description: 'Dense drizzle', icon: '🌧️' },
  61: { description: 'Slight rain', icon: '🌧️' },
  63: { description: 'Moderate rain', icon: '🌧️' },
  65: { description: 'Heavy rain', icon: '⛈️' },
  71: { description: 'Slight snow', icon: '🌨️' },
  73: { description: 'Moderate snow', icon: '🌨️' },
  75: { description: 'Heavy snow', icon: '🌨️' },
  77: { description: 'Snow grains', icon: '🌨️' },
  80: { description: 'Slight rain showers', icon: '🌧️' },
  81: { description: 'Moderate rain showers', icon: '🌧️' },
  82: { description: 'Violent rain showers', icon: '⛈️' },
  85: { description: 'Slight snow showers', icon: '🌨️' },
  86: { description: 'Heavy snow showers', icon: '🌨️' },
  95: { description: 'Thunderstorm', icon: '⛈️' },
  96: { description: 'Thunderstorm with hail', icon: '⛈️' },
  99: { description: 'Thunderstorm with hail', icon: '⛈️' },
}

export function getWeatherDescription(code) {
  return WMO_CODES[code]?.description || 'Unknown'
}

export function getWeatherIcon(code) {
  return WMO_CODES[code]?.icon || '❓'
}

export function formatTemperature(temp, isFahrenheit = false) {
  if (temp === null || temp === undefined) return 'N/A'
  if (isFahrenheit) {
    const fahrenheit = (temp * 9) / 5 + 32
    return `${fahrenheit.toFixed(1)}°F`
  }
  return `${temp.toFixed(1)}°C`
}

export function formatTime(dateString) {
  return dayjs(dateString).format('HH:mm')
}

export function formatDate(dateString) {
  return dayjs(dateString).format('MMM DD, YYYY')
}

export function formatDateTime(dateString) {
  return dayjs(dateString).format('MMM DD, YYYY HH:mm')
}

export function getAQILevel(aqi) {
  if (aqi <= 50) return { level: 'Good', color: 'text-green-500' }
  if (aqi <= 100) return { level: 'Fair', color: 'text-yellow-500' }
  if (aqi <= 150) return { level: 'Moderate', color: 'text-orange-500' }
  if (aqi <= 200) return { level: 'Poor', color: 'text-red-500' }
  if (aqi <= 300) return { level: 'Very Poor', color: 'text-red-600' }
  return { level: 'Severe', color: 'text-red-800' }
}

export function getUVIndexLevel(uvIndex) {
  if (uvIndex < 3) return { level: 'Low', color: 'text-green-500' }
  if (uvIndex < 6) return { level: 'Moderate', color: 'text-yellow-500' }
  if (uvIndex < 8) return { level: 'High', color: 'text-orange-500' }
  if (uvIndex < 11) return { level: 'Very High', color: 'text-red-500' }
  return { level: 'Extreme', color: 'text-red-700' }
}

export function getWindDirection(degrees) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

export function formatISTTime(dateString) {
  return dayjs(dateString).tz('Asia/Kolkata').format('HH:mm')
}

export function getDateRange(days) {
  const end = dayjs().format('YYYY-MM-DD')
  const start = dayjs().subtract(days, 'day').format('YYYY-MM-DD')
  return { start, end }
}

export function formatChartData(data, keyX, keyY) {
  return data.map((item) => ({
    [keyX]: item[keyX],
    [keyY]: item[keyY],
  }))
}
