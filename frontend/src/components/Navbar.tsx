import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Overview', href: '/' },
  { label: 'How it works', href: '/#how-it-works' },
]

function Navbar() {
  const { pathname } = useLocation()

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8" aria-label="Main navigation">
        <Link to="/" className="flex items-center gap-3 font-semibold text-slate-950">
          <span className="flex size-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">II</span>
          <span className="leading-tight">Interview Integrity<span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400">AI-Assisted Interview Monitoring</span></span>
        </Link>
        <div className="hidden items-center gap-7 text-sm font-medium text-slate-500 sm:flex">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className={pathname === item.href ? 'text-slate-950' : 'hover:text-slate-900'}>
              {item.label}
            </a>
          ))}
        </div>
        <Link to="/consent" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700">
          Start interview
        </Link>
      </nav>
    </header>
  )
}

export default Navbar
