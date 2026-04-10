import { useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  Building2,
  Menu,
  MessageCircle,
  Sparkles,
  User,
} from 'lucide-react'
import { NavDrawer } from '@/components/shared/nav-drawer'
import { useAuth } from '@/hooks/use-auth'

/* ── nav link manifest ──────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Pricing',       to: '/premium',       icon: Sparkles },
  { label: 'Message',       to: '/message',       icon: MessageCircle  },
  { label: 'Organizations', to: '/organizations', icon: Building2 },
] as const

/* ── Wordmark ───────────────────────────────────────────────── */
function WordmarkLogo() {
  return (
    <img
      src="/backtrack-logo.svg"
      alt="Backtrack"
      className="h-7 w-auto select-none"
      draggable={false}
    />
  )
}

// /* ── NEW badge ──────────────────────────────────────────────── */
// function NewBadge() {
//   return (
//     <span className="absolute -top-1 -right-2 text-[9px] font-black tracking-wide
//                      bg-[#1a73e8] text-white px-1 py-px rounded-full leading-none select-none">
//       NEW
//     </span>
//   )
// }

/* ───────────────────────────────────────────────────────────── */
export function BacktrackHeader() {
  const navigate     = useNavigate()
  const { location } = useRouterState()
  const { profile }  = useAuth()
  const pathname     = location.pathname

  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (to: string) => pathname === to || pathname.startsWith(to + '/')

  const accountTo    = profile ? '/account' : '/sign-in'
  const accountLabel = profile ? (profile.displayName?.split(' ')[0] ?? 'Account') : 'Log in'
  const avatarLetter = profile?.displayName?.charAt(0).toUpperCase() ?? null

  const handleGetApp = () => {
    if (pathname === '/') {
      document.getElementById('download-cta')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      navigate({ to: '/download' })
    }
  }

  return (
    <header
      className={[
        'sticky top-0 z-40 w-full bg-white transition-shadow duration-300',
        scrolled ? 'shadow-[0_1px_12px_rgba(0,0,0,0.08)]' : 'border-b border-gray-100',
      ].join(' ')}
    >
      <div className="max-w-screen-xl mx-auto px-5 lg:px-10 h-[72px] grid grid-cols-3 items-stretch">

        {/* ── LEFT — logo ───────────────────────────────────────── */}
        <button
          onClick={() => navigate({ to: '/' })}
          className="justify-self-start self-center bg-transparent border-0 p-0 cursor-pointer
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 rounded-lg"
          aria-label="Go to homepage"
        >
          <WordmarkLogo />
        </button>

        {/* ── CENTER — desktop tab nav ──────────────────────────── */}
        <nav
          className="hidden lg:flex items-stretch justify-center"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map(({ label, to, icon: Icon }) => {
            const active = isActive(to)
            return (
              <button
                key={to}
                onClick={() => navigate({ to })}
                aria-current={active ? 'page' : undefined}
                className={[
                  'relative flex flex-col items-center justify-center gap-1 px-5 cursor-pointer',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400',
                  'transition-colors duration-150 group',
                  active ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900',
                ].join(' ')}
              >
                {/* icon + NEW badge wrapper */}
                <span className="relative">
                  <Icon
                    className={[
                      'w-5 h-5 transition-colors duration-150',
                      active
                        ? 'text-gray-900'
                        : 'text-gray-400 group-hover:text-gray-700',
                    ].join(' ')}
                    strokeWidth={active ? 2.2 : 1.8}
                    aria-hidden="true"
                  />
                </span>

                {/* label */}
                <span
                  className={[
                    'text-[12.5px] leading-none transition-all duration-150',
                    active ? 'font-bold text-gray-900' : 'font-medium text-gray-500 group-hover:text-gray-800',
                  ].join(' ')}
                >
                  {label}
                </span>

                {/* bottom underline — only on active */}
                {active && (
                  <span
                    className="absolute bottom-0 left-3 right-3 h-[2px] rounded-t-full bg-gray-900"
                    aria-hidden="true"
                  />
                )}
              </button>
            )
          })}
        </nav>

        {/* ── RIGHT — CTA + avatar pill + hamburger ────────────── */}
        <div className="hidden lg:flex items-center justify-end gap-3">

          {/* "Get the App" text link */}
          <button
            onClick={handleGetApp}
            className="text-sm font-semibold text-gray-700 hover:text-gray-900
                       transition-colors duration-150 cursor-pointer
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 rounded-lg px-2 py-1"
          >
            Get the App
          </button>

          {/* Avatar + hamburger pill — opens account or drawer */}
          <button
            onClick={() => navigate({ to: accountTo })}
            className="flex items-center gap-2.5 border border-gray-300 rounded-full
                       pl-3 pr-2 py-1.5 cursor-pointer
                       hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-shadow duration-200
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
            aria-label={accountLabel}
          >
            {/* hamburger lines */}
            <Menu className="w-4 h-4 text-gray-600" strokeWidth={2} aria-hidden="true" />

            {/* avatar circle */}
            <span className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
              {avatarLetter
                ? <span className="text-sm font-bold text-white leading-none">{avatarLetter}</span>
                : <User className="w-4 h-4 text-white" strokeWidth={2} aria-hidden="true" />
              }
            </span>
          </button>
        </div>

        {/* ── MOBILE — hamburger ───────────────────────────────── */}
        <div className="lg:hidden justify-self-end self-center">
          <NavDrawer />
        </div>

      </div>
    </header>
  )
}
