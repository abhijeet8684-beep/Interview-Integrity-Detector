import type { BehaviorAnalysis } from '../types/api'
import StatusBadge from './StatusBadge'

interface BehaviorAnalysisCardProps {
  behavior: BehaviorAnalysis | null
}

function formatAngle(value: number | null) {
  return value === null ? 'Not available' : `${value.toFixed(1)}°`
}

function BehaviorAnalysisCard({ behavior }: BehaviorAnalysisCardProps) {
  const pose = behavior?.head_pose
  const alerts = behavior?.behavior_alerts ?? []

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-semibold text-slate-900">Behavior Analysis</h2><p className="mt-1 text-sm text-slate-500">Face Mesh gaze and head-orientation observations.</p></div><StatusBadge label={`+${behavior?.behavior_risk ?? 0}% risk`} tone={behavior?.behavior_risk ? 'warning' : 'success'} /></div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-medium uppercase tracking-wider text-slate-400">Current Gaze</p><p className="mt-1 text-lg font-semibold text-slate-800">{behavior?.gaze_direction ?? 'NOT_AVAILABLE'}</p></div><div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-medium uppercase tracking-wider text-slate-400">Current Head Pose</p><p className="mt-1 text-sm font-semibold text-slate-800">Yaw {formatAngle(pose?.yaw ?? null)} · Pitch {formatAngle(pose?.pitch ?? null)} · Roll {formatAngle(pose?.roll ?? null)}</p></div></div>
      <div className="mt-4 rounded-xl border border-slate-200 p-4"><p className="text-xs font-medium uppercase tracking-wider text-slate-400">Behavior Alerts</p>{alerts.length === 0 ? <p className="mt-2 text-sm text-slate-500">No active behavior alerts.</p> : <ul className="mt-2 space-y-1">{alerts.map((alert) => <li key={alert} className="text-sm font-medium text-amber-800">{alert}</li>)}</ul>}</div>
    </section>
  )
}

export default BehaviorAnalysisCard
