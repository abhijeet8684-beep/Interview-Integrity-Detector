import type { AlertEntry } from '../hooks/useSessionStatistics'

interface EventLogProps {
  alerts: AlertEntry[]
}

function EventLog({ alerts }: EventLogProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div><h2 className="font-semibold text-slate-900">Alert history</h2><p className="mt-0.5 text-sm text-slate-500">Meaningful face-monitoring changes for this session.</p></div>
        <span className="text-xs font-medium text-slate-400">{alerts.length} alerts</span>
      </div>
      <ol className="max-h-52 overflow-y-auto p-2">
        {alerts.length === 0 ? <li className="px-3 py-5 text-sm text-slate-500">No monitoring alerts yet.</li> : alerts.map((alert) => <li key={alert.id} className="flex items-center justify-between rounded-lg px-3 py-3 hover:bg-slate-50"><span className="flex items-center gap-3 text-sm text-slate-700"><span className="size-2 rounded-full bg-slate-300" />{alert.message}</span><time className="text-xs text-slate-400">{alert.timestamp}</time></li>)}
      </ol>
    </section>
  )
}

export default EventLog
