import { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { HourlyCharts } from '@/components/weather/hourly-charts'
import { DateRangePicker } from '@/components/weather/data-range-picker'
import { HistoricalCharts } from '@/components/weather/historical-charts'
import { useGeolocation } from '@/lib/hooks/useGeolocation'
import { useCurrentWeather, useHourlyWeather } from '@/lib/hooks/useWeather'
import { useAirQuality } from '@/lib/hooks/useAirQuality'
import { useHistoricalWeather } from '@/lib/hooks/useHistoricalWeather'
import {
  getDateRange,
  formatTemperature,
  getWeatherDescription,
  getAQILevel,
} from '@/lib/utils/weather'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  AlertCircle,
  Droplets,
  Wind,
  CloudRain,
  Eye,
  Sunrise,
  Sunset,
  Activity,
  Thermometer,
  MapPin,
  Gauge,
  Flame,
  Factory,
  Sun,
  Cloud,
  CloudSnow,
  Zap,
  Clock,
  BarChart2,
  History,
} from 'lucide-react'

function getWeatherLucideIcon(code, className = 'h-16 w-16') {
  if (code === 0 || code === 1) return <Sun className={`${className} text-amber-400`} />
  if (code === 2 || code === 3) return <Cloud className={`${className} text-slate-400`} />
  if (code >= 51 && code <= 67) return <CloudRain className={`${className} text-blue-400`} />
  if (code >= 71 && code <= 77) return <CloudSnow className={`${className} text-sky-300`} />
  if (code >= 80 && code <= 82) return <CloudRain className={`${className} text-cyan-400`} />
  if (code >= 95) return <Zap className={`${className} text-yellow-400`} />
  return <Sun className={`${className} text-amber-400`} />
}

function getAQIBadgeClass(aqi) {
  if (aqi <= 50) return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
  if (aqi <= 100) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400'
  if (aqi <= 150) return 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400'
  if (aqi <= 200) return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
  return 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400'
}

