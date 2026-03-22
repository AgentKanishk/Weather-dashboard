import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ThemeToggle } from '@/components/theme-toggle'
import { DateRangePicker } from '@/components/weather/data-range-picker'
import { HistoricalCharts } from '@/components/weather/historical-charts'
import { useGeolocation } from '@/lib/hooks/useGeolocation'
import { useHistoricalWeather } from '@/lib/hooks/useHistoricalWeather'
import { getDateRange } from '@/lib/utils/weather'
import { ChevronLeft, MapPin, History as HistoryIcon, Cloud } from 'lucide-react'

export default function History() {
  const [isFahrenheit, setIsFahrenheit] = useState(false)
  const [historicalStartDate, setHistoricalStartDate] = useState(getDateRange(90).start)
  const [historicalEndDate, setHistoricalEndDate] = useState(getDateRange(90).end)

  const { location, loading: locationLoading } = useGeolocation()

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

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/">
              <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9 shrink-0">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <Cloud className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold leading-tight flex items-center gap-2">
                <HistoryIcon className="h-4 w-4 text-primary" />
                Historical Weather
              </h1>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        <DateRangePicker onRangeChange={handleHistoricalDateRange} />

        {historicalLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-2xl" />
            ))}
          </div>
        ) : historicalData ? (
          <HistoricalCharts data={historicalData} isFahrenheit={isFahrenheit} />
        ) : null}
      </div>
    </main>
  )
}
