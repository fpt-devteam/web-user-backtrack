import { createFileRoute, Link } from '@tanstack/react-router'
import { useGetOrgs } from '@/hooks/use-org'
import { Skeleton } from '@/components/ui/skeleton'
import { MapPin, Search, ArrowUpRight } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/organizations/')({
  component: OrgListPage,
})

const COVER_GRADIENTS = [
  'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
  'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
  'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
  'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
  'linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%)',
  'linear-gradient(135deg, #e0f2fe 0%, #c7d2fe 100%)',
]

const BADGE_ACCENT = [
  'bg-cyan-100 text-cyan-700',
  'bg-violet-100 text-violet-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-sky-100 text-sky-700',
]

function OrgListPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useGetOrgs()
  const [query, setQuery] = useState('')

  const orgs = data?.pages.flatMap((p) => p.items) ?? []
  const filtered = query.trim()
    ? orgs.filter(
      (o) =>
        o.name.toLowerCase().includes(query.toLowerCase()) ||
        o.displayAddress?.toLowerCase().includes(query.toLowerCase()),
    )
    : orgs

  return (
    <div className="min-h-screen bg-[#FAFAFA]">

      {/* ── Header ── */}
      <div className="bg-white px-5 pt-10 pb-6 border-b border-[#f0f0f0]">
        <p className="text-[10px] font-bold tracking-[0.25em] text-[#bbb] uppercase mb-3">
          Backtrack Network
        </p>
        <h1 className="text-[2.4rem] font-black text-[#111] leading-none tracking-tighter">
          SafeDrop <span className="text-[#111]">Centres</span>
        </h1>
        <p className="text-sm text-[#aaa] mt-2 font-medium">
          {isLoading ? '—' : `${filtered.length} locations`} · Drop off &amp; pick up
        </p>

        {/* Search */}
        <div className="relative mt-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aaa]" />
          <input
            type="text"
            placeholder="Search by name or area…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white border border-[#e5e7eb] rounded-full pl-11 pr-4 py-3 text-sm font-medium text-[#111] placeholder:text-[#bbb] outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400/50 transition-all duration-200 shadow-sm"
          />
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-screen-xl mx-auto px-4 pt-6 pb-12">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <OrgSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((org, i) => (
                <Link
                  key={org.id}
                  to="/organizations/$id"
                  params={{ id: org.id }}
                  className="group block"
                >
                  <div className="bg-white rounded-2xl border border-[#efefef] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/8 hover:border-transparent">

                    {/* Cover — logo fills area */}
                    <div
                      className="relative h-32 rounded-t-2xl overflow-hidden flex items-center justify-center p-6"
                      style={{ background: COVER_GRADIENTS[i % COVER_GRADIENTS.length] }}
                    >
                      <img
                        src={org.logoUrl ?? '/org-default.png'}
                        alt={org.name}
                        className="w-full h-full object-contain"
                      />
                      {org.industryType && (
                        <span className={`absolute top-2.5 left-2.5 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${BADGE_ACCENT[i % BADGE_ACCENT.length]}`}>
                          {org.industryType}
                        </span>
                      )}
                      <ArrowUpRight className="absolute top-2.5 right-2.5 w-3.5 h-3.5 text-black/20 group-hover:text-black/50 transition-colors duration-200" />
                    </div>

                    {/* Text */}
                    <div className="px-4 py-3 min-w-0">
                      <p className="font-black text-[#111] text-sm leading-snug line-clamp-2 group-hover:text-cyan-700 transition-colors duration-200">
                        {org.name}
                      </p>
                      {org.displayAddress && (
                        <p className="text-[11px] text-[#6B7280] flex items-start gap-1 mt-1.5 font-medium line-clamp-1">
                          <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
                          {org.displayAddress}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load more */}
            {hasNextPage && !query && (
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="mt-6 w-full py-4 text-sm font-black text-[#111] rounded-2xl border-2 border-[#e5e7eb] hover:border-[#111] hover:bg-[#111] hover:text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed tracking-tight bg-white"
              >
                {isFetchingNextPage ? 'Loading…' : 'Load more →'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-24">
      <p className="text-6xl font-black text-[#f0f0f0] tracking-tighter">0</p>
      <p className="font-black text-[#111] text-lg mt-2">No results</p>
      <p className="text-sm text-[#aaa] mt-1 font-medium">Try a different search term</p>
    </div>
  )
}

function OrgSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#efefef]">
      <Skeleton className="h-32 w-full rounded-t-2xl rounded-b-none" />
      <div className="px-4 py-3 space-y-1.5">
        <Skeleton className="h-4 w-3/4 rounded-lg" />
        <Skeleton className="h-3 w-1/2 rounded-full" />
      </div>
    </div>
  )
}
