import { useEffect, useState } from 'react'

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0')
  const seconds = (totalSeconds % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
}

function Timer() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => setElapsedSeconds((seconds) => seconds + 1), 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="text-right">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Interview timer</p>
      <time className="mt-1 block font-mono text-2xl font-semibold tracking-tight text-slate-900">{formatTime(elapsedSeconds)}</time>
    </div>
  )
}

export default Timer
