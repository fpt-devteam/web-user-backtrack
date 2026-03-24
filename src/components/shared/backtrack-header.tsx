import { useNavigate } from '@tanstack/react-router'
import { NavDrawer } from '@/components/shared/nav-drawer'
import { useAuth } from '@/hooks/use-auth'

const DESKTOP_NAV_LINKS: { label: string; to: string }[] = [
  { label: 'Pricing', to: '/premium' },
  { label: 'Download', to: '/download' },
  { label: 'Support', to: '/support' },
]

/** Inline wordmark – no SVG file dependency, fully styleable */
function WordmarkLogo() {
  return (
    <span
      className="flex items-center gap-1.5 select-none"
      style={{ fontFamily: "'Plus Jakarta Sans', 'Montserrat', 'Poppins', system-ui, sans-serif" }}
    >
      {/* Small icon mark */}
      <span
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: 'linear-gradient(135deg,#4F46E5,#6366F1)' }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path
            d="M7 1.5 L12 4.5 L12 9.5 L7 12.5 L2 9.5 L2 4.5 Z"
            stroke="white" strokeWidth="1.4" strokeLinejoin="round" fill="none"
          />
          <circle cx="7" cy="7" r="2" fill="white" />
        </svg>
      </span>
      {/* Text: "back" dark + "track" indigo accent */}
      <span className="text-[17px] font-black tracking-tight leading-none text-[#111]">
        back<span style={{ color: '#6366F1' }}>track</span>
      </span>
    </span>
  )
}

export function BacktrackHeader() {
  const navigate = useNavigate()
  const { profile } = useAuth()

  return (
    <header
      className="sticky top-0 z-20 backdrop-blur-md"
      style={{ backgroundColor: 'rgba(248,247,244,0.88)', borderBottom: '1px solid rgba(0,0,0,0.07)' }}
    >
      <div className="max-w-screen-xl mx-auto px-5 lg:px-10 py-3 grid grid-cols-3 items-center gap-4">

        {/* LEFT — Logo */}
        <button
          onClick={() => navigate({ to: '/' })}
          className="bg-transparent border-0 p-0 cursor-pointer justify-self-start"
        >
          <WordmarkLogo />
        </button>

        {/* CENTER — Nav links */}
        <nav className="hidden lg:flex items-center justify-center gap-1">
          {DESKTOP_NAV_LINKS.map(({ label, to }) => (
            <button
              key={label}
              onClick={() => navigate({ to })}
              className="relative px-4 py-2 text-sm font-semibold text-[#4B5563] hover:text-[#111] transition-colors duration-200 rounded-lg group"
            >
              {label}
              <span className="absolute bottom-1 left-4 right-4 h-[1.5px] bg-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full" />
            </button>
          ))}
        </nav>

        {/* RIGHT — Auth actions */}
        <div className="hidden lg:flex items-center justify-end gap-2">
          {/* Log in — ghost text */}
          <button
            onClick={() => navigate({ to: profile ? '/account' : '/sign-in' })}
            className="px-4 py-2 text-sm font-semibold text-[#4B5563] hover:text-[#111] transition-colors duration-200 rounded-lg"
          >
            {profile ? 'Account' : 'Log in'}
          </button>

          {/* Get the App — solid CTA */}
          <button
            onClick={() => navigate({ to: '/download' })}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white rounded-full transition-all duration-200 hover:-translate-y-px hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95"
            style={{ background: 'var(--btn-dark-gradient)' }}
          >
            Get the App
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M2.5 6H9.5M6.5 3L9.5 6L6.5 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Mobile: hamburger */}
        <div className="lg:hidden justify-self-end">
          <NavDrawer />
        </div>

      </div>
    </header>
  )
}
