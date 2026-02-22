import { useNavigate } from '@tanstack/react-router'
import { NavDrawer } from '@/components/shared/nav-drawer'
import { BacktrackLogo } from '@/components/shared/backtrack-logo'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

const DESKTOP_NAV_LINKS = ['Premium Plan', 'Download', 'Support'] as const

export function BacktrackHeader() {
  const navigate = useNavigate()
  const { profile } = useAuth()

  return (
    <header className="bg-white sticky top-0 z-20 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-4 flex items-center justify-between gap-6">

        {/* Logo */}
        <button
          onClick={() => navigate({ to: '/' })}
          className="bg-transparent border-0 p-0 cursor-pointer shrink-0"
        >
          <BacktrackLogo width={120} height={28} />
        </button>

        {/* Desktop nav links */}
        <nav className="hidden lg:flex items-center gap-7 flex-1 justify-end">
          {DESKTOP_NAV_LINKS.map((link) => (
            <button
              key={link}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              {link}
            </button>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="w-px h-5 bg-gray-300" />
          {profile ? (
            <Button
              variant="ghost"
              className="text-gray-700 font-medium p-4"
              onClick={() => navigate({ to: '/account' })}
            >
              Account
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="text-gray-700 font-medium p-4"
              onClick={() => navigate({ to: '/sign-in' })}
            >
              Sign-in
            </Button>
          )}
        </div>

        {/* Mobile: hamburger only */}
        <div className="lg:hidden">
          <NavDrawer />
        </div>

      </div>
    </header>
  )
}
