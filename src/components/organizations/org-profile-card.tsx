import { Building2, Mail, MessageCircle, Phone, ShieldCheck } from 'lucide-react'
import type { BusinessHour } from '@/types/org.type'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { BusinessHoursRow } from './business-hours-row'

const DEFAULT_DESCRIPTION = 'Official lost and found intake and return point. We are committed to safeguarding belongings and returning them safely to their owners.'
const DEFAULT_LOCATION_NOTE = 'Floor 1, Reception Desk'

export function OrgProfileCard({ org }: {
  org: {
    name: string
    logoUrl: string | null
    coverImageUrl: string | null
    description: string | null
    status: string
    industryType: string
    displayAddress: string | null
    phone: string | null
    contactEmail: string | null
    locationNote: string | null
    businessHours: Array<BusinessHour> | null
    location: { latitude: number; longitude: number } | null
  }
}) {
  return (
    <div className="flex flex-col">

      {/* Cover photo */}
      <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden
                      bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700">
        {org.coverImageUrl && (
          <img
            src={org.coverImageUrl}
            alt={`Cover image of ${org.name}`}
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {!org.coverImageUrl && (
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>

      {/* Avatar */}
      <div className="flex justify-center -mt-9 relative z-10">
        <div className="w-20 h-20 rounded-full bg-white border-4 border-white
                        shadow-[0_4px_20px_rgba(0,0,0,0.15)]
                        flex items-center justify-center overflow-hidden shrink-0">
          {org.logoUrl
            ? <img src={org.logoUrl} alt={`Logo ${org.name}`} className="w-full h-full object-contain" />
            : <Building2 className="w-10 h-10 text-[#ccc]" aria-hidden="true" />}
        </div>
      </div>

      {/* Name + description */}
      <div className="text-center pt-3 px-2">
        <h1 className="text-2xl font-black text-[#111] tracking-tight leading-snug">
          {org.name}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 mt-2.5">
          <span className={`inline-flex items-center gap-1.5 text-sm font-semibold
            ${org.status === 'Active' ? 'text-emerald-700' : 'text-red-600'}`}>
            <span className={`w-2 h-2 rounded-full ${org.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
            {org.status === 'Active' ? 'Active' : 'Temporarily closed'}
          </span>
          {org.industryType && (
            <>
              <span className="text-[#999] font-bold">·</span>
              <span className="text-sm text-[#444] font-semibold">{org.industryType}</span>
            </>
          )}
          <span className="text-[#999] font-bold">·</span>
          <span className="inline-flex items-center gap-1 text-sm text-brand-600 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            Verified
          </span>
        </div>

        <p className="text-[15px] text-[#222] leading-relaxed mt-3 font-normal">
          {org.description ?? DEFAULT_DESCRIPTION}
        </p>
        <p className="text-sm text-[#555] font-medium mt-1.5">
          {org.locationNote ?? DEFAULT_LOCATION_NOTE}
        </p>
      </div>


      <div className="border-t border-[#D1D1D1] mt-5 mx-2" />

      {/* Contact info */}
      <div className="pt-4 px-2 space-y-4">
        <BusinessHoursRow hours={org.businessHours} />

        {org.phone && (
          <div className="flex items-start gap-3">
            <Phone className="w-4.5 h-4.5 text-[#555] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <a href={`tel:${org.phone}`} className="text-[15px] text-[#111] font-semibold hover:underline cursor-pointer">
                {org.phone}
              </a>
            </div>
          </div>
        )}

        {org.contactEmail && (
          <div className="flex items-start gap-3">
            <Mail className="w-4.5 h-4.5 text-[#555] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-[11px] font-bold text-[#888] uppercase tracking-widest mb-1">Email</p>
              <a href={`mailto:${org.contactEmail}`}
                className="text-[15px] text-brand-600 font-semibold hover:underline break-all cursor-pointer">
                {org.contactEmail}
              </a>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
