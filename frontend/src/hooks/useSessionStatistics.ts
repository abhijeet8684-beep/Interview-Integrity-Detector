import { useEffect, useRef, useState } from 'react'
import type { AnalyzeResponse } from '../types/api'

export interface AlertEntry {
  id: number
  message: string
  signal: string
  timestamp: string
}

export interface SessionStatistics {
  durationSeconds: number
  framesProcessed: number
  alerts: AlertEntry[]
  maximumRiskScore: number
  averageRiskScore: number
  currentRiskScore: number
}

const MEANINGFUL_FACE_STATES = new Set(['No Face', 'One Face Detected', 'Multiple Faces'])

/** Maintains interview-only alert history and aggregate monitoring statistics. */
export function useSessionStatistics(
  monitoringData: AnalyzeResponse | null,
  framesProcessed: number,
  isSessionRunning: boolean,
): SessionStatistics {
  const [durationSeconds, setDurationSeconds] = useState(0)
  const [alerts, setAlerts] = useState<AlertEntry[]>([])
  const [maximumRiskScore, setMaximumRiskScore] = useState(0)
  const [averageRiskScore, setAverageRiskScore] = useState(0)
  const processedFrameCount = useRef(0)
  const totalRiskScore = useRef(0)
  const lastAlertSignal = useRef<string | null>(null)

  useEffect(() => {
    if (!isSessionRunning) return
    const timer = window.setInterval(() => setDurationSeconds((seconds) => seconds + 1), 1_000)
    return () => window.clearInterval(timer)
  }, [isSessionRunning])

  useEffect(() => {
    if (!monitoringData || framesProcessed <= processedFrameCount.current) return

    processedFrameCount.current = framesProcessed
    totalRiskScore.current += monitoringData.risk_score
    setMaximumRiskScore((score) => Math.max(score, monitoringData.risk_score))
    setAverageRiskScore(Math.round(totalRiskScore.current / framesProcessed))

    const signal = monitoringData.signals.face_detection
    if (!MEANINGFUL_FACE_STATES.has(signal) || lastAlertSignal.current === signal) return

    const message = signal === 'One Face Detected' && lastAlertSignal.current === 'No Face'
      ? 'Candidate Returned'
      : signal
    lastAlertSignal.current = signal
    setAlerts((history) => [{
      id: framesProcessed,
      message,
      signal,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    }, ...history])
  }, [framesProcessed, monitoringData])

  return {
    durationSeconds,
    framesProcessed,
    alerts,
    maximumRiskScore,
    averageRiskScore,
    currentRiskScore: monitoringData?.risk_score ?? 0,
  }
}
