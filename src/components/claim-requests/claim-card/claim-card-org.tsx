import { Building2 } from 'lucide-react'

interface ClaimCardOrgProps {
  name?: string | null
  logoUrl?: string | null
}

/** Footer row showing which organization is handling the claim. */
export function ClaimCardOrg({ name, logoUrl }: ClaimCardOrgProps) {
  if (!name) {
    return (
      <div className="flex items-center gap-2 text-[#9CA3AF]">
        <Building2 className="w-5 h-5 shrink-0" />
        <span className="text-[13px]">Awaiting organization</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 min-w-0">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={name}
          className="w-5 h-5 rounded-full object-contain border border-[#E5E7EB] shrink-0"
        />
      ) : (
        <span className="w-5 h-5 rounded-full bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center shrink-0">
          <Building2 className="w-3 h-3 text-[#9CA3AF]" />
        </span>
      )}
      <span className="text-[13px] text-[#6B7280] truncate">
        Handled by <span className="font-semibold text-[#111]">{name}</span>
      </span>
    </div>
  )
}
