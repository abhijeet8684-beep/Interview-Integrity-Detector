import { Link } from 'react-router-dom'
import CameraView from '../components/CameraView'
import EventLog from '../components/EventLog'
import RiskCard from '../components/RiskCard'
import SignalCard from '../components/SignalCard'
import StatusBadge from '../components/StatusBadge'
import Timer from '../components/Timer'
import { useMonitoringData } from '../hooks/useMonitoringData'

const monitoringSignals = [
  { key: 'camera', name: 'Camera', description: 'Browser camera connection state.' },
  { key: 'face_detection', name: 'Face Detection', description: 'Face presence signal preparation.' },
  { key: 'eye_tracking', name: 'Eye Tracking', description: 'Gaze direction signal preparation.' },
  { key: 'head_pose', name: 'Head Pose', description: 'Head orientation signal preparation.' },
  { key: 'attention', name: 'Attention', description: 'General attention signal preparation.' },
] as const

function InterviewPage() {
  const { data, error, isLoading, retry } = useMonitoringData()

  return (
    <div className="min-h-screen bg-slate-100 lg:grid lg:grid-cols-[minmax(0,1fr)_320px]">
      <main className="min-w-0">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 lg:px-8">
          <div className="flex items-center gap-4"><Link to="/" className="flex size-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white" aria-label="Return home">II</Link><div><h1 className="font-semibold text-slate-950">Interview monitoring</h1><p className="text-sm text-slate-500">Session workspace</p></div></div>
          <div className="flex items-center gap-5"><div className="hidden sm:block"><StatusBadge label={data?.status ?? 'Monitoring...'} tone="info" /></div><Timer /></div>
        </header>
        <div className="mx-auto max-w-6xl space-y-6 p-5 lg:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold text-slate-500">Live session</p><h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Interview in progress</h2></div><div className="flex flex-wrap gap-2"><StatusBadge label={data?.signals.camera ?? 'Waiting...'} tone="success" /><StatusBadge label={data?.signals.face_detection ?? 'Waiting...'} tone="info" /><StatusBadge label={data?.status ?? 'Waiting for Backend'} /></div></div>
          {isLoading && <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800"><span className="size-4 animate-spin rounded-full border-2 border-blue-200 border-t-blue-700" />Loading monitoring data...</div>}
          {error && <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"><span>Unable to connect to monitoring backend.</span><button type="button" onClick={retry} className="rounded-lg bg-amber-900 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-amber-800">Retry</button></div>}
          <CameraView />
          <section><div className="mb-4"><h2 className="font-semibold text-slate-900">Monitoring signals</h2><p className="mt-1 text-sm text-slate-500">Live values are refreshed from the monitoring backend every five seconds.</p></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{monitoringSignals.map((signal) => <SignalCard key={signal.key} name={signal.name} description={signal.description} status={data?.signals[signal.key] ?? 'Waiting...'} />)}</div></section>
          <EventLog />
        </div>
      </main>
      <RiskCard monitoringData={data} />
    </div>
  )
}

export default InterviewPage
