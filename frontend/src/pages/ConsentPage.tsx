import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

function ConsentPage() {
  const [hasConsent, setHasConsent] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto flex max-w-3xl justify-center px-5 py-14 sm:py-20">
        <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
          <p className="text-sm font-semibold text-slate-500">Step 1 of 2</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Interview monitoring consent</h1>
          <p className="mt-3 max-w-xl leading-7 text-slate-500">Please review how the interview monitoring workspace will be used before you enter the session.</p>
          <div className="mt-8 divide-y divide-slate-100 rounded-xl border border-slate-200">
            {['Your camera will be used for interview monitoring during this session.', 'No software installation is required; monitoring runs in your browser.', 'The system generates risk indicators only—it does not make a final decision.', 'Human reviewers make the final decision after considering the full context.'].map((item, index) => <div key={item} className="flex gap-4 p-4"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">{index + 1}</span><p className="text-sm leading-6 text-slate-600">{item}</p></div>)}
          </div>
          <label className="mt-7 flex cursor-pointer items-start gap-3 rounded-xl bg-slate-50 p-4">
            <input type="checkbox" checked={hasConsent} onChange={(event) => setHasConsent(event.target.checked)} className="mt-0.5 size-4 rounded border-slate-300 accent-slate-900" />
            <span className="text-sm leading-6 text-slate-700">I consent to camera-based interview monitoring and understand that results are reviewed by people.</span>
          </label>
          <div className="mt-8 flex items-center justify-between gap-4">
            <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-slate-950">Back</Link>
            <button type="button" disabled={!hasConsent} onClick={() => navigate('/interview')} className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 disabled:bg-slate-200 disabled:text-slate-400">Continue to interview <span aria-hidden="true">→</span></button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default ConsentPage
