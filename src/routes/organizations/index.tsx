import { createFileRoute, Link } from '@tanstack/react-router'
import { useGetOrgs } from '@/hooks/use-org'
import { Skeleton } from '@/components/ui/skeleton'
import { MapPin, Search, ArrowUpRight } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/organizations/')({
  component: OrgListPage,
})

const ACCENT = [
  { num: 'bg-[#00D2FE]/10 text-[#0099BB]', hover: 'hover:border-[#00D2FE]/50 hover:bg-[#00D2FE]/5' },
  { num: 'bg-violet-100 text-violet-500', hover: 'hover:border-violet-200 hover:bg-violet-50/50' },
  { num: 'bg-emerald-100 text-emerald-600', hover: 'hover:border-emerald-200 hover:bg-emerald-50/50' },
  { num: 'bg-amber-100 text-amber-600', hover: 'hover:border-amber-200 hover:bg-amber-50/50' },
  { num: 'bg-rose-100 text-rose-500', hover: 'hover:border-rose-200 hover:bg-rose-50/50' },
  { num: 'bg-sky-100 text-sky-600', hover: 'hover:border-sky-200 hover:bg-sky-50/50' },
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
    <div className="min-h-screen bg-white">

      {/* ── Hero header ── */}
      <div className="px-5 pt-10 pb-6 border-b border-[#f0f0f0]">
        <p className="text-[10px] font-bold tracking-[0.25em] text-[#bbb] uppercase mb-3">
          Backtrack Network
        </p>
        <h1 className="text-[2.6rem] font-black text-[#111] leading-none tracking-tighter">
          SafeDrop
          <span className="text-[#00D2FE]">  Centres</span>
        </h1>
        <p className="text-sm text-[#aaa] mt-3 font-medium">
          {isLoading ? '—' : `${filtered.length} locations`} · Drop off & pick up
        </p>

        {/* Search */}
        <div className="relative mt-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ccc]" />
          <input
            type="text"
            placeholder="Search by name or area…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#F5F5F5] rounded-2xl pl-10 pr-4 py-3 text-sm font-medium text-[#111] placeholder:text-[#ccc] outline-none focus:ring-2 focus:ring-[#00D2FE]/30 transition-all duration-200"
          />
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="px-4 pt-5 pb-10">
        {isLoading ? (
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, i) => <OrgSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2">
              {filtered.map((org, i) => {
                const a = ACCENT[i % ACCENT.length]
                return (
                  <Link
                    key={org.id}
                    to="/org/$id"
                    params={{ id: org.id }}
                    className="group block"
                  >
                    <div className={`
                      bg-white rounded-3xl border border-[#efefef] overflow-hidden
                      transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
                      ${a.hover}
                    `}>
                      {/* Logo zone — square, centred, padded */}
                      <div className="relative aspect-square bg-[#F8F8F8] flex items-center justify-center p-5">
                        <img
                          src={org.logoUrl ?? '/org-default.png'}
                          alt={org.name}
                          className="w-full h-full object-contain"
                        />
                        <ArrowUpRight className="absolute top-3 right-3 w-4 h-4 text-[#ccc] group-hover:text-[#111] transition-colors duration-200" />
                      </div>

                      {/* Text strip */}
                      <div className="px-3 py-2.5 border-t border-[#f0f0f0] min-w-0">
                        {org.industryType && (
                          <p className="text-[9px] font-bold text-[#bbb] uppercase tracking-widest mb-0.5 truncate">
                            {org.industryType}
                          </p>
                        )}
                        <p className="font-black text-[#111] text-[13px] leading-tight line-clamp-1 group-hover:text-[#0099BB] transition-colors duration-200">
                          {org.name}
                        </p>
                        {org.displayAddress && (
                          <p className="text-[10px] text-[#bbb] flex items-center gap-0.5 mt-1 truncate font-medium">
                            <MapPin className="w-2.5 h-2.5 shrink-0" />
                            {org.displayAddress}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Load more */}
            {hasNextPage && !query && (
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="mt-4 w-full py-4 text-sm font-black text-[#111] rounded-3xl border-2 border-[#111] hover:bg-[#111] hover:text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed tracking-tight"
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
    <div className="text-center py-20">
      <p className="text-6xl font-black text-[#f0f0f0] tracking-tighter">0</p>
      <p className="font-black text-[#111] text-lg mt-2">No results</p>
      <p className="text-sm text-[#aaa] mt-1 font-medium">Try a different search term</p>
    </div>
  )
}

function OrgSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-[#efefef] p-4 aspect-square flex flex-col justify-between">
      <Skeleton className="h-5 w-8 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-12 rounded-full" />
        <Skeleton className="h-4 w-full rounded-lg" />
        <Skeleton className="h-4 w-2/3 rounded-lg" />
        <Skeleton className="h-3 w-3/4 rounded-full mt-1" />
      </div>
    </div>
  )
}