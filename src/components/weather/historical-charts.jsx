import { useMemo, memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { formatDate } from '@/lib/utils/weather'
import { Thermometer, CloudRain, Wind, Sun, Sunset } from 'lucide-react'

const chartColors = {
  tempMax: '#ef4444',
  tempMean: '#f59e0b',
  tempMin: '#3b82f6',
  precipitation: '#06b6d4',
  wind: '#8b5cf6',
}

const axisStyle = { fontSize: 11, fill: 'var(--color-muted-foreground)' }
const gridStyle = { stroke: 'var(--color-border)', strokeDasharray: '4 4', strokeOpacity: 0.6 }

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border bg-card/95 backdrop-blur-sm shadow-xl px-3 py-2 text-sm">
      <p className="font-semibold text-foreground mb-1.5">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium">{entry.value?.toFixed(1)}</span>
        </div>
      ))}
    </div>
  )
}

function ChartCard({ title, icon, children }) {
  return (
    <Card className="rounded-2xl border shadow-sm overflow-hidden">
      <CardHeader className="px-5 py-4 border-b bg-muted/20">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 overflow-x-auto">
          {children}
        </div>
      </CardContent>
    </Card>
  )
}

function HistoricalChartsComponent({ data, isFahrenheit = false }) {
  const chartData = useMemo(() => {
    const daily = data?.daily ?? data
    if (!daily?.time) return []

    return (daily.time || []).map((time, index) => ({
      date: formatDate(time),
      tempMax: isFahrenheit
        ? (daily.temperature_2m_max?.[index] * 9) / 5 + 32
        : (daily.temperature_2m_max?.[index] || 0),
      tempMin: isFahrenheit
        ? (daily.temperature_2m_min?.[index] * 9) / 5 + 32
        : (daily.temperature_2m_min?.[index] || 0),
      tempMean: isFahrenheit
        ? (daily.temperature_2m_mean?.[index] * 9) / 5 + 32
        : (daily.temperature_2m_mean?.[index] || 0),
      precipitation: daily.precipitation_sum?.[index] || 0,
      windSpeed: daily.windspeed_10m_max?.[index] || 0,
      sunrise: daily.sunrise?.[index]?.split('T')[1] || '--',
      sunset: daily.sunset?.[index]?.split('T')[1] || '--',
    }))
  }, [data, isFahrenheit])

  const tempUnit = isFahrenheit ? '°F' : '°C'

  return (
    <div className="space-y-4">
      <ChartCard
        title={`Temperature Trends (${tempUnit})`}
        icon={<Thermometer className="h-4 w-4 text-red-500" />}
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
            <CartesianGrid {...gridStyle} />
            <XAxis dataKey="date" tick={axisStyle} />
            <YAxis tick={axisStyle} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="tempMax" name="Max" stroke={chartColors.tempMax} strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="tempMean" name="Mean" stroke={chartColors.tempMean} strokeWidth={2} dot={false} activeDot={{ r: 4 }} strokeDasharray="5 3" />
            <Line type="monotone" dataKey="tempMin" name="Min" stroke={chartColors.tempMin} strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Precipitation Total (mm)" icon={<CloudRain className="h-4 w-4 text-cyan-500" />}>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
            <CartesianGrid {...gridStyle} />
            <XAxis dataKey="date" tick={axisStyle} />
            <YAxis tick={axisStyle} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="precipitation" name="Precipitation" fill={chartColors.precipitation} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Max Wind Speed (km/h)" icon={<Wind className="h-4 w-4 text-violet-500" />}>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
            <CartesianGrid {...gridStyle} />
            <XAxis dataKey="date" tick={axisStyle} />
            <YAxis tick={axisStyle} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="windSpeed" name="Wind Speed" stroke={chartColors.wind} strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <Card className="rounded-2xl border shadow-sm overflow-hidden">
        <CardHeader className="px-5 py-4 border-b bg-muted/20">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <Sun className="h-4 w-4 text-amber-500" />
            Sunrise & Sunset
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left py-3 px-5 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Date</th>
                  <th className="text-left py-3 px-5 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                    <span className="flex items-center gap-1.5"><Sun className="h-3.5 w-3.5 text-amber-400" />Sunrise</span>
                  </th>
                  <th className="text-left py-3 px-5 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                    <span className="flex items-center gap-1.5"><Sunset className="h-3.5 w-3.5 text-orange-400" />Sunset</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((row, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-5 font-medium">{row.date}</td>
                    <td className="py-3 px-5 tabular-nums text-amber-600 dark:text-amber-400 font-medium">{row.sunrise}</td>
                    <td className="py-3 px-5 tabular-nums text-orange-600 dark:text-orange-400 font-medium">{row.sunset}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const HistoricalCharts = memo(HistoricalChartsComponent)
