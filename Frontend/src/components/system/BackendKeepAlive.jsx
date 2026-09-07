import { useEffect } from 'react'

const KEEP_ALIVE_INTERVAL = 10 * 60 * 1000
const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')

function BackendKeepAlive() {
  useEffect(() => {
    let controller

    const pingBackend = async () => {
      controller?.abort()
      controller = new AbortController()

      try {
        await fetch(`${apiUrl}/health/ping`, {
          signal: controller.signal,
          cache: 'no-store',
        })
      } catch (error) {
        if (error.name !== 'AbortError') {
          // The next scheduled ping will retry without affecting the UI.
        }
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        pingBackend()
      }
    }

    pingBackend()
    const intervalId = window.setInterval(pingBackend, KEEP_ALIVE_INTERVAL)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      controller?.abort()
    }
  }, [])

  return null
}

export default BackendKeepAlive