import { useState, useMemo, memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { formatTime } from '@/lib/utils/weather'
import {
  ChevronLeft,
  ChevronRight,
  Thermometer,
  Droplets,
  CloudRain,
  Wind,
  Wind as WindIcon,
} from 'lucide-react'

const HOURS_PER_VIEW = 12

const chartColors = {
  temp: '#6366f1',
  humidity: '#06b6d4',
  precipitation: '#3b82f6',
  wind: '#8b5cf6',
  pm10: '#f59e0b',
  pm25: '#ef4444',
}

function CustomTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border bg-card/95 backdrop-blur-sm shadow-xl px-3 py-2 text-sm">
      <p className="font-semibold text-foreground mb-1.5">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-muted-foreground">{entry.name ?? entry.dataKey}:</span>
          <span className="font-medium">{formatter ? formatter(entry.value, entry.dataKey) : entry.value}</span>
        </div>
      ))}
    </div>
  )
}

const axisStyle = { fontSize: 11, fill: 'var(--color-muted-foreground)' }
const gridStyle = { stroke: 'var(--color-border)', strokeDasharray: '4 4', strokeOpacity: 0.6 }

function ChartCard({ title, icon, children, scrollControls }) {
  return (
    <Card className="rounded-2xl border shadow-sm overflow-hidden">
      <CardHeader className="px-5 py-4 border-b bg-muted/20">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            {icon}
            {title}
          </CardTitle>
          {scrollControls}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 overflow-x-auto">
          {children}
        </div>
      </CardContent>
    </Card>
  )
}

function HourlyChartsComponent({ data, airQualityData, isFahrenheit = false }) {
  const [scrollStart, setScrollStart] = useState(0)

  const chartData = useMemo(() => {
    if (!data?.hourly?.time) return []
    const hourly = data.hourly
    const aqHourly = airQualityData?.hourly

    return (hourly.time || []).map((time, index) => ({
      time: formatTime(time),
      temperature: isFahrenheit
        ? ((hourly.temperature_2m?.[index] || 0) * 9) / 5 + 32
        : (hourly.temperature_2m?.[index] || 0),
      humidity: hourly.relative_humidity_2m?.[index] || 0,
      precipitation: hourly.precipitation?.[index] || 0,
      visibility: (hourly.visibility?.[index] || 0) / 1000,
      windSpeed: hourly.windspeed_10m?.[index] || 0,
      pm10: aqHourly?.pm10?.[index] || 0,
      pm25: aqHourly?.pm2_5?.[index] || 0,
    }))
  }, [data, airQualityData, isFahrenheit])

  const visibleData = useMemo(
    () => chartData.slice(scrollStart, Math.min(scrollStart + HOURS_PER_VIEW, chartData.length)),
    [chartData, scrollStart]
  )

  const canScrollLeft = scrollStart > 0
  const canScrollRight = scrollStart + HOURS_PER_VIEW < chartData.length

  const handleScroll = (dir) => {
    if (dir === 'left') setScrollStart(Math.max(0, scrollStart - HOURS_PER_VIEW))
    else setScrollStart(Math.min(scrollStart + HOURS_PER_VIEW, Math.max(0, chartData.length - HOURS_PER_VIEW)))
  }

  const scrollControls = (
    <div className="flex items-center gap-1">
      <span className="text-xs text-muted-foreground mr-2 tabular-nums">
        {scrollStart + 1}–{Math.min(scrollStart + HOURS_PER_VIEW, chartData.length)} / {chartData.length}h
      </span>
      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleScroll('left')} disabled={!canScrollLeft}>
        <ChevronLeft className="h-3.5 w-3.5" />
      </Button>
      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleScroll('right')} disabled={!canScrollRight}>
        <ChevronRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  )

  const tempUnit = isFahrenheit ? '°F' : '°C'

  return (
    <div className="space-y-4">
      <ChartCard
        title={`Temperature (${tempUnit})`}
        icon={<Thermometer className="h-4 w-4 text-indigo-500" />}
        scrollControls={scrollControls}
      >
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={visibleData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
            <CartesianGrid {...gridStyle} />
            <XAxis dataKey="time" tick={axisStyle} />
            <YAxis tick={axisStyle} />
            <Tooltip content={<CustomTooltip formatter={(v) => `${v.toFixed(1)}${tempUnit}`} />} />
            <Line type="monotone" dataKey="temperature" name="Temperature" stroke={chartColors.temp} strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: chartColors.temp }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Relative Humidity (%)" icon={<Droplets className="h-4 w-4 text-cyan-500" />}>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={visibleData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
            <CartesianGrid {...gridStyle} />
            <XAxis dataKey="time" tick={axisStyle} />
            <YAxis domain={[0, 100]} tick={axisStyle} />
            <Tooltip content={<CustomTooltip formatter={(v) => `${v.toFixed(0)}%`} />} />
            <Line type="monotone" dataKey="humidity" name="Humidity" stroke={chartColors.humidity} strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: chartColors.humidity }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Precipitation (mm)" icon={<CloudRain className="h-4 w-4 text-blue-500" />}>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={visibleData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
            <CartesianGrid {...gridStyle} />
            <XAxis dataKey="time" tick={axisStyle} />
            <YAxis tick={axisStyle} />
            <Tooltip content={<CustomTooltip formatter={(v) => `${v.toFixed(2)} mm`} />} />
            <Bar dataKey="precipitation" name="Precipitation" fill={chartColors.precipitation} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Wind Speed (km/h)" icon={<Wind className="h-4 w-4 text-violet-500" />}>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={visibleData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
            <CartesianGrid {...gridStyle} />
            <XAxis dataKey="time" tick={axisStyle} />
            <YAxis tick={axisStyle} />
            <Tooltip content={<CustomTooltip formatter={(v) => `${v.toFixed(1)} km/h`} />} />
            <Line type="monotone" dataKey="windSpeed" name="Wind" stroke={chartColors.wind} strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: chartColors.wind }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Particulate Matter (μg/m³)" icon={<WindIcon className="h-4 w-4 text-amber-500" />}>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={visibleData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
            <CartesianGrid {...gridStyle} />
            <XAxis dataKey="time" tick={axisStyle} />
            <YAxis tick={axisStyle} />
            <Tooltip content={<CustomTooltip formatter={(v, k) => `${v.toFixed(1)} μg/m³`} />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="pm10" name="PM10" stroke={chartColors.pm10} strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="pm25" name="PM2.5" stroke={chartColors.pm25} strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}

export const HourlyCharts = memo(HourlyChartsComponent)
