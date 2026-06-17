import { useCallback, useEffect, useRef, useState } from 'react'

export function useInterviewTimer(initialSeconds = 1800, onComplete) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef(null)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  const start = useCallback(() => setIsRunning(true), [])
  const pause = useCallback(() => setIsRunning(false), [])
  const reset = useCallback(() => {
    setIsRunning(false)
    setSeconds(initialSeconds)
  }, [initialSeconds])

  useEffect(() => {
    if (!isRunning) return undefined

    intervalRef.current = setInterval(() => {
      setSeconds((current) => {
        if (current <= 1) {
          clearInterval(intervalRef.current)
          setIsRunning(false)
          onCompleteRef.current?.()
          return 0
        }
        return current - 1
      })
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [isRunning])

  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  const formatted = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  const progress = ((initialSeconds - seconds) / initialSeconds) * 100

  return { seconds, formatted, progress, isRunning, start, pause, reset }
}
