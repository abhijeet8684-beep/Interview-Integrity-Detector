import type { AnalyzeResponse } from '../types/api'
import StatusBadge from './StatusBadge'

interface RiskCardProps {
  monitoringData: AnalyzeResponse | null
}

function RiskCard({ monitoringData }: RiskCardProps) {
  const riskScore = monitoringData?.risk_score ?? 0
  const status = monitoringData?.status ?? 'Waiting...'
  const signals = monitoringData
    ? [
        ['Camera', monitoringData.signals.camera],
        ['Face Detection', monitoringData.signals.face_detection],
        ['Eye Tracking', monitoringData.signals.eye_tracking],
        ['Head Pose', monitoringData.signals.head_pose],
        ['Attention', monitoringData.signals.attention],
      ]
    : [
        ['Camera', 'Waiting...'],
        ['Face Detection', 'Waiting...'],
        ['Eye Tracking', 'Waiting...'],
        ['Head Pose', 'Waiting...'],
        ['Attention', 'Waiting...'],
      ]

  return (
    <aside className="flex h-full flex-col bg-slate-900 p-6 text-white">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Integrity assessment</p>
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm text-slate-400">Risk score</p>
        <div className="mt-3 flex items-end gap-2">
          <span className="text-5xl font-semibold tracking-tight">{riskScore}%</span>
          <span className="mb-1.5 text-sm text-slate-400">current score</span>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${riskScore}%` }} />
        </div>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-sm text-slate-400">Status</span>
          <StatusBadge label={status} tone="success" />
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-sm font-semibold">Signals</h2>
        <div className="mt-3 divide-y divide-white/10">
          {signals.map(([signal, signalStatus]) => (
            <div key={signal} className="flex items-center justify-between py-3 text-sm">
              <span className="text-slate-300">{signal}</span>
              <span className="text-slate-500">{signalStatus}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Recommendation</p>
        <p className="mt-2 text-sm font-medium text-white">{monitoringData?.recommendation ?? 'Waiting...'}</p>
      </div>
      <p className="mt-auto border-t border-white/10 pt-5 text-xs leading-5 text-slate-500">Scores are decision-support signals only. Human reviewers make final decisions.</p>
    </aside>
  )
}

export default RiskCard
