import { Link, createFileRoute } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import { AlertCircle, MapPin, Navigation, Package, PackageSearch, Search, X } from 'lucide-react'
import type { Post, PostCategory, PostType } from '@/types/post.type'
import { useSearchPosts } from '@/hooks/use-post'
import { useAuth, useSignInAnonymous } from '@/hooks/use-auth'
import { Skeleton } from '@/components/ui/skeleton'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/feed/')({
  component: FeedPage,
})

/* ── Constants ──────────────────────────────────────────────── */
const CATEGORIES: Array<{ value: PostCategory; label: string }> = [
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Clothing', label: 'Clothing' },
  { value: 'Accessories', label: 'Accessories' },
  { value: 'Documents', label: 'Documents' },
  { value: 'Wallet', label: 'Wallet' },
  { value: 'Suitcase', label: 'Suitcase' },
  { value: 'Bags', label: 'Bags' },
  { value: 'Keys', label: 'Keys' },
  { value: 'Other', label: 'Other' },
]


/* ── Geolocation hook ───────────────────────────────────────── */
function useGeolocation() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!navigator.geolocation) {
      setError('Geolocation not supported by this browser.')
      setLoading(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLoading(false)
      },
      () => {
        // Fallback: Ho Chi Minh City centre
        setCoords({ lat: 10.7769, lng: 106.7009 })
        setError('Could not get your location — showing posts near Ho Chi Minh City.')
        setLoading(false)
      },
      { timeout: 8000, maximumAge: 300_000 },
    )
  }, [])

  return { coords, error, loading }
}

/* ── Debounce hook ──────────────────────────────────────────── */
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

