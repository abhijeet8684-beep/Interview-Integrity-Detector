import StatusBadge from './StatusBadge'

interface SignalCardProps {
  name: string
  description: string
  status: string
}

function SignalCard({ name, description, status }: SignalCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-800">{name}</h3>
          <p className="mt-1 text-sm leading-5 text-slate-500">{description}</p>
        </div>
        <StatusBadge label={status} tone={status === 'Active' ? 'success' : 'neutral'} />
      </div>
    </article>
  )
}

export default SignalCard
