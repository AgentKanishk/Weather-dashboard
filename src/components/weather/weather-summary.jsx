'use client'

import { memo } from 'react'
import { Card } from '@/components/ui/card'
import {
  formatTemperature,
  getWeatherIcon,
  getUVIndexLevel,
  formatTime,
  getWindDirection,
} from '@/lib/utils/weather'

function WeatherSummaryComponent({
  data,
  isFahrenheit = false,
}) {
  if (!data || !data.current || !data.daily) {
    return <Card className="p-6">Loading weather data...</Card>
  }

  const current = data.current
  const daily = data.daily
  const currentTemp = current.temperature_2m ?? '--'
  const maxTemp = daily.temperature_2m_max?.[0] ?? '--'
  const minTemp = daily.temperature_2m_min?.[0] ?? '--'
  const humidity = current.relative_humidity_2m ?? '--'
  const precipitation = current.precipitation ?? '--'
  const windSpeed = current.windspeed_10m ?? '--'
  const weatherCode = current.weather_code ?? 0
  const sunrise = daily.sunrise?.[0] ?? '--'
  const sunset = daily.sunset?.[0] ?? '--'

  return (
    <div className="space-y-4">

      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Current Weather</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold">
                {typeof currentTemp === 'number' ? formatTemperature(currentTemp, isFahrenheit) : currentTemp}
              </span>
              <span className="text-3xl">{getWeatherIcon(weatherCode)}</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4">
          Temperature Range
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Max</p>
            <p className="text-2xl font-semibold">
              {typeof maxTemp === 'number' ? formatTemperature(maxTemp, isFahrenheit) : maxTemp}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Min</p>
            <p className="text-2xl font-semibold">
              {typeof minTemp === 'number' ? formatTemperature(minTemp, isFahrenheit) : minTemp}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4">
          Humidity
        </h3>
        <p className="text-3xl font-bold">{humidity}%</p>
      </Card>

     
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4">
          Precipitation
        </h3>
        <p className="text-3xl font-bold">
          {typeof precipitation === 'number' ? precipitation.toFixed(2) : precipitation} mm
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4">
          Wind Speed
        </h3>
        <p className="text-3xl font-bold">
          {typeof windSpeed === 'number' ? windSpeed.toFixed(1) : windSpeed} km/h
        </p>
      </Card>

      <Card className="p-6">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4">
          Sunrise & Sunset
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Sunrise</p>
            <p className="text-lg font-semibold">
              {typeof sunrise === 'string' ? sunrise.split('T')[1] || sunrise : sunrise}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Sunset</p>
            <p className="text-lg font-semibold">
              {typeof sunset === 'string' ? sunset.split('T')[1] || sunset : sunset}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export const WeatherSummary = memo(WeatherSummaryComponent)
