import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogOut, ShieldCheck } from 'lucide-react'
import type { UserProfile } from '@/types/user.type'

interface ProfileHeaderProps {
  profile: UserProfile
  onLogout?: () => void
}

function getInitials(displayName?: string | null, email?: string | null): string {
  if (displayName) {
    return displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
  }
  if (email) return email[0].toUpperCase()
  return 'U'
}

export function ProfileHeader({ profile, onLogout }: Readonly<ProfileHeaderProps>) {
  const initials    = getInitials(profile.displayName, profile.email)
  const displayName = profile.displayName ?? profile.email ?? 'User'
  const isAdmin     = profile.globalRole === 'PlatformSuperAdmin'

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0c0c0c] text-white">
      {/* dot-grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      {/* brand glow */}
      <div className="pointer-events-none absolute -top-20 -left-20 w-64 h-64 rounded-full bg-brand-500/20 blur-[80px]" />

      <div className="relative z-10 px-6 py-8 flex flex-col items-center gap-4">
        {/* Avatar */}
        <div className="relative">
          <Avatar className="w-20 h-20 border-4 border-white/10 ring-1 ring-white/10">
            <AvatarImage src={undefined} alt={displayName} />
            <AvatarFallback className="bg-brand-600 text-white text-xl font-black">
              {initials}
            </AvatarFallback>
          </Avatar>
          {/* online dot */}
          <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#22C55E] border-2 border-[#0c0c0c]" />
        </div>

        {/* Name + email */}
        <div className="text-center w-full">
          <h2 className="text-lg font-black text-white tracking-tight truncate">{displayName}</h2>
          {profile.email && (
            <p className="text-xs text-white/40 mt-0.5 truncate font-medium">{profile.email}</p>
          )}
        </div>

        {/* Role badge */}
        <span className={[
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold',
          isAdmin
            ? 'bg-amber-400/15 text-amber-300 border border-amber-400/25'
            : 'bg-white/8 text-white/60 border border-white/10',
        ].join(' ')}>
          <ShieldCheck className="w-3.5 h-3.5" />
          {isAdmin ? 'Admin' : 'Standard Member'}
        </span>

        {/* Sign out — desktop only */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="hidden lg:flex w-full items-center justify-center gap-2 h-10 rounded-xl
                       border border-white/10 text-white/50 hover:text-white hover:border-white/25
                       text-sm font-semibold transition-all duration-150 cursor-pointer mt-1"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        )}
      </div>
    </div>
  )
}
