import { useCallback, useEffect, useRef, useState } from 'react'
import { analyzeFrame } from '../api/api'
import type { FrameCapture } from '../components/CameraView'
import type { AnalyzeResponse } from '../types/api'

const POLLING_INTERVAL_MS = 5_000

interface MonitoringDataState {
  data: AnalyzeResponse | null
  error: boolean
  isLoading: boolean
  retry: () => void
}

/** Captures browser frames and polls the backend while the interview page is mounted. */
export function useMonitoringData(captureFrame: FrameCapture): MonitoringDataState {
  const [data, setData] = useState<AnalyzeResponse | null>(null)
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const frameId = useRef(0)
  const requestInFlight = useRef(false)
  const controllerRef = useRef<AbortController | null>(null)
  const isMounted = useRef(true)

  const loadMonitoringData = useCallback(async () => {
    if (requestInFlight.current) return

    const image = captureFrame()
    if (!image) return

    requestInFlight.current = true
    controllerRef.current = new AbortController()

    try {
      const response = await analyzeFrame({ frame_id: ++frameId.current, timestamp: new Date().toISOString(), image }, controllerRef.current.signal)
      if (isMounted.current) {
        setData(response)
        setError(false)
      }
    } catch (requestError) {
      if (isMounted.current && !(requestError instanceof DOMException && requestError.name === 'AbortError')) {
        console.error('Unable to connect to monitoring backend.', requestError)
        setError(true)
      }
    } finally {
      requestInFlight.current = false
      if (isMounted.current) setIsLoading(false)
    }
  }, [captureFrame])

  useEffect(() => {
    isMounted.current = true
    void loadMonitoringData()
    const intervalId = window.setInterval(() => void loadMonitoringData(), POLLING_INTERVAL_MS)
    return () => {
      isMounted.current = false
      window.clearInterval(intervalId)
      controllerRef.current?.abort()
    }
  }, [loadMonitoringData])

  const retry = useCallback(() => {
    setIsLoading(true)
    void loadMonitoringData()
  }, [loadMonitoringData])

  return { data, error, isLoading, retry }
}
