import { createFileRoute, Link } from '@tanstack/react-router'
import { useGetOrgs } from '@/hooks/use-org'
import { Skeleton } from '@/components/ui/skeleton'
import { MapPin, Search, ShieldCheck, ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import type { Org } from '@/types/org.type'

export const Route = createFileRoute('/organizations/')({
  component: OrgListPage,
})

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
      <div className="bg-white px-5 pt-10 pb-7 border-b border-[#f0f0f0]">
        <p className="text-[10px] font-semibold tracking-widest text-[#aaa] uppercase mb-3">
          Backtrack Network
        </p>
        <h1 className="text-[2.4rem] font-black text-[#111827] leading-[1.0] tracking-tight">
          SafeDrop <span className="text-[#111827]">Centres</span>
        </h1>
        <p className="text-sm text-[#6B6B6B] mt-2 font-normal">
          {isLoading ? '—' : `${filtered.length} locations`} · Drop off &amp; pick up
        </p>

        {/* Search */}
        <div className="relative mt-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#aaa]" />
          <input
            type="text"
            placeholder="Search by name or area…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white rounded-2xl pl-12 pr-5 py-4 text-sm font-medium text-[#111] placeholder:text-[#bbb] outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-400/60 transition-all duration-200 shadow-[0_2px_16px_rgba(0,0,0,0.08)] border border-transparent hover:border-[#e5e7eb]"
          />
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-screen-xl mx-auto px-4 pt-6 pb-12">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <OrgSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 items-stretch">
              {filtered.map((org) => (
                <Link
                  key={org.id}
                  to="/organizations/$id"
                  params={{ id: org.id }}
                  className="group block h-full"
                >
                  <OrgCard org={org} />
                </Link>
              ))}
            </div>

            {/* Load more */}
            {hasNextPage && !query && (
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="mt-8 w-full py-4 text-sm font-black text-[#111] rounded-2xl border-2 border-[#e5e7eb] hover:border-[#111] hover:bg-[#111] hover:text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed tracking-tight bg-white"
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

/* ─────────────────────────────────────────────
   OrgCard — Pattern A:
   • Cover image (object-cover) + gradient overlay
   • Logo avatar floats at cover/body boundary
   • Industry tag lives in the white body area
   • Fallback: no image → grey bg + logo contain
───────────────────────────────────────────── */
function OrgCard({ org }: { org: Org }) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.07)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_10px_32px_rgba(0,0,0,0.13)] h-full flex flex-col">

      {/* ── Cover zone ── */}
      <div className="relative h-28 shrink-0 bg-[#F3F4F6] overflow-hidden">
        {org.logoUrl ? (
          <img
            src={org.logoUrl}
            alt={org.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // On error: switch to contain mode so logo isn't cropped
              const img = e.currentTarget
              img.classList.replace('object-cover', 'object-contain')
              img.classList.add('p-4')
              // Also hide the gradient overlay
              const overlay = img.nextElementSibling as HTMLElement | null
              if (overlay) overlay.style.opacity = '0'
            }}
          />
        ) : (
          /* No image at all — neutral placeholder */
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-3xl font-black text-[#D1D5DB] select-none">
              {org.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Bottom gradient overlay (fades when logo fallback triggers) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/5 to-transparent pointer-events-none transition-opacity duration-200" />

        {/* Arrow — top-right */}
        <span className="absolute top-2.5 right-2.5 flex items-center justify-center w-6 h-6 rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-200 group-hover:bg-cyan-600 group-hover:shadow-md">
          <ArrowUpRight className="w-3 h-3 text-black/40 transition-colors duration-200 group-hover:text-white group-hover:-translate-y-px group-hover:translate-x-px" />
        </span>
      </div>

      {/* ── Floating logo avatar — straddles cover/body ── */}
      <div className="relative px-3.5">
        <div className="absolute -top-5 left-3.5 w-10 h-10 rounded-xl bg-white shadow-[0_2px_10px_rgba(0,0,0,0.12)] border border-[#f0f0f0] overflow-hidden flex items-center justify-center">
          {org.logoUrl ? (
            <img
              src={org.logoUrl}
              alt=""
              aria-hidden
              className="w-full h-full object-contain p-1"
            />
          ) : (
            <span className="text-sm font-black text-[#9CA3AF]">
              {org.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-3.5 pt-7 pb-3.5 min-w-0 flex flex-col flex-1">

        {/* Industry tag — clearly readable on white background */}
        {org.industryType && (
          <span className="self-start text-[9px] font-bold px-2 py-0.5 mb-1.5 rounded-full uppercase tracking-wide bg-cyan-50 text-cyan-700 border border-cyan-100">
            {org.industryType}
          </span>
        )}

        {/* Name + verified badge */}
        <div className="flex items-start gap-1.5 min-w-0">
          <p
            className="font-black text-[#111827] text-sm leading-snug line-clamp-2 flex-1 group-hover:text-cyan-700 transition-colors duration-200"
            style={{ minHeight: '2.5rem' }}
          >
            {org.name}
          </p>
          <span title="Verified Drop Point">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
          </span>
        </div>

        {/* Address */}
        <p
          className="text-[11px] text-[#9CA3AF] flex items-start gap-1 mt-1 font-medium"
          style={{ minHeight: '2rem' }}
        >
          <MapPin className="w-3 h-3 shrink-0 mt-0.5 text-[#C8CDD6]" />
          <span className="line-clamp-2">{org.displayAddress ?? ''}</span>
        </p>
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
    <div className="bg-white rounded-3xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.07)]">
      {/* Cover */}
      <Skeleton className="h-28 w-full rounded-none" />
      <div className="px-3.5 pt-7 pb-3.5 space-y-2">
        {/* Tag */}
        <Skeleton className="h-4 w-16 rounded-full" />
        {/* Name */}
        <div className="flex items-start gap-1.5">
          <Skeleton className="h-4 flex-1 rounded-lg" />
          <Skeleton className="h-3.5 w-3.5 rounded-full shrink-0 mt-0.5" />
        </div>
        {/* Address */}
        <Skeleton className="h-3 w-5/6 rounded-full" />
        <Skeleton className="h-3 w-3/5 rounded-full" />
      </div>
    </div>
  )
}
