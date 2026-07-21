const events = [
  { event: 'Camera initialized', time: 'Now' },
  { event: 'Waiting for analysis', time: 'Now' },
  { event: 'Interview started', time: 'Now' },
  { event: 'Ready for detection', time: 'Now' },
]

function EventLog() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="font-semibold text-slate-900">Event log</h2>
          <p className="mt-0.5 text-sm text-slate-500">Live monitoring activity will appear here.</p>
        </div>
        <span className="text-xs font-medium text-slate-400">Latest events</span>
      </div>
      <ol className="max-h-52 overflow-y-auto p-2">
        {events.map((item) => (
          <li key={item.event} className="flex items-center justify-between rounded-lg px-3 py-3 hover:bg-slate-50">
            <span className="flex items-center gap-3 text-sm text-slate-700"><span className="size-2 rounded-full bg-slate-300" />{item.event}</span>
            <time className="text-xs text-slate-400">{item.time}</time>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default EventLog
