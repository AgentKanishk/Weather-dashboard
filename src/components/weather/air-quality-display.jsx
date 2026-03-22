'use client'

import { memo } from 'react'
import { Card } from '@/components/ui/card'
import { getAQILevel } from '@/lib/utils/weather'

function AirQualityDisplayComponent({ data }) {
  if (!data || !data.hourly) {
    return <Card className="p-6">Loading air quality data...</Card>
  }

  const hourly = data.hourly
  const latestIndex = Math.max(0, (hourly.time?.length || 1) - 1)
  
  const currentAQI = hourly.european_aqi?.[latestIndex] ?? '--'
  const currentPM10 = hourly.pm10?.[latestIndex] ?? '--'
  const currentPM25 = hourly.pm2_5?.[latestIndex] ?? '--'
  const currentCO = hourly.carbon_monoxide?.[latestIndex] ?? '--'
  const currentNO2 = hourly.nitrogen_dioxide?.[latestIndex] ?? '--'
  const currentSO2 = hourly.sulphur_dioxide?.[latestIndex] ?? '--'

  const aqiLevel = typeof currentAQI === 'number' ? getAQILevel(currentAQI) : { level: 'N/A', color: 'text-gray-500' }

  return (
    <div className="space-y-4">

      <Card className="p-6">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4">
          Air Quality Index
        </h3>
        <div className="flex items-baseline gap-3">
          <p className={`text-4xl font-bold ${aqiLevel.color}`}>
            {Math.round(currentAQI)}
          </p>
          <p className={`text-lg font-medium ${aqiLevel.color}`}>
            {aqiLevel.level}
          </p>
        </div>
      </Card>

      {/* Particulate Matter Card */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4">
          Particulate Matter
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">PM10</p>
            <p className="text-2xl font-semibold">
              {typeof currentPM10 === 'number' ? currentPM10.toFixed(1) : currentPM10}
            </p>
            <p className="text-xs text-muted-foreground">μg/m³</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">PM2.5</p>
            <p className="text-2xl font-semibold">
              {typeof currentPM25 === 'number' ? currentPM25.toFixed(1) : currentPM25}
            </p>
            <p className="text-xs text-muted-foreground">μg/m³</p>
          </div>
        </div>
      </Card>

     
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4">
          Gases
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">CO</p>
            <p className="text-lg font-semibold">
              {typeof currentCO === 'number' ? (currentCO / 1000).toFixed(2) : currentCO}
            </p>
            <p className="text-xs text-muted-foreground">mg/m³</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">NO₂</p>
            <p className="text-lg font-semibold">
              {typeof currentNO2 === 'number' ? currentNO2.toFixed(1) : currentNO2}
            </p>
            <p className="text-xs text-muted-foreground">μg/m³</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">SO₂</p>
            <p className="text-lg font-semibold">
              {typeof currentSO2 === 'number' ? currentSO2.toFixed(1) : currentSO2}
            </p>
            <p className="text-xs text-muted-foreground">μg/m³</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export const AirQualityDisplay = memo(AirQualityDisplayComponent)
