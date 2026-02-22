import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import type { UserProfile } from '@/types/user.type'

interface ProfileHeaderProps {
  profile: UserProfile
  onLogout?: () => void
}

function getInitials(displayName?: string | null, email?: string | null): string {
  if (displayName) {
    return displayName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  if (email) return email[0].toUpperCase()
  return 'U'
}

export function ProfileHeader({ profile, onLogout }: Readonly<ProfileHeaderProps>) {
  const initials = getInitials(profile.displayName, profile.email)
  const displayName = profile.displayName ?? profile.email ?? 'User'
  const roleLabel = profile.globalRole === 'PlatformSuperAdmin' ? 'Admin' : 'Standard Member'

  return (
    <div className="bg-white rounded-3xl px-6 py-8 flex flex-col items-center gap-4">
      {/* Avatar */}
      <div className="relative">
        <Avatar className="w-24 h-24 border-4 border-white shadow-md">
          <AvatarImage src={undefined} alt={displayName} />
          <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white" />
      </div>

      {/* Info */}
      <div className="text-center w-full">
        <h2 className="text-xl font-bold text-gray-900 truncate">{displayName}</h2>
        {profile.email && (
          <p className="text-sm text-gray-500 mt-0.5 truncate">{profile.email}</p>
        )}
        <Badge
          variant="secondary"
          className="mt-2 bg-blue-50 text-blue-600 hover:bg-blue-50 font-medium"
        >
          {roleLabel}
        </Badge>
      </div>

      {/* Sign out – visible in sidebar on desktop, hidden on mobile (shown in menu instead) */}
      {onLogout && (
        <Button
          variant="ghost"
          onClick={onLogout}
          className="hidden lg:flex w-full gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-2xl h-11 font-semibold mt-1"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      )}
    </div>
  )
}
