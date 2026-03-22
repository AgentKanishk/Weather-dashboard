import { useQuery } from '@tanstack/react-query'
import { fetchAirQuality } from '@/lib/utils/api'

export const AIR_QUALITY_QUERY_KEYS = {
  current: (lat, lon) => ['airQuality', 'current', lat, lon],
}

export function useAirQuality(latitude, longitude) {
  return useQuery({
    queryKey: AIR_QUALITY_QUERY_KEYS.current(latitude, longitude),
    queryFn: async () => {
      const data = await fetchAirQuality(latitude, longitude)
      return data
    },
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    refetchInterval: 1000 * 60 * 30,
    enabled: !!latitude && !!longitude,
  })
}
