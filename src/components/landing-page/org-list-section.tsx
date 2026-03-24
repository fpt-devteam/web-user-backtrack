import { Link } from '@tanstack/react-router'
import { useGetOrgs } from '@/hooks/use-org'
import { Building2, ChevronRight } from 'lucide-react'
import { useRef } from 'react'

export function OrgListSection() {
  const { data, isLoading } = useGetOrgs()
  const orgs = data?.pages.flatMap((p) => p.items) ?? []
  const items = [...orgs, ...orgs]

  return (
    <section className="py-16 min-h-screen flex flex-col items-center justify-center gap-12"
      style={{ backgroundColor: 'var(--background)', borderTop: '1px solid #E8E8E4', borderBottom: '1px solid #E8E8E4' }}>

      {/* Big heading */}
      <div className="px-6 text-center space-y-3">
        <p className="text-sm font-bold text-[#bbb] uppercase tracking-[0.25em]">Trusted SafeDrop Centres</p>
        <h2 className="text-3xl lg:text-5xl font-black text-[#111] tracking-tight">
          A global network of{' '}
          <span
            style={{
              backgroundImage: 'linear-gradient(135deg,#4F46E5,#6366F1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            safe drop
          </span>
          {' '}partners
        </h2>
        <p className="text-[#888] text-base lg:text-md max-w-lg mx-auto leading-relaxed">
          Drop off or pick up lost items at thousands of verified partner locations worldwide.
        </p>
      </div>

      {/* Marquee rows */}
      <div className="w-full space-y-6">

        {/* Row 2 — right to left */}
        <div
          className="overflow-hidden w-full"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          }}
        >
          {isLoading ? <MarqueeSkeleton /> : <MarqueeTrack orgs={[...items].reverse()} reverse />}
        </div>
      </div>

      {/* View all link */}
      <Link
        to="/organizations"
        className="flex items-center gap-2 text-base font-bold transition-all duration-200 rounded-full px-8 py-3.5 border-2"
        style={{
          color: '#4F46E5',
          borderColor: '#4F46E5',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#4F46E5'
          e.currentTarget.style.color = '#fff'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.color = '#4F46E5'
        }}
      >
        View all partners
        <ChevronRight className="w-4 h-4" />
      </Link>
    </section>
  )
}

function MarqueeTrack({ orgs, reverse }: { orgs: any[]; reverse?: boolean }) {
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
      className={`flex items-center gap-16 w-max py-3 ${reverse
        ? 'animate-[marquee-reverse_30s_linear_infinite]'
        : 'animate-[marquee_25s_linear_infinite]'
        }`}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      {orgs.map((org, i) => (
        <Link
          key={`${org.id}-${i}`}
          to="/chat/new/$orgId"
          params={{ orgId: org.id }}
          className="flex flex-col items-center gap-2 group shrink-0 w-72"
        >
          {org.logoUrl ? (
            <img
              src={org.logoUrl}
              alt={org.name}
              className="w-72 h-72 rounded-2xl object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-200"
            />
          ) : (
            <div className="w-72 h-72 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#E8E8E4' }}>
              <Building2 className="w-8 h-8 text-[#ccc] group-hover:text-indigo-400 transition-colors duration-200" />
            </div>
          )}
          <span className="text-xs font-semibold text-[#aaa] group-hover:text-[#444] transition-colors duration-200 text-center leading-tight break-words w-full">
            {org.name}
          </span>
        </Link>
      ))}
    </div>
  )
}

function MarqueeSkeleton() {
  return (
    <div className="flex items-center gap-14 w-max px-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl animate-pulse" style={{ backgroundColor: '#E8E8E4' }} />
          <div
            className="h-7 rounded animate-pulse"
            style={{ width: `${100 + (i % 3) * 30}px`, backgroundColor: '#E8E8E4' }}
          />
        </div>
      ))}
    </div>
  )
}