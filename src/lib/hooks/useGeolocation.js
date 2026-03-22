import { useEffect, useState } from 'react'

const FALLBACK_LOCATION = {
  latitude: 28.6139,
  longitude: 77.209,
  name: 'Delhi, India',
}

export function useGeolocation() {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported')
      setLocation(FALLBACK_LOCATION)
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setLocation({
          latitude,
          longitude,
          name: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
        })
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLocation(FALLBACK_LOCATION)
        setLoading(false)
      }
    )
  }, [])

  return { location, error, loading }
}
