import { Link } from '@tanstack/react-router'
import { useGetOrgs } from '@/hooks/use-org'
import { Building2, ChevronRight } from 'lucide-react'
import { useRef } from 'react'

export function OrgListSection() {
  const { data, isLoading } = useGetOrgs()
  const orgs = data?.pages.flatMap((p) => p.items) ?? []
  const items = [...orgs, ...orgs]

  return (
    <section className="py-10 border-y border-[#f0f0f0]">
      {/* Heading + link */}
      <div className="flex items-center justify-between px-6 mb-8">
        <p className="text-xs font-semibold text-[#bbb] uppercase tracking-[0.2em]">
          Trusted SafeDrop Centres
        </p>
        <Link
          to="/organizations"
          className="flex items-center gap-1.5 text-xs font-bold text-[#0099BB] hover:text-[#007A99] transition-colors duration-200"
        >
          View all
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Marquee */}
      <div
        className="overflow-hidden w-full"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
      >
        {isLoading ? <MarqueeSkeleton /> : <MarqueeTrack orgs={items} />}
      </div>
    </section>
  )
}

function MarqueeTrack({ orgs }: { orgs: any[] }) {
  const trackRef = useRef<HTMLDivElement>(null)

  const pause = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = 'paused'
  }
  const resume = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = 'running'
  }

  return (
    <div
      ref={trackRef}
      className="flex items-center gap-16 w-max animate-[marquee_25s_linear_infinite] py-2"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      {orgs.map((org, i) => (
        <Link
          key={`${org.id}-${i}`}
          to="/chat/new/$orgId"
          params={{ orgId: org.id }}
          className="flex items-center gap-3 group shrink-0"
        >
          <Building2 className="w-6 h-6 text-[#ccc] group-hover:text-[#888] transition-colors duration-200 shrink-0" />
          <span className="text-xl font-bold text-[#bbb] group-hover:text-[#444] transition-colors duration-200 whitespace-nowrap">
            {org.name}
          </span>
        </Link>
      ))}
    </div>
  )
}

function MarqueeSkeleton() {
  return (
    <div className="flex items-center gap-12 w-max px-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2 shrink-0">
          <div className="w-6 h-6 rounded bg-[#ebebeb] animate-pulse" />
          <div
            className="h-5 rounded bg-[#ebebeb] animate-pulse"
            style={{ width: `${80 + (i % 3) * 24}px` }}
          />
        </div>
      ))}
    </div>
  )
}