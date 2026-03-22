import { useQuery } from '@tanstack/react-query'
import {
  fetchCurrentWeather,
  fetchHourlyWeather,
} from '@/lib/utils/api'

export const WEATHER_QUERY_KEYS = {
  current: (lat, lon) => ['weather', 'current', lat, lon],
  hourly: (lat, lon, date) => [
    'weather',
    'hourly',
    lat,
    lon,
    date,
  ],
}

export function useCurrentWeather(latitude, longitude) {
  return useQuery({
    queryKey: WEATHER_QUERY_KEYS.current(latitude, longitude),
    queryFn: async () => {
      const data = await fetchCurrentWeather(latitude, longitude)
      return data
    },
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
    enabled: !!latitude && !!longitude,
  })
}

export function useHourlyWeather(
  latitude,
  longitude,
  date
) {
  return useQuery({
    queryKey: WEATHER_QUERY_KEYS.hourly(latitude, longitude, date),
    queryFn: async () => {
      const data = await fetchHourlyWeather(latitude, longitude, date)
      return data
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 15,
    refetchInterval: 1000 * 60 * 15,
    enabled: !!latitude && !!longitude,
  })
}
