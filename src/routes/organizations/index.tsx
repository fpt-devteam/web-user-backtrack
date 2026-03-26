import { createFileRoute, Link } from '@tanstack/react-router'
import { useGetOrgs } from '@/hooks/use-org'
import { Skeleton } from '@/components/ui/skeleton'
import { MapPin, Search, ShieldCheck, ArrowUpRight, Building2, X } from 'lucide-react'
import { useState, useMemo } from 'react'
import type { Org } from '@/types/org.type'

export const Route = createFileRoute('/organizations/')({
  component: OrgListPage,
})

/* ─── helpers ─── */
const INDUSTRY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  default: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-100' },
  Healthcare: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
  Education: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-100' },
  Retail: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100' },
  Hospitality: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100' },
  Transport: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
  Government: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
}

function getIndustryStyle(industry: string) {
  return INDUSTRY_COLORS[industry] ?? INDUSTRY_COLORS.default
}

/* ─── page ─── */
function OrgListPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useGetOrgs()
  const [query, setQuery] = useState('')
  const [activeIndustry, setActiveIndustry] = useState<string | null>(null)

  const orgs: Org[] = data?.pages.flatMap((p) => p.items) ?? []

  const industries = useMemo(() => {
    const set = new Set<string>()
    orgs.forEach((o) => { if (o.industryType) set.add(o.industryType) })
    return Array.from(set).sort()
  }, [orgs])

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
    if (activeIndustry) {
      list = list.filter((o) => o.industryType === activeIndustry)
    }
    return list
  }, [orgs, query, activeIndustry])

  return (
    <div className="min-h-screen bg-[#F8F7F4]">

      {/* ── Hero Header ── */}
      <div className="relative bg-white overflow-hidden border-b border-[#efefef]">
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
        {/* Cyan glow top-left */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
        {/* Cyan glow bottom-right */}
        <div className="absolute -bottom-16 -right-8 w-64 h-64 bg-brand-50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-screen-xl mx-auto px-5 pt-10 pb-7">
          {/* Eyebrow */}
          <p className="text-[10px] font-bold tracking-[0.18em] text-brand-600 uppercase mb-3 flex items-center gap-2">
            <span className="inline-block w-4 h-px bg-brand-200" />
            Backtrack Network
            <span className="inline-block w-4 h-px bg-brand-200" />
          </p>

          {/* Title row */}
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-[2.2rem] sm:text-[2.6rem] font-black text-[#111827] leading-[1.05] tracking-tight">
                SafeDrop{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-cyan-500">
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

            {/* Stats pill */}
            {!isLoading && orgs.length > 0 && (
              <div className="hidden sm:flex items-center gap-3 bg-brand-50 border border-brand-100 rounded-2xl px-4 py-2.5 shrink-0">
                <Building2 className="w-4 h-4 text-brand-600" />
                <span className="text-xs font-bold text-brand-700">{orgs.length} Partner{orgs.length !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="relative mt-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bbb] pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or location…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white rounded-2xl pl-11 pr-11 py-3.5 text-sm font-medium text-[#111] placeholder:text-[#bbb] outline-none focus:ring-2 focus:ring-cyan-400/30 border border-[#e8e8e8] hover:border-[#d5d5d5] focus:border-brand-300 transition-all duration-200 shadow-sm"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-[#f0f0f0] hover:bg-[#e5e5e5] transition-colors cursor-pointer"
              >
                <X className="w-3 h-3 text-[#888]" />
              </button>
            )}
          </div>

          {/* Industry filter chips */}
          {!isLoading && industries.length > 0 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none -mx-5 px-5">
              <button
                onClick={() => setActiveIndustry(null)}
                className={`shrink-0 text-[11px] font-bold px-3.5 py-1.5 rounded-full border transition-all duration-150 cursor-pointer ${
                  activeIndustry === null
                    ? 'bg-[#111827] text-white border-[#111827]'
                    : 'bg-white text-[#555] border-[#e5e7eb] hover:border-[#bbb]'
                }`}
              >
                All
              </button>
              {industries.map((ind) => {
                const style = getIndustryStyle(ind)
                const active = activeIndustry === ind
                return (
                  <button
                    key={ind}
                    onClick={() => setActiveIndustry(active ? null : ind)}
                    className={`shrink-0 text-[11px] font-bold px-3.5 py-1.5 rounded-full border transition-all duration-150 cursor-pointer ${
                      active
                        ? `${style.bg} ${style.text} ${style.border} ring-2 ring-offset-1 ring-cyan-400/40`
                        : `bg-white text-[#555] border-[#e5e7eb] hover:border-[#bbb]`
                    }`}
                  >
                    {ind}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-screen-xl mx-auto px-4 pt-6 pb-14">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {Array.from({ length: 8 }).map((_, i) => <OrgSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState hasQuery={!!query || !!activeIndustry} onReset={() => { setQuery(''); setActiveIndustry(null) }} />
        ) : (
          <>
            <div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch"
            >
              {filtered.map((org, i) => (
                <Link
                  key={org.id}
                  to="/organizations/$id"
                  params={{ id: org.id }}
                  className="group block h-full"
                  style={{ animationDelay: `${Math.min(i * 40, 320)}ms` }}
                >
                  <OrgCard org={org} />
                </Link>
              ))}
            </div>

            {/* Load more */}
            {hasNextPage && !query && !activeIndustry && (
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
  const industryStyle = getIndustryStyle(org.industryType ?? '')
  const isActive = org.status === 'Active'

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-[#f0f0f0] transition-all duration-250 group-hover:-translate-y-1.5 group-hover:shadow-[0_12px_36px_rgba(0,0,0,0.12)] group-hover:border-brand-100 h-full flex flex-col cursor-pointer">

      {/* ── Cover zone ── */}
      <div className="relative h-32 shrink-0 overflow-hidden bg-gradient-to-br from-[#f3f4f6] to-[#e9ebee]">
        {hasCover ? (
          <img
            src={org.coverImageUrl!}
            alt=""
            aria-hidden
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        ) : hasLogo ? (
          <img
            src={org.logoUrl!}
            alt=""
            aria-hidden
            className="w-full h-full object-cover opacity-20 blur-xs scale-110 transition-transform duration-500 group-hover:scale-[1.08]"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        ) : null}

        {/* Always show gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent pointer-events-none" />

        {/* Subtle brand accent on hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/0 via-transparent to-cyan-400/0 group-hover:from-cyan-500/10 group-hover:to-cyan-400/5 transition-all duration-300 pointer-events-none" />

        {/* Status dot — bottom left */}
        <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-[#bbb]'}`}
          />
          <span className="text-[9px] font-bold text-white/80 uppercase tracking-wide">
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Arrow — top right */}
        <span className="absolute top-2.5 right-2.5 flex items-center justify-center w-6 h-6 rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-200 group-hover:bg-cyan-600 group-hover:shadow-md">
          <ArrowUpRight className="w-3.5 h-3.5 text-black/50 transition-colors duration-200 group-hover:text-white" />
        </span>
      </div>

      {/* ── Floating logo avatar ── */}
      <div className="relative px-3.5">
        <div className="absolute -top-5 left-3.5 w-10 h-10 rounded-xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.14)] border border-[#efefef] overflow-hidden flex items-center justify-center">
          {hasLogo ? (
            <img
              src={org.logoUrl!}
              alt={org.name}
              className="w-full h-full object-contain p-1"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
                const fallback = e.currentTarget.nextElementSibling as HTMLElement | null
                if (fallback) fallback.classList.remove('hidden')
              }}
            />
          ) : null}
          <span className={`${hasLogo ? 'hidden' : ''} text-sm font-black text-[#9CA3AF]`}>
            {org.name.charAt(0).toUpperCase()}
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-3.5 pt-7 pb-4 flex flex-col flex-1 min-w-0 gap-1">

        {/* Industry tag */}
        {org.industryType && (
          <span className={`self-start text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${industryStyle.bg} ${industryStyle.text} ${industryStyle.border}`}>
            {org.industryType}
          </span>
        )}

        {/* Name + verified */}
        <div className="flex items-start gap-1.5 min-w-0 mt-0.5">
          <p
            className="font-black text-[#111827] text-sm leading-snug line-clamp-2 flex-1 group-hover:text-cyan-700 transition-colors duration-200"
            style={{ minHeight: '2.5rem' }}
          >
            {org.name}
          </p>
          <span title="Verified Drop Point" className="shrink-0 mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
          </span>
        </div>

        {/* Address */}
        {org.displayAddress && (
          <p className="text-[11px] text-[#9CA3AF] flex items-start gap-1 font-medium" style={{ minHeight: '1.75rem' }}>
            <MapPin className="w-3 h-3 shrink-0 mt-0.5 text-[#C8CDD6]" />
            <span className="line-clamp-2">{org.displayAddress}</span>
          </p>
        )}
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
    <div className="bg-white rounded-3xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-[#f0f0f0]">
      {/* Cover */}
      <Skeleton className="h-32 w-full rounded-none" />
      <div className="px-3.5 pt-7 pb-4 space-y-2">
        {/* Tag */}
        <Skeleton className="h-3.5 w-14 rounded-full" />
        {/* Name row */}
        <div className="flex items-start gap-1.5">
          <Skeleton className="h-4 flex-1 rounded-lg" />
          <Skeleton className="h-3.5 w-3.5 rounded-full shrink-0 mt-0.5" />
        </div>
        <Skeleton className="h-3 w-5/6 rounded-full" />
        {/* Address second line */}
        <Skeleton className="h-3 w-3/5 rounded-full" />
      </div>
    </div>
  )
}
