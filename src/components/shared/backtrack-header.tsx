import { useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  Building2,
  Menu,
  MessageCircle,
  PackageSearch,
  Sparkles,
  User,
} from 'lucide-react'
import { NavDrawer } from '@/components/shared/nav-drawer'
import { useAuth } from '@/hooks/use-auth'

/* ── nav link manifest ──────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Feed',       to: '/feed',       icon: PackageSearch },
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
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 h-16 sm:h-[72px] flex items-center justify-between gap-4">

        {/* ── LEFT — logo ───────────────────────────────────────── */}
        <button
          onClick={() => navigate({ to: '/' })}
          className="shrink-0 bg-transparent border-0 p-0 cursor-pointer
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 rounded-lg"
          aria-label="Go to homepage"
        >
          <WordmarkLogo />
        </button>

        {/* ── CENTER — tab nav (md+) ────────────────────────────── */}
        <nav
          className="hidden md:flex items-stretch justify-center flex-1"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map(({ label, to, icon: Icon }) => {
            const active = isActive(to)
            return (
              <button
                key={to}
                onClick={() => navigate({ to: to as string })}
                aria-current={active ? 'page' : undefined}
                className={[
                  'relative flex flex-col items-center justify-center gap-1 px-3 lg:px-5 h-16 sm:h-[72px] cursor-pointer',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400',
                  'transition-colors duration-150 group',
                  active ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900',
                ].join(' ')}
              >
                <span className="relative">
                  <Icon
                    className={[
                      'w-5 h-5 transition-colors duration-150',
                      active ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-700',
                    ].join(' ')}
                    strokeWidth={active ? 2.2 : 1.8}
                    aria-hidden="true"
                  />
                </span>

                <span
                  className={[
                    'text-[11px] lg:text-[12.5px] leading-none transition-all duration-150',
                    active ? 'font-bold text-gray-900' : 'font-medium text-gray-500 group-hover:text-gray-800',
                  ].join(' ')}
                >
                  {label}
                </span>

                {active && (
                  <span
                    className="absolute bottom-0 left-2 right-2 h-[2px] rounded-t-full bg-gray-900"
                    aria-hidden="true"
                  />
                )}
              </button>
            )
          })}
        </nav>

        {/* ── RIGHT — CTA + avatar pill (md+) ──────────────────── */}
        <div className="hidden md:flex items-center justify-end gap-2 lg:gap-3 shrink-0">

          {/* "Get the App" — hide on md to save space, show lg+ */}
          <button
            onClick={handleGetApp}
            className="hidden lg:block text-sm font-semibold text-gray-700 hover:text-gray-900
                       transition-colors duration-150 cursor-pointer
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 rounded-lg px-2 py-1"
          >
            Get the App
          </button>

          {/* Avatar + menu pill */}
          <button
            onClick={() => navigate({ to: accountTo })}
            className="flex items-center gap-2 border border-gray-300 rounded-full
                       pl-2.5 pr-1.5 py-1.5 cursor-pointer
                       hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-shadow duration-200
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
            aria-label={accountLabel}
          >
            <Menu className="w-4 h-4 text-gray-600" strokeWidth={2} aria-hidden="true" />
            <span className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
              {avatarLetter
                ? <span className="text-xs lg:text-sm font-bold text-white leading-none">{avatarLetter}</span>
                : <User className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-white" strokeWidth={2} aria-hidden="true" />
              }
            </span>
          </button>
        </div>

        {/* ── MOBILE — hamburger (below md) ────────────────────── */}
        <div className="md:hidden shrink-0">
          <NavDrawer />
        </div>

      </div>
    </header>
  )
}
