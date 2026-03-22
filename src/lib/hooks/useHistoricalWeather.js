import { useQuery } from '@tanstack/react-query'
import { fetchHistoricalWeather } from '@/lib/utils/api'

export const HISTORICAL_QUERY_KEYS = {
  range: (lat, lon, startDate, endDate) => ['weather', 'historical', lat, lon, startDate, endDate],
}

export function useHistoricalWeather(latitude, longitude, startDate, endDate) {
  return useQuery({
    queryKey: HISTORICAL_QUERY_KEYS.range(latitude, longitude, startDate, endDate),
    queryFn: async () => {
      const data = await fetchHistoricalWeather(
        latitude,
        longitude,
        startDate,
        endDate
      )
      return data
    },
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 120,
    enabled: !!latitude && !!longitude && !!startDate && !!endDate,
  })
}
