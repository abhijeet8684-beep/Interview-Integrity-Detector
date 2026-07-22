import type { SessionStatistics } from '../hooks/useSessionStatistics'

interface SessionStatisticsCardProps {
  statistics: SessionStatistics
  recommendation: string
  summary?: boolean
}

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0')
  const seconds = (totalSeconds % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
}

function SessionStatisticsCard({ statistics, recommendation, summary = false }: SessionStatisticsCardProps) {
  const values = [
    ['Session Duration', formatDuration(statistics.durationSeconds)],
    ['Frames Processed', statistics.framesProcessed.toString()],
    ['Alerts', statistics.alerts.length.toString()],
    ['Average Risk', `${statistics.averageRiskScore}%`],
    ['Maximum Risk', `${statistics.maximumRiskScore}%`],
    ['Current Risk', `${statistics.currentRiskScore}%`],
  ]

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between"><div><h2 className="font-semibold text-slate-900">{summary ? 'Session Summary' : 'Session Statistics'}</h2><p className="mt-0.5 text-sm text-slate-500">{summary ? 'Final values for this interview session.' : 'Live monitoring totals for this session.'}</p></div></div>
      <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{values.map(([label, value]) => <div key={label} className="rounded-xl bg-slate-50 p-3"><dt className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</dt><dd className="mt-1 text-lg font-semibold text-slate-800">{value}</dd></div>)}</dl>
      {summary && <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3"><span className="text-sm text-slate-500">Recommendation</span><span className="text-sm font-semibold text-slate-900">{recommendation}</span></div>}
    </section>
  )
}

export default SessionStatisticsCard
