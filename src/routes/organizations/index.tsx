import { Link, createFileRoute } from '@tanstack/react-router'
import { Building2, MapPin, Search, ShieldCheck, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { Org } from '@/types/org.type'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetOrgs } from '@/hooks/use-org'

export const Route = createFileRoute('/organizations/')({
  component: OrgListPage,
})


/* ─── page ─── */
function OrgListPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useGetOrgs()
  const [query, setQuery] = useState('')

  const orgs: Array<Org> = data?.pages.flatMap((p) => p.items) ?? []

  const filtered = useMemo(() => {
    let list = orgs
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.displayAddress?.toLowerCase().includes(q),
      )
    }
    return list
  }, [orgs, query])

  // Group organizations by industry
  const orgsByIndustry = useMemo(() => {
    const groups: Record<string, Array<Org>> = {}
    filtered.forEach((org) => {
      const industry = org.industryType || 'Other'
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!groups[industry]) {
        groups[industry] = []
      }
      groups[industry].push(org)
    })
    return groups
  }, [filtered])

  const industries = Object.keys(orgsByIndustry).sort()

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero Header ── */}
      {/* pb-10 gives space for the fade overlay to dissolve into the page bg */}
      <div className="relative bg-white overflow-hidden">
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
        {/* Brand glow top-left */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-brand-100/40 rounded-full blur-3xl pointer-events-none" />
        {/* Cyan glow bottom-right */}
        <div className="absolute -bottom-16 -right-8 w-64 h-64 bg-brand-50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-screen-xl mx-auto px-5 pt-10 pb-12">
          {/* Eyebrow */}
          <p className="text-[10px] font-bold tracking-[0.18em] text-brand-600 uppercase mb-3 flex items-center justify-center gap-2">
            <span className="inline-block w-4 h-px bg-brand-200" />
            Backtrack Network
            <span className="inline-block w-4 h-px bg-brand-200" />
          </p>

          {/* Title row - Centered */}
          <div className="text-center">
            <div>
              <h1 className="text-[2.2rem] sm:text-[2.6rem] font-black text-[#111827] leading-[1.05] tracking-tight">
                SafeDrop{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-500">
                    Centres
                  </span>
                  <span className="absolute inset-x-0 bottom-0.5 h-[6px] bg-brand-100 -z-[1] rounded-sm" />
                </span>
              </h1>
              <p className="text-sm text-[#6B6B6B] mt-2 font-medium">
                {isLoading ? (
                  <span className="inline-block w-24 h-4 bg-[#f0f0f0] rounded animate-pulse" />
                ) : (
                  <>{filtered.length} location{filtered.length !== 1 ? 's' : ''} · Drop off &amp; pick up</>
                )}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mt-8 max-w-3xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bbb] pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or location…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-[#f5f5f5] rounded-full pl-10 pr-10 py-2.5 text-sm font-medium text-[#111] placeholder:text-[#bbb] outline-none focus:ring-2 focus:ring-gray-200 border border-transparent focus:border-gray-200 transition-all duration-200"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-[#ddd] hover:bg-[#ccc] transition-colors cursor-pointer"
              >
                <X className="w-3 h-3 text-[#555]" />
              </button>
            )}
          </div>

          {/* Industry navigation chips - Centered */}
          {!isLoading && industries.length > 0 && (
            <div className="flex justify-center gap-2 mt-6 flex-wrap max-w-4xl mx-auto">
              {industries.map((ind) => (
                <button
                  key={ind}
                  onClick={() => {
                    const element = document.getElementById(`industry-${ind}`)
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                  }}
                  className="px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer border bg-white text-[#555] border-[#e5e5e5] hover:border-[#999]"
                >
                  {ind}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Fade-out overlay: dissolves hero bg into page bg (#F8F7F4) ── */}
        <div
          className="absolute bottom-0 inset-x-0 h-20 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent, #ffffff)',
          }}
        />
      </div>

      {/* ── Industry Sections — Each industry gets its own row ── */}
      <div className="max-w-screen-xl mx-auto px-4 -mt-4 pt-8 pb-14 space-y-12">
        {isLoading ? (
          <div>
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-none">
              {Array.from({ length: 6 }).map((_, i) => <OrgSkeleton key={i} />)}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState hasQuery={!!query} onReset={() => setQuery('')} />
        ) : (
          <>
            {industries.map((industry) => {
              const industryOrgs = orgsByIndustry[industry]

              return (
                <div key={industry} id={`industry-${industry}`} className="space-y-4 scroll-mt-32">
                  {/* Industry Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-sm font-bold bg-white text-[#555] border border-[#e5e5e5]">
                        {industry}
                      </span>
                      <span className="text-[#717171] text-sm">→</span>
                    </div>
                  </div>

                  {/* Horizontal scrolling cards for this industry */}
                  <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none">
                    {industryOrgs.map((org, i) => (
                      <Link
                        key={org.id}
                        to="/organizations/$slug"
                        params={{ slug: org.slug }}
                        className="group block shrink-0 w-[280px] sm:w-[320px] snap-start"
                        style={{ animationDelay: `${Math.min(i * 40, 320)}ms` }}
                      >
                        <OrgCard org={org} />
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}

            {/* Load more */}
            {hasNextPage && !query && (
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="mt-8 w-full py-3.5 text-sm font-bold text-[#111] rounded-2xl border-2 border-[#e5e7eb] hover:border-[#111] hover:bg-[#111] hover:text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed tracking-tight bg-white cursor-pointer"
              >
                {isFetchingNextPage ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Loading…
                  </span>
                ) : (
                  'Load more'
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   OrgCard — v2
   • Uses coverImageUrl for hero, logoUrl for avatar
   • Gradient + blur overlay on cover
   • Industry tag with color-coded style
   • Status dot for Active/Inactive
   • Hover: lift + deeper shadow + cyan accent
───────────────────────────────────────────── */
function OrgCard({ org }: { org: Org }) {
  const hasCover = !!org.coverImageUrl
  const hasLogo = !!org.logoUrl
  const isActive = org.status === 'Active'

  return (
    <div className="group block cursor-pointer">
      {/* ── Image with heart ── */}
      <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-gradient-to-br from-[#f3f4f6] to-[#e9ebee] mb-3">
        {hasCover ? (
          <img
            src={org.coverImageUrl!}
            alt={org.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        ) : hasLogo ? (
          <img
            src={org.logoUrl!}
            alt={org.name}
            className="w-full h-full object-cover opacity-20 blur-xs scale-110"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Building2 className="w-16 h-16 text-[#d1d5db]" />
          </div>
        )}

        {/* Gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

        {/* Heart icon - top right */}
        <button
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 hover:bg-white backdrop-blur-sm shadow-sm transition-all duration-200 group-hover:scale-110"
          aria-label="Add to favorites"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          <svg className="w-4 h-4 text-[#222] fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Status badge - bottom left */}
        <div className="absolute bottom-3 left-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
            isActive 
              ? 'bg-emerald-500/90 text-white' 
              : 'bg-gray-500/90 text-white'
          } backdrop-blur-sm`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-gray-200'}`} />
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* ── Content below image ── */}
      <div className="space-y-1">
        {/* Name and verified icon */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-[15px] text-[#222] line-clamp-1 group-hover:underline">
            {org.name}
          </h3>
          <ShieldCheck className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
        </div>

        {/* Industry type */}
        {/* {org.industryType && (
          <p className="text-sm text-[#717171]">
            {org.industryType}
          </p>
        )} */}

        {/* Address */}
        {org.displayAddress && (
          <p className="text-sm text-[#717171] line-clamp-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {org.displayAddress}
          </p>
        )}

        {/* Stats - mimicking the price/rating style */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-sm text-[#222] font-medium">
            120 items received
          </span>
          <span className="text-[#717171]">·</span>
          <span className="text-sm text-[#222] font-medium flex items-center gap-1">
            ★ 4.95
          </span>
        </div>
      </div>
    </div>
  )
}

/* ── Empty state ── */
function EmptyState({ hasQuery, onReset }: { hasQuery: boolean; onReset: () => void }) {
  return (
    <div className="text-center py-24 flex flex-col items-center">
      {/* Decorative icon */}
      <div className="w-20 h-20 rounded-3xl bg-[#f3f4f6] flex items-center justify-center mb-5 shadow-inner">
        <Building2 className="w-9 h-9 text-[#d1d5db]" />
      </div>
      <p className="font-black text-[#111] text-lg">No centres found</p>
      <p className="text-sm text-[#aaa] mt-1 font-medium max-w-xs">
        {hasQuery ? 'Try a different search term or filter.' : 'No drop centres available yet.'}
      </p>
      {hasQuery && (
        <button
          onClick={onReset}
          className="mt-5 px-5 py-2 rounded-xl bg-[#111] text-white text-sm font-bold hover:bg-[#333] transition-colors duration-150 cursor-pointer"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}

/* ── Skeleton ── */
function OrgSkeleton() {
  return (
    <div className="shrink-0 w-[280px] sm:w-[320px]">
      {/* Image */}
      <Skeleton className="h-64 sm:h-72 w-full rounded-2xl mb-3" />
      {/* Content */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-3.5 w-1/2 rounded" />
        <Skeleton className="h-3.5 w-full rounded" />
        <Skeleton className="h-3.5 w-2/3 rounded" />
      </div>
    </div>
  )
}
