import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { BacktrackHeader } from '@/components/shared/backtrack-header'
import { ProfileHeader } from '@/components/account/profile-header'
import { AccountMenu } from '@/components/account/account-menu'
import { useAuth } from '@/hooks/use-auth'

export const Route = createFileRoute('/account/')({
  component: AccountPage,
})

function AccountPage() {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/' })
  }

  if (!profile) {
    navigate({ to: '/' })
    return null
  }

  return (
    <div className="min-h-screen">
      <BacktrackHeader />
      <main className="max-w-5xl mx-auto px-5 py-6 lg:py-10 lg:px-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-8">

          {/* Left – profile card (sticky on desktop) */}
          <div className="lg:w-72 lg:shrink-0 lg:sticky lg:top-24">
            <ProfileHeader profile={profile} onLogout={handleLogout} />
          </div>

          {/* Right – menu sections */}
          <div className="flex-1 min-w-0">
            <AccountMenu onLogout={handleLogout} />
          </div>

        </div>
      </main>
    </div>
  )
}
