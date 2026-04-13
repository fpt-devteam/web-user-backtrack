import { useState, useEffect } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  Award,
  Backpack,
  Box,
  Clock,
  FileText,
  Grid2X2,
  Key,
  Layers,
  MapPin,
  MessageCircle,
  Package,
  PackageSearch,
  Palette,
  Ruler,
  Shirt,
  Smartphone,
  Star,
  Tag,
  User,
  Wallet,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { postKeys, useGetPost, useSearchPosts } from '@/hooks/use-post'
import { useCreateDirectConversation } from '@/hooks/use-messager'
import { postService } from '@/services/post.service'
import { Skeleton } from '@/components/ui/skeleton'
import type { Post, PostCategory } from '@/types/post.type'

export const Route = createFileRoute('/feed/$postId/')({
  component: PostDetailPage,
  loader: async ({ context: { queryClient }, params: { postId } }) => {
    try {
      await queryClient.ensureQueryData({
        queryKey: postKeys.detail(postId),
        queryFn: () => postService.getPostById(postId),
        staleTime: 1000 * 60 * 5,
      })
    } catch {
      // Let the component handle error/not-found state
    }
  },
})

/* ── Category icon map ──────────────────────────────────────── */
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Electronics: Smartphone,
  Clothing: Shirt,
  Accessories: Tag,
  Documents: FileText,
  Wallet: Wallet,
  Suitcase: Backpack,
  Bags: Backpack,
  Keys: Key,
  Other: Box,
}

function CategoryIcon({ category, className }: { category: string; className?: string }) {
  const Icon = CATEGORY_ICONS[category] ?? Package
  return <Icon className={className} />
}

/* ── Helpers ────────────────────────────────────────────────── */
function formatPostedDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diff = (now.getTime() - d.getTime()) / 1000
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} days ago`
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function formatDistance(meters: number | null | undefined): string {
  if (meters == null) return ''
  if (meters < 1000) return `${Math.round(meters)} m from you`
  return `${(meters / 1000).toFixed(1)} km from you`
}

/* ── Attribute chip ─────────────────────────────────────────── */
function AttrChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-4 border-b border-gray-100 last:border-0">
      <div className="shrink-0 mt-0.5 text-[#717171]">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-[#111]">{label}</p>
        <p className="text-sm text-[#717171] mt-0.5">{value}</p>
      </div>
    </div>
  )
}

/* ── Photo gallery modal ────────────────────────────────────── */
function PhotoModal({
  images,
  startIndex,
  onClose,
}: {
  images: Array<string>
  startIndex: number
  onClose: () => void
}) {
  const [idx, setIdx] = useState(startIndex)
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <span className="text-white text-sm font-medium">{idx + 1} / {images.length}</span>
        <div className="w-9" />
      </div>
      <div className="flex-1 flex items-center justify-center px-4">
        <img
          src={images[idx]}
          alt=""
          className="max-h-full max-w-full object-contain rounded-xl"
        />
      </div>
      {images.length > 1 && (
        <div className="flex justify-center gap-2 py-4">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={cn(
                'rounded-full transition-all cursor-pointer',
                i === idx ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40',
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Map embed ──────────────────────────────────────────────── */
function MapEmbed({ lat, lng, address }: { lat: number; lng: number; address?: string | null }) {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200">
      {address && (
        <div className="px-3 py-2.5 flex items-start gap-2">
          <MapPin className="w-3.5 h-3.5 text-[#e8175d] shrink-0 mt-0.5" />
          <p className="text-xs text-[#555] leading-relaxed">{address}</p>
        </div>
      )}
      <div className="relative h-44">
        <iframe
          title="Location map"
          aria-hidden="true"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`}
        />
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
          target="_blank"
          rel="noreferrer"
          className="absolute bottom-2 right-2 flex items-center gap-1 bg-white text-[11px] font-bold text-[#111] px-2.5 py-1.5 rounded-lg shadow-md hover:bg-[#f5f5f5] transition-colors cursor-pointer"
        >
          <MapPin className="w-3 h-3 text-[#e8175d]" />
          View map
        </a>
      </div>
    </div>
  )
}

