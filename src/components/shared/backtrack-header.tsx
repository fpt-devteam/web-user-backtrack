import { useNavigate, useRouterState } from '@tanstack/react-router'
import { NavDrawer } from '@/components/shared/nav-drawer'
import { useAuth } from '@/hooks/use-auth'
import { useEffect, useState } from 'react'

/* ── nav link manifest ──────────────────────────────────────── */
const NAV_LINKS: Array<{ label: string; to: string }> = [
  { label: 'Pricing',  to: '/premium'  },
  { label: 'Support',  to: '/support'  },
  { label: 'Messager', to: '/messager' },
]

/* ── Wordmark ───────────────────────────────────────────────── */
function WordmarkLogo() {
  return (
    <img
      src="/backtrack-logo.svg"
      alt="Backtrack"
      className="h-7 w-auto select-none transition-all duration-300"
      draggable={false}
    />
  )
}

/* ── pill-shaped active dot indicator ───────────────────────── */
function NavDot() {
  return (
    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-500 opacity-90" />
  )
}

/* ───────────────────────────────────────────────────────────── */
export function BacktrackHeader() {
  const navigate      = useNavigate()
  const { location }  = useRouterState()
  const { profile }   = useAuth()
  const pathname      = location.pathname

  /* scroll-aware shrink */
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleGetApp = () => {
    if (pathname === '/') {
      document.getElementById('download-cta')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      navigate({ to: '/download' })
    }
  }

  const isActive = (to: string) => pathname === to || pathname.startsWith(to + '/')
  const accountTo  = profile ? '/account' : '/sign-in'
  const accountLabel = profile ? (profile.displayName?.split(' ')[0] ?? 'Account') : 'Log in'

  return (
    <header
      className={[
        'sticky top-0 z-40 w-full transition-all duration-300',
        scrolled
          ? 'backdrop-blur-xl shadow-[0_2px_24px_rgba(0,0,0,0.08)]'
          : 'backdrop-blur-md',
      ].join(' ')}
      style={{
        backgroundColor: scrolled
          ? 'rgba(252,251,249,0.96)'
          : 'rgba(248,247,244,0.85)',
        borderBottom: scrolled
          ? '1px solid rgba(0,0,0,0.08)'
          : '1px solid rgba(0,0,0,0.05)',
      }}
    >
      {/* ── inner row ─────────────────────────────────────────── */}
      <div
        className={[
          'max-w-screen-xl mx-auto px-5 lg:px-10 grid grid-cols-3 items-center gap-4 transition-all duration-300',
          scrolled ? 'py-2' : 'py-3.5',
        ].join(' ')}
      >

        {/* ── LEFT — logo ───────────────────────────────────────── */}
        <button
          onClick={() => navigate({ to: '/' })}
          className="bg-transparent border-0 p-0 cursor-pointer justify-self-start group focus:outline-none"
          aria-label="Go to homepage"
        >
          <span className="flex items-center gap-2.5">
            {/* accent dot — subtle brand pulse */}
            <span className="hidden sm:block relative shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 block shadow-sm
                               group-hover:scale-110 transition-transform duration-200" />
              <span className="absolute inset-0 rounded-full bg-brand-400 animate-ping opacity-30" />
            </span>
            <WordmarkLogo />
          </span>
        </button>

        {/* ── CENTER — desktop nav ─────────────────────────────── */}
        <nav
          className="hidden lg:flex items-center justify-center gap-0.5"
          aria-label="Main navigation"
        >
          {/* background pill for active route */}
          {NAV_LINKS.map(({ label, to }) => {
            const active = isActive(to)
            return (
              <button
                key={label}
                onClick={() => navigate({ to })}
                className={[
                  'relative px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-1',
                  active
                    ? 'text-brand-700 bg-brand-50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50',
                ].join(' ')}
                aria-current={active ? 'page' : undefined}
              >
                {label}
                {active && <NavDot />}
              </button>
            )
          })}
        </nav>

        {/* ── RIGHT — desktop auth actions ─────────────────────── */}
        <div className="hidden lg:flex items-center justify-end gap-1.5">

          {/* Account / Log in — ghost pill */}
          <button
            onClick={() => navigate({ to: accountTo })}
            className={[
              'px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400',
              isActive(accountTo)
                ? 'bg-brand-50 text-brand-700'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50',
            ].join(' ')}
          >
            {accountLabel}
          </button>

          {/* Separator */}
          <span className="w-px h-4 bg-gray-200 mx-0.5" aria-hidden />

          {/* Get the App — gradient pill CTA */}
          <button
            onClick={handleGetApp}
            className={[
              'group flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white',
              'rounded-full transition-all duration-200 cursor-pointer',
              'hover:-translate-y-px hover:shadow-lg hover:shadow-brand-500/25',
              'active:scale-95 active:translate-y-0',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400',
            ].join(' ')}
            style={{ background: 'var(--btn-dark-gradient)' }}
          >
            Get the App
            <svg
              width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true"
              className="group-hover:translate-x-0.5 transition-transform duration-200"
            >
              <path d="M2.5 6H9.5M6.5 3L9.5 6L6.5 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* ── MOBILE — hamburger ───────────────────────────────── */}
        <div className="lg:hidden justify-self-end">
          <NavDrawer />
        </div>

      </div>

      {/* ── progress bar — brand-colored, only when scrolled ──── */}
      {scrolled && (
        <div
          className="absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600 pointer-events-none"
          style={{ width: '100%', opacity: 0.45 }}
          aria-hidden
        />
      )}
    </header>
  )
}