function StatCard({ icon, label, value, unit, iconClass }) {
  return (
    <div className="stat-card p-5 flex flex-col gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconClass}`}>
        {icon}
      </div>
      <div>
        <p className="label-text mb-1">{label}</p>
        <p className="text-2xl font-bold tabular-nums">
          {value}
          {unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
        </p>
      </div>
    </div>
  )
}

const SECTIONS = [
  { id: 'current', label: 'Current', icon: Thermometer },
  { id: 'hourly', label: 'Hourly', icon: Clock },
  { id: 'historical', label: 'Historical', icon: History },
]

export default function Home() {
  const [isFahrenheit, setIsFahrenheit] = useState(false)
  const [historicalStartDate, setHistoricalStartDate] = useState(getDateRange(30).start)
  const [historicalEndDate, setHistoricalEndDate] = useState(getDateRange(30).end)
  const [activeSection, setActiveSection] = useState('current')

  const { location, loading: locationLoading, error: locationError } = useGeolocation()

  const { data: currentData, isLoading: currentLoading } = useCurrentWeather(
    location?.latitude || 0,
    location?.longitude || 0
  )

  const { data: hourlyData, isLoading: hourlyLoading } = useHourlyWeather(
    location?.latitude || 0,
    location?.longitude || 0
  )

  const { data: airQualityData, isLoading: airQualityLoading } = useAirQuality(
    location?.latitude || 0,
    location?.longitude || 0
  )

  const { data: historicalData, isLoading: historicalLoading } = useHistoricalWeather(
    location?.latitude || 0,
    location?.longitude || 0,
    historicalStartDate,
    historicalEndDate
  )

  const handleHistoricalDateRange = (startDate, endDate) => {
    setHistoricalStartDate(startDate)
    setHistoricalEndDate(endDate)
  }

  if (locationLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto animate-pulse">
            <MapPin className="h-7 w-7 text-primary" />
          </div>
          <Skeleton className="h-5 w-40 mx-auto" />
          <p className="text-sm text-muted-foreground">Detecting your location...</p>
        </div>
      </div>
    )
  }

  const current = currentData?.current
  const daily = currentData?.daily
  const aqHourly = airQualityData?.hourly
  const latestAQIdx = aqHourly ? Math.max(0, (aqHourly.time?.length || 1) - 1) : 0
  const currentAQI = aqHourly?.european_aqi?.[latestAQIdx]
  const aqiLevel = typeof currentAQI === 'number' ? getAQILevel(currentAQI) : null

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <Cloud className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold leading-tight">Weather Dashboard</h1>
              {location && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                  <MapPin className="h-3 w-3 shrink-0" />
                  {location.name}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 rounded-full border bg-muted/50 p-1">
              <button
                onClick={() => setIsFahrenheit(false)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  !isFahrenheit
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                °C
              </button>
              <button
                onClick={() => setIsFahrenheit(true)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  isFahrenheit
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                °F
              </button>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {locationError && (
          <Alert variant="default" className="mb-5 border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-700 dark:text-amber-400">
              Location permission denied — using Delhi, India as default.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-1 mb-6 bg-muted/50 rounded-xl p-1 w-fit">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeSection === id
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════
            CURRENT WEATHER SECTION
        ════════════════════════════════════════════════ */}
        {activeSection === 'current' && (
          <div className="space-y-5">
            {currentLoading ? (
              <Skeleton className="h-52 rounded-2xl" />
            ) : current ? (
              <Card className="overflow-hidden rounded-2xl border-0 shadow-lg">
                <div className="gradient-hero p-6 sm:p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-8 translate-x-8" />
                  <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-black/5 translate-y-8 -translate-x-8" />

                  <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                    <div className="space-y-2">
                      <p className="text-white/70 text-sm font-medium uppercase tracking-widest">
                        Current Weather
                      </p>
                      <div className="flex items-start gap-4">
                        {getWeatherLucideIcon(current.weather_code, 'h-14 w-14 drop-shadow-lg text-white/90')}
                        <div>
                          <p className="text-7xl font-black tracking-tighter leading-none">
                            {isFahrenheit
                              ? `${((current.temperature_2m * 9) / 5 + 32).toFixed(0)}°`
                              : `${current.temperature_2m?.toFixed(0)}°`}
                          </p>
                          <p className="text-white/80 font-medium mt-1">
                            {getWeatherDescription(current.weather_code)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/15 rounded-xl p-4 backdrop-blur-sm">
                        <p className="text-white/60 text-xs uppercase tracking-wide mb-1">High</p>
                        <p className="text-2xl font-bold">
                          {formatTemperature(daily?.temperature_2m_max?.[0], isFahrenheit)}
                        </p>
                      </div>
                      <div className="bg-white/15 rounded-xl p-4 backdrop-blur-sm">
                        <p className="text-white/60 text-xs uppercase tracking-wide mb-1">Low</p>
                        <p className="text-2xl font-bold">
                          {formatTemperature(daily?.temperature_2m_min?.[0], isFahrenheit)}
                        </p>
                      </div>
                      <div className="bg-white/15 rounded-xl p-4 backdrop-blur-sm col-span-2">
                        <p className="text-white/60 text-xs uppercase tracking-wide mb-1">Feels Like</p>
                        <p className="text-2xl font-bold">
                          {formatTemperature(
                            current.apparent_temperature ?? current.temperature_2m,
                            isFahrenheit
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ) : null}

            {currentLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
              </div>
            ) : current ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  icon={<Droplets className="h-5 w-5 text-blue-500" />}
                  label="Humidity"
                  value={`${current.relative_humidity_2m}%`}
                  iconClass="bg-blue-50 dark:bg-blue-950/50"
                />
                <StatCard
                  icon={<Wind className="h-5 w-5 text-violet-500" />}
                  label="Wind Speed"
                  value={current.wind_speed_10m?.toFixed(1)}
                  unit="km/h"
                  iconClass="bg-violet-50 dark:bg-violet-950/50"
                />
                <StatCard
                  icon={<CloudRain className="h-5 w-5 text-cyan-500" />}
                  label="Precipitation"
                  value={current.precipitation?.toFixed(1)}
                  unit="mm"
                  iconClass="bg-cyan-50 dark:bg-cyan-950/50"
                />
                <StatCard
                  icon={<Eye className="h-5 w-5 text-emerald-500" />}
                  label="Visibility"
                  value={((currentData?.hourly?.visibility?.[0] || 0) / 1000).toFixed(1)}
                  unit="km"
                  iconClass="bg-emerald-50 dark:bg-emerald-950/50"
                />
              </div>
            ) : null}

            {currentLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Skeleton className="h-24 rounded-xl" />
                <Skeleton className="h-24 rounded-xl" />
              </div>
            ) : daily ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="rounded-xl border shadow-sm">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center shrink-0">
                      <Sunrise className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                      <p className="label-text mb-0.5">Sunrise</p>
                      <p className="text-xl font-bold tabular-nums">
                        {daily.sunrise?.[0]?.split('T')[1] || '--:--'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-xl border shadow-sm">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-950/50 flex items-center justify-center shrink-0">
                      <Sunset className="h-6 w-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="label-text mb-0.5">Sunset</p>
                      <p className="text-xl font-bold tabular-nums">
                        {daily.sunset?.[0]?.split('T')[1] || '--:--'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : null}

            {airQualityLoading ? (
              <Skeleton className="h-56 rounded-xl" />
            ) : aqHourly ? (
              <Card className="rounded-2xl border shadow-sm overflow-hidden">
                <CardHeader className="pb-4 border-b bg-muted/30">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Activity className="h-5 w-5 text-primary" />
                    Air Quality Index
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6">
                    <div className="flex items-end gap-3">
                      <span className="text-6xl font-black tabular-nums leading-none">
                        {typeof currentAQI === 'number' ? Math.round(currentAQI) : '--'}
                      </span>
                      {aqiLevel && (
                        <span className={`text-sm font-semibold px-3 py-1 rounded-full mb-1 ${getAQIBadgeClass(currentAQI)}`}>
                          {aqiLevel.level}
                        </span>
                      )}
                    </div>
                    {typeof currentAQI === 'number' && (
                      <div className="flex-1 space-y-1.5 min-w-0">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Good</span><span>Severe</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${Math.min((currentAQI / 300) * 100, 100)}%`,
                              background: currentAQI <= 50
                                ? '#10b981'
                                : currentAQI <= 100
                                ? '#f59e0b'
                                : currentAQI <= 150
                                ? '#f97316'
                                : '#ef4444',
                            }}
                          />
                        </div>
                        <div className="flex gap-1">
                          {['Good', 'Fair', 'Moderate', 'Poor', 'Severe'].map((l, i) => (
                            <div key={l} className="flex-1 h-1 rounded-full" style={{
                              background: ['#10b981','#f59e0b','#f97316','#ef4444','#7c3aed'][i],
                              opacity: 0.35
                            }} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {[
                      { key: 'pm10', label: 'PM10', unit: 'μg/m³', icon: <Gauge className="h-4 w-4 text-yellow-500" />, bg: 'bg-yellow-50 dark:bg-yellow-950/40' },
                      { key: 'pm2_5', label: 'PM2.5', unit: 'μg/m³', icon: <Wind className="h-4 w-4 text-orange-500" />, bg: 'bg-orange-50 dark:bg-orange-950/40' },
                      { key: 'carbon_monoxide', label: 'CO', unit: 'mg/m³', icon: <AlertCircle className="h-4 w-4 text-red-500" />, bg: 'bg-red-50 dark:bg-red-950/40', divisor: 1000 },
                      { key: 'nitrogen_dioxide', label: 'NO₂', unit: 'μg/m³', icon: <Flame className="h-4 w-4 text-purple-500" />, bg: 'bg-purple-50 dark:bg-purple-950/40' },
                      { key: 'sulphur_dioxide', label: 'SO₂', unit: 'μg/m³', icon: <Factory className="h-4 w-4 text-slate-500" />, bg: 'bg-slate-50 dark:bg-slate-950/40' },
                    ].map(({ key, label, unit, icon, bg, divisor }) => {
                      const val = aqHourly?.[key]?.[latestAQIdx]
                      const display = typeof val === 'number'
                        ? (divisor ? (val / divisor).toFixed(2) : val.toFixed(1))
                        : '--'
                      return (
                        <div key={key} className={`rounded-xl p-3 ${bg}`}>
                          <div className="flex items-center gap-1.5 mb-2">{icon}<span className="text-xs font-semibold">{label}</span></div>
                          <p className="text-xl font-bold tabular-nums">{display}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{unit}</p>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            HOURLY SECTION
        ════════════════════════════════════════════════ */}
        {activeSection === 'hourly' && (
          <div className="space-y-4">
            {hourlyLoading || airQualityLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-72 rounded-xl" />)}
              </div>
            ) : hourlyData ? (
              <HourlyCharts
                data={hourlyData}
                airQualityData={airQualityData}
                isFahrenheit={isFahrenheit}
              />
            ) : null}
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            HISTORICAL SECTION
        ════════════════════════════════════════════════ */}
        {activeSection === 'historical' && (
          <div className="space-y-5">
            <DateRangePicker onRangeChange={handleHistoricalDateRange} />
            {historicalLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-72 rounded-xl" />)}
              </div>
            ) : historicalData ? (
              <HistoricalCharts data={historicalData} isFahrenheit={isFahrenheit} />
            ) : null}
          </div>
        )}
      </div>
    </main>
  )
}
