import { MapPin } from 'lucide-react'

export function LocationSection({ org }: {
  org: {
    displayAddress: string | null
    location: { latitude: number; longitude: number } | null
  }
}) {
  if (!org.displayAddress && !org.location) return null
  return (
    <div className="bg-white rounded-2xl border border-[#DDDDDD] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)] mt-3">
      <div className="px-5 pt-5 pb-4">
        <h3 className="text-base font-black text-[#111]">Getting here</h3>
        {org.displayAddress && (
          <p className="text-sm text-[#555] mt-1 leading-relaxed flex items-start gap-2">
            <MapPin className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" aria-hidden="true" />
            {org.displayAddress}
          </p>
        )}
      </div>
      {org.location && (
        <div className="relative h-56 overflow-hidden">
          <iframe
            title="Location map"
            aria-hidden="true"
            width="100%" height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${org.location.latitude},${org.location.longitude}&z=16&output=embed`}
          />
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${org.location.latitude},${org.location.longitude}`}
            target="_blank" rel="noreferrer"
            className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white text-[11px] font-bold
                       text-[#111] px-3 py-1.5 rounded-xl shadow-md hover:bg-[#f5f5f5] transition-colors cursor-pointer"
          >
            <MapPin className="w-3 h-3 text-brand-primary" />
            View map
          </a>
        </div>
      )}
    </div>
  )
}