/* ── Full month calendar (read-only, highlighted date) ──────── */
const DAY_HEADERS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function CalendarWidget({ iso, label }: { iso: string; label: string }) {
  const target = new Date(iso)
  const targetDay   = target.getDate()
  const targetMonth = target.getMonth()
  const targetYear  = target.getFullYear()

  // First day-of-week offset and total days in month
  const firstDow = new Date(targetYear, targetMonth, 1).getDay()
  const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate()

  const monthLabel = target.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const fullLabel  = target.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  // Build grid cells: leading nulls + day numbers
  const cells: Array<number | null> = [
    ...Array.from({ length: firstDow }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="mb-4 border border-gray-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#717171] mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-[#111]">{fullLabel}</p>
      </div>

      {/* Month title */}
      <div className="flex items-center justify-center py-2">
        <span className="text-sm font-bold text-[#111]">{monthLabel}</span>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 px-2 pb-1">
        {DAY_HEADERS.map((d) => (
          <div key={d} className="text-center text-[11px] font-semibold text-[#717171] py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 px-2 pb-3">
        {cells.map((day, i) => (
          <div key={i} className="flex items-center justify-center py-1">
            {day !== null && (
              <span
                className={cn(
                  'w-8 h-8 flex items-center justify-center rounded-full text-sm transition-colors',
                  day === targetDay
                    ? 'bg-[#111] text-white font-bold'
                    : 'text-[#222] font-normal',
                )}
              >
                {day}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Related posts ──────────────────────────────────────────── */
function RelatedPostCard({ post }: { post: Post }) {
  const isLost = post.postType === 'Lost'
  return (
    <Link
      to="/feed/$postId"
      params={{ postId: post.id }}
      className="group shrink-0 w-44 block"
    >
      <div className="relative aspect-square rounded-xl overflow-hidden bg-[#f3f4f6] mb-2">
        {post.imageUrl ? (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-8 h-8 text-[#d1d5db]" />
          </div>
        )}
        <span className={cn(
          'absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide',
          isLost ? 'bg-red-500/90 text-white' : 'bg-emerald-500/90 text-white',
        )}>
          {post.postType}
        </span>
      </div>
      <p className="text-sm font-semibold text-[#111] leading-snug line-clamp-2 group-hover:underline">
        {post.title}
      </p>
      {post.location?.displayAddress && (
        <p className="text-xs text-[#717171] mt-0.5 line-clamp-1 flex items-center gap-1">
          <MapPin className="w-3 h-3 shrink-0" />
          {post.location.displayAddress}
        </p>
      )}
    </Link>
  )
}

function RelatedPosts({ category, currentPostId }: { category: string; currentPostId: string }) {
  const { data, isLoading } = useSearchPosts({
    query: '',
    category: category as PostCategory,
    enabled: true,
  })

  const related = data?.filter((p) => p.id !== currentPostId).slice(0, 10) ?? []

  if (!isLoading && related.length === 0) return null

  return (
    <div>
      <h2 className="text-xl font-bold text-[#111] mb-4">
        More in <span className="capitalize">{category}</span>
      </h2>

      <div className="overflow-hidden">
        {isLoading ? (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="shrink-0 w-44">
                <Skeleton className="aspect-square w-full rounded-xl mb-2" />
                <Skeleton className="h-3.5 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/2 rounded mt-1" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
            {related.map((post) => (
              <RelatedPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Page ───────────────────────────────────────────────────── */
function PostDetailPage() {
  const { postId } = Route.useParams()
  const navigate = useNavigate()
  const { data: post, isLoading, isError } = useGetPost(postId)
  const { mutateAsync: createDirectConv, isPending: isCreatingConv } = useCreateDirectConversation()
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [galleryStart, setGalleryStart] = useState(0)
  const [showMore, setShowMore] = useState(false)

  const handleMessagePoster = async () => {
    if (!post) return
    const conv = await createDirectConv(post.author.id)
    navigate({ to: '/message', search: { selectedId: conv.conversationId } })
  }

  useEffect(() => {
    if (isError) navigate({ to: '/' })
  }, [isError, navigate])

  if (isLoading) return <DetailSkeleton />
  if (isError || !post) return null

  const images = post.imageUrls ?? []
  const isLost = post.postType === 'Lost'
  const distanceText = formatDistance(post.distanceInMeters)

  const attrs = [
    post.item.brand     && { label: 'Brand',     value: post.item.brand,     icon: Award   },
    post.item.color     && { label: 'Color',      value: post.item.color,     icon: Palette },
    post.item.condition && { label: 'Condition',  value: post.item.condition, icon: Star    },
    post.item.material  && { label: 'Material',   value: post.item.material,  icon: Layers  },
    post.item.size      && { label: 'Size',        value: post.item.size,      icon: Ruler   },
  ].filter(Boolean) as Array<{ label: string; value: string; icon: LucideIcon }>

  const notes = [post.item.distinctiveMarks, post.item.additionalDetails]
    .filter(Boolean)
    .join(' · ')

  const openGallery = (i: number) => { setGalleryStart(i); setGalleryOpen(true) }

  return (
    <>
      {galleryOpen && (
        <PhotoModal images={images} startIndex={galleryStart} onClose={() => setGalleryOpen(false)} />
      )}

      <div className="min-h-screen bg-white">

        {/* ── Top nav ────────────────────────────────────────────── */}
        <div className="sticky top-0 z-20 bg-white border-b border-gray-100">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-3 flex items-center gap-3">
            <button
              onClick={() => navigate({ to: '/feed' })}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-4 h-4 text-[#111]" />
            </button>
            <span className="text-sm font-semibold text-[#111] truncate">{post.item.itemName}</span>
          </div>
        </div>

        {/* ── Photo grid ─────────────────────────────────────────── */}
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 mt-6">
          {images.length === 0 ? (
            <div className="rounded-2xl overflow-hidden bg-[#f3f4f6] aspect-[16/9] flex items-center justify-center">
              <CategoryIcon category={post.item.category} className="w-20 h-20 text-[#d1d5db]" />
            </div>
          ) : images.length === 1 ? (
            <div
              className="rounded-2xl overflow-hidden bg-[#f3f4f6] aspect-[16/9] cursor-pointer"
              onClick={() => openGallery(0)}
            >
              <img src={images[0]} alt={post.item.itemName} className="w-full h-full object-cover hover:opacity-95 transition-opacity" />
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden">
              <div className={cn(
                'grid gap-2',
                images.length >= 3 ? 'grid-cols-2' : 'grid-cols-1',
              )}>
                {/* Main large image */}
                <div
                  className="aspect-[4/3] bg-[#f3f4f6] cursor-pointer overflow-hidden"
                  onClick={() => openGallery(0)}
                >
                  <img src={images[0]} alt={post.item.itemName} className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300" />
                </div>
                {/* Side images */}
                {images.length >= 3 && (
                  <div className="grid grid-rows-2 gap-2">
                    {images.slice(1, 3).map((src, i) => (
                      <div
                        key={i}
                        className="bg-[#f3f4f6] cursor-pointer overflow-hidden"
                        onClick={() => openGallery(i + 1)}
                      >
                        <img src={src} alt="" className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Show all photos button */}
              {images.length > 1 && (
                <button
                  onClick={() => openGallery(0)}
                  className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-[#111] hover:bg-gray-50 transition-colors cursor-pointer shadow-sm"
                >
                  <Grid2X2 className="w-3.5 h-3.5" />
                  Show all photos
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Main content: 2-column on lg ───────────────────────── */}
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 mt-8 pb-16 lg:grid lg:grid-cols-[1fr_380px] lg:gap-16 lg:items-start">

          {/* ── Left column ──────────────────────────────────────── */}
          <div className="min-w-0">

            {/* Title + badge */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[#111] leading-snug">
                  {post.item.itemName}
                </h1>
                <p className="text-base text-[#717171] mt-1">
                  {post.item.category}
                  {post.displayAddress ? ` · ${post.displayAddress}` : ''}
                </p>
              </div>
              <span
                className={cn(
                  'shrink-0 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mt-1',
                  isLost ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600',
                )}
              >
                {post.postType}
              </span>
            </div>

            <hr className="my-6 border-gray-100" />

            {/* Author / Organization */}
            {(() => {
              const org = post.organization
              const hasAuthorName = !!post.author.displayName
              const hasAuthorAvatar = !!post.author.avatarUrl
              const displayName = hasAuthorName ? post.author.displayName : (org?.name ?? 'Unknown')
              const avatarUrl = hasAuthorAvatar ? post.author.avatarUrl : (org ? org.logoUrl : null)
              const subtitle = org
                ? `${org.name}${org.displayAddress ? ` · ${org.displayAddress}` : ''}`
                : `Posted ${formatPostedDate(post.createdAt)}`

              return (
                <div className="flex items-center gap-4">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-12 h-12 rounded-full object-cover shrink-0"
                    />
                  ) : org ? (
                    <div className="w-12 h-12 rounded-xl bg-[#f3f4f6] flex items-center justify-center shrink-0 text-base font-bold text-[#555]">
                      {org.name.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#e5e7eb] flex items-center justify-center shrink-0">
                      <User className="w-6 h-6 text-[#9ca3af]" />
                    </div>
                  )}
                  <div>
                    <p className="text-base font-semibold text-[#111]">{displayName}</p>
                    <p className="text-sm text-[#717171] line-clamp-1">{subtitle}</p>
                  </div>
                </div>
              )
            })()}

            <hr className="my-6 border-gray-100" />

            {/* Key highlights */}
            <div className="space-y-0">
              {distanceText && (
                <AttrChip
                  icon={<MapPin className="w-5 h-5" />}
                  label={distanceText}
                  value={post.displayAddress ?? 'Location on record'}
                />
              )}
              <AttrChip
                icon={<Clock className="w-5 h-5" />}
                label="Report posted"
                value={formatPostedDate(post.createdAt)}
              />
            </div>

            {/* Notes / description */}
            {notes && (
              <>
                <hr className="my-6 border-gray-100" />
                <div>
                  <p className={cn(
                    'text-[#111] text-base leading-relaxed',
                    !showMore && 'line-clamp-4',
                  )}>
                    {notes}
                  </p>
                  <button
                    onClick={() => setShowMore((v) => !v)}
                    className="mt-2 text-sm font-semibold text-[#111] underline cursor-pointer"
                  >
                    {showMore ? 'Show less' : 'Show more'}
                  </button>
                </div>
              </>
            )}

            <hr className="my-6 border-gray-100" />

            {/* Item attributes grid */}
            <div>
              <h2 className="text-xl font-bold text-[#111] mb-4">Item details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                {attrs.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-3 py-3 border-b border-gray-100">
                    <Icon className="w-5 h-5 text-[#717171] shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-[#111]">{label}</p>
                      <p className="text-sm text-[#717171]">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile-only: calendar + map + CTA */}
            <div className="mt-8 lg:hidden space-y-4">
              {post.eventTime && (
                <CalendarWidget iso={post.eventTime} label={isLost ? 'Lost on' : 'Found on'} />
              )}
              {post.location && (
                <MapEmbed
                  lat={post.location.latitude}
                  lng={post.location.longitude}
                  address={post.displayAddress}
                />
              )}
              <button
                onClick={handleMessagePoster}
                disabled={isCreatingConv}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white transition-colors cursor-pointer bg-gradient-to-r from-[#e8175d] to-[#c41546] hover:from-[#d0154f] hover:to-[#b01240] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <MessageCircle className="w-4 h-4" />
                {isCreatingConv ? 'Opening chat…' : 'Message Poster'}
              </button>
            </div>
          </div>

          {/* ── Right column: sticky contact card ────────────────── */}
          <div className="hidden lg:block">
            <div className="sticky top-20">
              <div className="border border-gray-200 rounded-2xl shadow-lg p-6">

                {/* Type + distance */}
                <div className="flex items-baseline justify-between mb-1">
                  <span
                    className={cn(
                      'text-2xl font-bold',
                      isLost ? 'text-red-600' : 'text-emerald-600',
                    )}
                  >
                    {post.postType}
                  </span>
                  {distanceText && (
                    <span className="text-sm text-[#717171]">{distanceText}</span>
                  )}
                </div>
                <p className="text-sm text-[#717171] mb-5">{post.item.category}</p>

                {/* Calendar widget */}
                {post.eventTime && (
                  <CalendarWidget iso={post.eventTime} label={isLost ? 'Lost on' : 'Found on'} />
                )}

                {/* Map embed */}
                {post.location && (
                  <div className="mb-4">
                    <MapEmbed
                      lat={post.location.latitude}
                      lng={post.location.longitude}
                      address={post.displayAddress}
                    />
                  </div>
                )}


                <button
                  onClick={handleMessagePoster}
                  disabled={isCreatingConv}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white transition-colors cursor-pointer bg-gradient-to-r from-[#e8175d] to-[#c41546] hover:from-[#d0154f] hover:to-[#b01240] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <MessageCircle className="w-4 h-4" />
                  {isCreatingConv ? 'Opening chat…' : 'Message Poster'}
                </button>

                {/* Author */}
             
              </div>
            </div>
          </div>

        </div>

        {/* ── Related posts (full width, below both columns) ───── */}
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 pb-16">
          <hr className="mb-8 border-gray-100" />
          <RelatedPosts category={post.item.category} currentPostId={post.id} />
        </div>
      </div>
    </>
  )
}

/* ── Skeleton ───────────────────────────────────────────────── */
function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-3 flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-full" />
          <Skeleton className="h-4 w-48 rounded" />
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">
        <Skeleton className="mt-6 aspect-[16/9] w-full rounded-2xl" />
        <div className="mt-8 lg:grid lg:grid-cols-[1fr_380px] lg:gap-16">
          <div className="space-y-4">
            <Skeleton className="h-8 w-2/3 rounded" />
            <Skeleton className="h-5 w-1/3 rounded" />
            <div className="pt-4 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="w-5 h-5 rounded shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-24 rounded" />
                    <Skeleton className="h-3.5 w-40 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:block">
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
