import { useNavigate } from '@tanstack/react-router'
import { NavDrawer } from '@/components/shared/nav-drawer'
import { BacktrackLogo } from '@/components/shared/backtrack-logo'
import { useAuth } from '@/hooks/use-auth'

const DESKTOP_NAV_LINKS: { label: string; to: string }[] = [
  { label: 'Pricing', to: '/premium' },
  { label: 'Download', to: '/download' },
  { label: 'Support', to: '/support' },
]

export function BacktrackHeader() {
  const navigate = useNavigate()
  const { profile } = useAuth()

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-4 flex items-center justify-between gap-6">

        {/* Logo */}
        <button
          onClick={() => navigate({ to: '/' })}
          className="bg-transparent border-0 p-0 cursor-pointer shrink-0"
        >
          <BacktrackLogo width={120} height={28} />
        </button>

        {/* Desktop nav links */}
        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-end">
          {DESKTOP_NAV_LINKS.map(({ label, to }) => (
            <button
              key={label}
              onClick={() => navigate({ to })}
              className="relative px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200 rounded-lg group"
            >
              {label}
              {/* Animated underline */}
              <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full" />
            </button>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="w-px h-5 bg-gray-300" />
          <button
            onClick={() => navigate({ to: profile ? '/account' : '/sign-in' })}
            className="relative px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200 rounded-lg group"
          >
            {profile ? 'Account' : 'Sign-in'}
            <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full" />
          </button>
        </div>

        {/* Mobile: hamburger only */}
        <div className="lg:hidden">
          <NavDrawer />
        </div>

      </div>
    </header>
  )
}
