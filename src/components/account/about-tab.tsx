import type { UserProfile } from '@/types/user.type'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface AboutTabProps {
  profile: UserProfile
  initials: string
  displayName: string
  roleLabel: string
  onGoToSettings: () => void
}

export function AboutTab({ profile, initials, displayName, roleLabel, onGoToSettings }: AboutTabProps) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-[1.75rem] font-extrabold text-[#222] tracking-tight">
          About me
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row gap-8 border border-[#DDDDDD] rounded-2xl
                      shadow-[0_2px_10px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="flex flex-col items-center justify-center gap-3 sm:w-56 shrink-0
                        bg-white px-8 py-8 border-b sm:border-b-0 sm:border-r border-[#EBEBEB]">
          <Avatar className="w-20 h-20 border-2 border-[#E5E7EB] shadow">
            <AvatarImage src={profile.avatarUrl ?? undefined} />
            <AvatarFallback className="bg-[#222] text-white text-2xl font-black">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="text-lg font-bold text-[#111] leading-tight">{displayName}</p>
            <p className="text-sm text-[#888] mt-0.5">{roleLabel}</p>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3 px-7 py-8">
          <p className="text-xl font-extrabold text-[#111] tracking-tight leading-snug">
            Complete your profile
          </p>
          <p className="text-[15px] text-[#666] leading-relaxed max-w-sm">
            Your Backtrack profile is used when returning items and chatting with organisations.
            Complete yours to help others verify your identity.
          </p>
          <button
            onClick={onGoToSettings}
            className="self-start mt-1 px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-hover
                       text-white text-sm font-bold transition-colors duration-150 cursor-pointer"
          >
            Get started
          </button>
        </div>
      </div>

      <div className="h-px bg-[#EBEBEB] my-8" />

      <div className="space-y-6">
        <AboutRow label="Email" value={profile.email ?? '—'} />
        <div className="h-px bg-[#F3F4F6]" />
        <AboutRow label="Phone" value={profile.phone ?? '—'} />
        <div className="h-px bg-[#F3F4F6]" />
        <AboutRow label="Role"  value={roleLabel}            />
      </div>
    </section>
  )
}

function AboutRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold text-[#888] uppercase tracking-widest mb-1">{label}</p>
      <p className="text-[15px] font-semibold text-[#111]">{value}</p>
    </div>
  )
}
