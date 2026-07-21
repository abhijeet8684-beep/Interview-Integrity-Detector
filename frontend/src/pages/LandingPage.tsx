import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const features = ['Zero Installation', 'Browser Based', 'Explainable Risk Score', 'Human Reviewer Decision']

const pipeline = [
  { title: 'Camera', description: 'Secure browser camera access.', icon: 'camera' },
  { title: 'Face Detection', description: 'Face presence signal preparation.', icon: 'face' },
  { title: 'Eye Tracking', description: 'Gaze direction signal preparation.', icon: 'eye' },
  { title: 'Head Pose', description: 'Head orientation signal preparation.', icon: 'pose' },
  { title: 'Risk Engine', description: 'Explainable score calculation.', icon: 'risk' },
  { title: 'Reviewer Dashboard', description: 'Human-led final review.', icon: 'review' },
]

function PipelineIcon({ name }: { name: string }) {
  const common = 'size-5 fill-none stroke-current stroke-[1.8]'
  if (name === 'eye') return <svg aria-hidden="true" viewBox="0 0 24 24" className={common}><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></svg>
  if (name === 'face') return <svg aria-hidden="true" viewBox="0 0 24 24" className={common}><rect x="4" y="3" width="16" height="18" rx="4" /><path d="M8 10h.01M16 10h.01M9 15c1.8 1.3 4.2 1.3 6 0" /></svg>
  if (name === 'pose') return <svg aria-hidden="true" viewBox="0 0 24 24" className={common}><circle cx="12" cy="7" r="3" /><path d="M6 21v-2a6 6 0 0 1 12 0v2M12 10v4M8 3 5 6m11-3 3 3" /></svg>
  if (name === 'risk') return <svg aria-hidden="true" viewBox="0 0 24 24" className={common}><path d="M4 19V5m0 14h16" /><path d="m7 15 4-4 3 2 4-5" /></svg>
  if (name === 'review') return <svg aria-hidden="true" viewBox="0 0 24 24" className={common}><path d="M6 3h12v18H6z" /><path d="M9 8h6M9 12h6M9 16h3" /></svg>
  return <svg aria-hidden="true" viewBox="0 0 24 24" className={common}><path d="M3 7a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" /><path d="m16 10 4-2v8l-4-2" /></svg>
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>
        <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-28">
          <div>
            <p className="inline-flex rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600">Interview monitoring platform</p>
            <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">Interview Integrity Detector</h1>
            <p className="mt-6 text-xl font-medium leading-8 text-slate-700">Browser-based AI Interview Assistant Detection System</p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-500">A focused monitoring workspace that helps interview teams review integrity signals with clarity, consistency, and human oversight.</p>
            <ul className="mt-7 grid gap-3 text-sm font-medium text-slate-600 sm:grid-cols-2">{features.map((feature) => <li key={feature} className="flex items-center gap-2"><span className="flex size-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">✓</span>{feature}</li>)}</ul>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to="/consent" className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700">Start Interview <span aria-hidden="true">→</span></Link>
              <a href="#how-it-works" className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">Learn more</a>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50">
            <div className="rounded-2xl bg-slate-900 p-6">
              <div className="flex items-center justify-between text-sm text-slate-400"><span>Live integrity overview</span><span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-emerald-300">System Ready</span></div>
              <div className="mt-9 flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex size-32 items-center justify-center rounded-full border-[10px] border-slate-700 border-t-emerald-400"><div className="text-center"><p className="text-2xl font-semibold text-white">--</p><p className="text-[10px] uppercase tracking-widest text-slate-400">Risk gauge</p></div></div>
                <p className="mt-4 text-sm text-slate-400">Future risk score visualization</p>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">{['Camera', 'Attention', 'Head pose', 'Activity'].map((item) => <div key={item} className="rounded-xl border border-white/10 bg-white/5 p-4"><p className="text-sm text-slate-400">{item}</p><p className="mt-3 text-sm font-medium text-white">Awaiting session</p></div>)}</div>
            </div>
            <p className="px-2 pb-1 pt-5 text-sm leading-6 text-slate-500">Built to support fair, transparent interview review—not to replace human judgment.</p>
          </div>
        </section>
        <section id="how-it-works" className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-semibold text-slate-500">How it works</p><h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Detection Pipeline</h2></div><p className="max-w-md text-sm leading-6 text-slate-500">A transparent sequence of future monitoring signals, designed for human review.</p></div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{pipeline.map((step, index) => <article key={step.title} className="relative rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm"><span className="absolute right-5 top-5 text-xs font-semibold text-slate-300">0{index + 1}</span><span className="flex size-10 items-center justify-center rounded-xl bg-slate-900 text-slate-100"><PipelineIcon name={step.icon} /></span><h3 className="mt-5 font-semibold text-slate-900">{step.title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{step.description}</p></article>)}</div>
          </div>
        </section>
        <section className="border-b border-slate-200 bg-slate-50"><div className="mx-auto max-w-7xl px-5 py-12 lg:px-8"><h2 className="text-lg font-semibold text-slate-900">Designed for responsible monitoring</h2><div className="mt-6 grid gap-5 md:grid-cols-3">{[['Consent first', 'Clear candidate notice before camera access.'], ['Signal-based', 'Signals are prepared for structured review.'], ['Human reviewed', 'Final decisions remain with people.']].map(([title, body], index) => <div key={title} className="rounded-xl bg-white p-5 shadow-sm"><span className="text-sm font-semibold text-slate-400">0{index + 1}</span><h3 className="mt-5 font-semibold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{body}</p></div>)}</div></div></section>
      </main>
      <footer className="bg-slate-950 text-slate-400"><div className="mx-auto grid max-w-7xl gap-4 px-5 py-7 text-center text-sm font-medium sm:grid-cols-2 sm:text-left lg:grid-cols-4 lg:px-8">{['Privacy First', 'Browser Only', 'No Software Installation', 'Designed for Recruiters'].map((item) => <span key={item}>{item}</span>)}</div></footer>
    </div>
  )
}

export default LandingPage