/* ── Format helpers ─────────────────────────────────────────── */
function formatDistance(km: number | null | undefined): string {
  if (km == null) return ''
  if (km < 1) return `${Math.round(km * 1000)} m away`
  return `${km.toFixed(1)} km away`
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diff = (now.getTime() - d.getTime()) / 1000
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/* ── Page ───────────────────────────────────────────────────── */
function FeedPage() {
  const { profile } = useAuth()
  const { mutateAsync: signInAnonymous } = useSignInAnonymous()

  // Ensure there's always a Firebase token (anonymous if not signed in)
  useEffect(() => {
    if (!profile) signInAnonymous().catch(() => {})
  }, [profile, signInAnonymous])

  const [postType, setPostType] = useState<PostType | null>(null)
  const [category, setCategory] = useState<PostCategory | null>(null)
  const [radiusInKm, setRadiusInKm] = useState<number>(1000)
  const debouncedRadius = useDebounce(radiusInKm, 500)
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput, 420)
  const hasText = debouncedSearch.trim().length > 1
  const { coords, error: geoError, loading: geoLoading } = useGeolocation()

  /* Always use search endpoint */
  const { data, isLoading } = useSearchPosts({
    query: debouncedSearch,
    latitude: coords?.lat,
    longitude: coords?.lng,
    radiusInKm: debouncedRadius,
    postType,
    category,
    enabled: !geoLoading,
  })

  const posts: Array<Post> = data ?? []
  const totalCount = posts.length

  const handleClearSearch = useCallback(() => setSearchInput(''), [])
  const hasActiveFilters = postType !== null || category !== null || radiusInKm !== 1000

  const handleClearFilters = useCallback(() => {
    setPostType(null)
    setCategory(null)
    setRadiusInKm(1000)
  }, [])

  return (
    <div className="min-h-screen bg-white">

      {/* ── Sticky top bar ───────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 pt-4 pb-3 space-y-3">

          {/* Title + location + count */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-black text-[#111] tracking-tight leading-tight">Lost &amp; Found</h1>
              {!geoLoading && (
                <p className="text-xs text-[#888] font-medium mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 shrink-0" />
                  {geoError ? 'Ho Chi Minh City area' : 'Near your location'}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-[#888] hover:text-[#111] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  Clear filters
                </button>
              )}
              {!geoLoading && totalCount > 0 && (
                <span className="text-xs text-[#aaa] font-medium">
                  {totalCount.toLocaleString()} post{totalCount !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bbb] pointer-events-none" />
            <input
              type="text"
              placeholder="Describe what you lost or found…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-[#f5f5f5] rounded-full pl-10 pr-10 py-2.5 text-sm font-medium text-[#111] placeholder:text-[#bbb] outline-none focus:ring-2 focus:ring-gray-200 border border-transparent focus:border-gray-200 transition-all duration-200"
            />
            {searchInput && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-[#ddd] hover:bg-[#ccc] transition-colors cursor-pointer"
              >
                <X className="w-3 h-3 text-[#555]" />
              </button>
            )}
          </div>

          {/* Type segmented control */}
          <div className="inline-flex bg-gray-100 rounded-xl p-1 gap-0.5">
            {([null, 'Lost', 'Found'] as const).map((t) => (
              <button
                key={t ?? 'all'}
                onClick={() => setPostType(t)}
                className={cn(
                  'px-4 py-1.5 rounded-[9px] text-xs font-semibold transition-all duration-150 cursor-pointer',
                  postType === t
                    ? t === 'Lost'
                      ? 'bg-red-500 text-white shadow-sm'
                      : t === 'Found'
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700',
                )}
              >
                {t ?? 'All'}
              </button>
            ))}
          </div>

          {/* Radius slider */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-gray-400 shrink-0 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Radius
            </span>
            <Slider
              min={1}
              max={5000}
              step={1}
              value={[radiusInKm]}
              onValueChange={([v]) => setRadiusInKm(v)}
              className="flex-1"
            />
            <span className="text-xs font-semibold text-gray-700 w-16 text-right shrink-0">
              {radiusInKm >= 1000 ? `${(radiusInKm / 1000).toFixed(1)}k` : radiusInKm} km
            </span>
          </div>

          {/* Category chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
            <button
              onClick={() => setCategory(null)}
              className={cn(
                'shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer whitespace-nowrap',
                category === null
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700',
              )}
            >
              All categories
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(category === cat.value ? null : cat.value)}
                className={cn(
                  'shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer whitespace-nowrap',
                  category === cat.value
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700',
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Geo fallback banner ───────────────────────────────── */}
      {geoError && (
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 pt-3">
          <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700 font-medium">
            <Navigation className="w-3.5 h-3.5 shrink-0 mt-px" />
            <span>{geoError}</span>
          </div>
        </div>
      )}

      {/* ── Content ──────────────────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-5">

        {isLoading ? (
          <PostGrid>
            {Array.from({ length: 8 }).map((_, i) => <PostSkeleton key={i} />)}
          </PostGrid>
        ) : posts.length === 0 ? (
          <EmptyState isSearch={hasText || category !== null} hasText={hasText} query={debouncedSearch} onClear={handleClearSearch} />
        ) : (
          <>
            <p className="text-xs text-[#aaa] font-medium mb-4">
              {totalCount} result{totalCount !== 1 ? 's' : ''}
              {hasText && <span> for &ldquo;{debouncedSearch}&rdquo;</span>}
              {category && <span> in <strong>{category}</strong></span>}
            </p>

            <PostGrid>
              {posts.map((post) => <PostCard key={post.id} post={post} />)}
            </PostGrid>
          </>
        )}
      </div>
    </div>
  )
}

/* ── Grid wrapper ───────────────────────────────────────────── */
function PostGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4', className)}>
      {children}
    </div>
  )
}

/* ── Post card ──────────────────────────────────────────────── */
function PostCard({ post }: { post: Post }) {
  const isLost = post.postType === 'Lost'
  const hasImage = !!post.imageUrl
  const distanceText = formatDistance(post.distanceKm)
  const dateText = formatDate(post.createdAt)

  return (
    <Link to="/feed/$postId" params={{ postId: post.id }} className="group cursor-pointer block">
      {/* Image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#f3f4f6] mb-2.5">
        {hasImage ? (
          <img
            src={post.imageUrl!}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {isLost
              ? <PackageSearch className="w-10 h-10 text-[#d1d5db]" />
              : <Package className="w-10 h-10 text-[#d1d5db]" />
            }
          </div>
        )}

        {/* Type badge */}
        <span
          className={cn(
            'absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide',
            isLost
              ? 'bg-red-500/90 text-white'
              : 'bg-emerald-500/90 text-white',
          )}
        >
          {post.postType}
        </span>
      </div>

      {/* Meta */}
      <div className="space-y-0.5 px-0.5">
        <p className="text-sm font-semibold text-[#111] leading-snug line-clamp-2 group-hover:underline">
          {post.title}
        </p>
        {post.location?.displayAddress && (
          <p className="text-xs text-[#717171] flex items-center gap-1 line-clamp-1">
            <MapPin className="w-3 h-3 shrink-0" />
            {post.location.displayAddress}
          </p>
        )}
        <p className="text-xs text-[#aaa] font-medium">
          {[distanceText, dateText].filter(Boolean).join(' · ')}
        </p>
      </div>
    </Link>
  )
}

/* ── Skeleton ───────────────────────────────────────────────── */
function PostSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-square w-full rounded-2xl mb-2.5" />
      <div className="space-y-1.5 px-0.5">
        <Skeleton className="h-3.5 w-3/4 rounded" />
        <Skeleton className="h-3 w-1/2 rounded" />
        <Skeleton className="h-3 w-1/3 rounded" />
      </div>
    </div>
  )
}

/* ── Empty state ────────────────────────────────────────────── */
function EmptyState({
  isSearch,
  hasText,
  query,
  onClear,
}: {
  isSearch: boolean
  hasText: boolean
  query: string
  onClear: () => void
}) {
  return (
    <div className="flex flex-col items-center py-24 gap-4">
      <div className="w-20 h-20 rounded-3xl bg-[#f3f4f6] flex items-center justify-center">
        <AlertCircle className="w-9 h-9 text-[#d1d5db]" />
      </div>
      <div className="text-center">
        <p className="font-black text-[#111] text-lg">
          {isSearch ? 'No results found' : 'Nothing nearby yet'}
        </p>
        <p className="text-sm text-[#aaa] mt-1 max-w-xs">
          {isSearch
            ? hasText
              ? `No posts matched "${query}". Try different keywords.`
              : 'No posts found in this category.'
            : 'There are no lost or found posts in your area. Check back later.'}
        </p>
      </div>
      {isSearch && (
        <button
          onClick={onClear}
          className="px-5 py-2 rounded-xl bg-[#111] text-white text-sm font-bold hover:bg-[#333] transition-colors cursor-pointer"
        >
          Clear search
        </button>
      )}
    </div>
  )
}
