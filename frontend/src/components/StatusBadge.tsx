type StatusTone = 'neutral' | 'success' | 'info' | 'warning'

interface StatusBadgeProps {
  label: string
  tone?: StatusTone
}

const toneClasses: Record<StatusTone, string> = {
  neutral: 'bg-slate-100 text-slate-600 ring-slate-200',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  info: 'bg-blue-50 text-blue-700 ring-blue-200',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200',
}

function StatusBadge({ label, tone = 'neutral' }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${toneClasses[tone]}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  )
}

export default StatusBadge
