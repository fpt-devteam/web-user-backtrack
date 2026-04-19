import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import {
  ArrowLeft,
  ChevronRight,
  Mail,
  MapPin,
  MessageCircle,
  PackageSearch,
  Phone,
  Shield,
  ShieldCheck,
  Star,
} from 'lucide-react'
import type { Post } from '@/types/user.type'
import { useGetPublicQrProfile } from '@/hooks/use-qr'
import { useGetUserPosts } from '@/hooks/use-user'
import { StartChatButton } from '@/components/found-item/start-chat-button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Splash } from '@/components/ui/splash'

export const Route = createFileRoute('/profile/$publicCode/')({
  component: OwnerProfilePage,
})

function OwnerProfilePage() {
  const { publicCode } = Route.useParams()
  const navigate = useNavigate()

  const { data: profile, isLoading: isProfileLoading, error: profileError } = useGetPublicQrProfile(publicCode)
  const userId = profile?.userId ?? ''
  const { data: postsData, isLoading: isPostsLoading } = useGetUserPosts(userId, !!userId)

  const posts = postsData ?? []
  const displayName = profile?.displayName ?? 'User'
  const initial = displayName[0]?.toUpperCase() ?? 'U'

  useEffect(() => {
    if (profileError) navigate({ to: '/' })
  }, [profileError, navigate])

  if (isProfileLoading) return <Splash />
  if (profileError || !profile) return null

  return (
    <div className="min-h-screen bg-white">
      {/* ── Back button ── */}
      <button
        onClick={() => navigate({ to: '/' })}
        className="fixed top-5 left-5 z-40 w-10 h-10 flex items-center justify-center rounded-full
                   bg-white shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft className="w-4 h-4 text-gray-700" />
      </button>

      {/* ── Main layout ── */}
      <div className="max-w-5xl mx-auto px-5 py-16 sm:py-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Meet your host</h1>

        <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-8 items-start">

          {/* ── LEFT: Avatar card ── */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm flex flex-col items-center text-center">
            <div className="relative mb-4">
              <Avatar className="w-28 h-28 border-4 border-white shadow-lg">
                <AvatarImage src={profile.avatarUrl ?? undefined} className="object-cover" />
                <AvatarFallback className="text-3xl font-black bg-gray-100 text-gray-600">
                  {initial}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 w-9 h-9 bg-[#FF385C] rounded-full border-4 border-white flex items-center justify-center shadow">
                <ShieldCheck className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900">{displayName}</h2>
            <p className="text-sm text-gray-500 mt-0.5">Verified member</p>

            <div className="w-full border-t border-gray-100 my-6" />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 w-full">
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold text-gray-900">{posts.length}</span>
                <span className="text-xs text-gray-500 mt-0.5">Posts</span>
              </div>
              <div className="flex flex-col items-center border-x border-gray-100">
                <span className="text-xl font-bold text-gray-900 flex items-center gap-0.5">
                  4.9 <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
                </span>
                <span className="text-xs text-gray-500 mt-0.5">Rating</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold text-gray-900">1</span>
                <span className="text-xs text-gray-500 mt-0.5">Year</span>
              </div>
            </div>

            <div className="w-full border-t border-gray-100 my-6" />

            {/* Bio items */}
            {profile.note && (
              <div className="flex items-start gap-3 w-full text-left">
                <MessageCircle className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" strokeWidth={1.8} />
                <p className="text-sm text-gray-700 leading-relaxed italic">"{profile.note}"</p>
              </div>
            )}

            <div className="flex items-center gap-3 w-full text-left mt-4">
              <Shield className="w-5 h-5 text-gray-500 shrink-0" strokeWidth={1.8} />
              <p className="text-sm text-gray-700">Identity verified</p>
            </div>
          </div>

          {/* ── RIGHT: Details ── */}
          <div className="flex flex-col gap-6">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{displayName} is a verified member</h2>
              <p className="text-sm text-gray-500 mt-1">
                Verified members are trusted users committed to returning found items safely.
              </p>
            </div>

            <hr className="border-gray-200" />

            {/* Host details */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Profile details</h3>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <ShieldCheck className="w-4 h-4 text-gray-500 shrink-0" />
                  Identity verified
                </div>
                {profile.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Mail className="w-4 h-4 text-gray-500 shrink-0" />
                    {profile.email}
                  </div>
                )}
                {profile.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Phone className="w-4 h-4 text-gray-500 shrink-0" />
                    {profile.phone}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-4 h-4 flex items-center justify-center text-gray-500 shrink-0 text-xs font-mono">#</span>
                  Backtrack code: <span className="font-semibold ml-1">{publicCode}</span>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Chat button */}
            <div className="max-w-xs">
              <StartChatButton
                partnerId={userId}
                fallbackName={displayName}
                fallbackAvatarUrl={profile.avatarUrl ?? undefined}
              />
            </div>

            {/* Safety note */}
            <div className="flex items-start gap-3 bg-gray-50 rounded-2xl p-4 max-w-md">
              <img
                src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatform-1.0-largePng/original/6dbf56da-2f50-46cf-9e91-ed81d3bb2a2f.png"
                alt=""
                className="w-10 h-10 object-contain shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
              <p className="text-xs text-gray-500 leading-relaxed">
                To help keep everyone safe, always meet in public places when returning found items or use official drop-off points.
              </p>
            </div>

            <hr className="border-gray-200" />

            {/* Active items */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Active items
                {posts.length > 0 && (
                  <span className="ml-2 text-xs font-semibold text-gray-400">({posts.length})</span>
                )}
              </h3>

              {isPostsLoading ? (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="w-[200px] h-[240px] rounded-2xl shrink-0" />
                  ))}
                </div>
              ) : posts.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                  {posts.map((post) => <PostCard key={post.id} post={post} />)}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <PackageSearch className="w-8 h-8 text-gray-200 mb-2" />
                  <p className="text-sm text-gray-400">No active items</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Post card ── */
function PostCard({ post }: { post: Post }) {
  const navigate = useNavigate()
  const timeAgo = formatDistanceToNow(new Date(post.eventTime), { addSuffix: true })
  const imageUrl = post.images[0] ?? null
  const isLost = post.postType === 'Lost'

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate({ to: '/found/$id', params: { id: post.id } })}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ')
          navigate({ to: '/found/$id', params: { id: post.id } })
      }}
      className="min-w-[190px] max-w-[200px] bg-white rounded-2xl overflow-hidden border border-gray-200
                 snap-start shrink-0 cursor-pointer group hover:shadow-md transition-shadow focus:outline-none"
    >
      <div className="relative h-36 bg-gray-100 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={post.itemName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PackageSearch className="w-7 h-7 text-gray-300" />
          </div>
        )}
        <span className={`absolute top-2 left-2 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full
          ${isLost ? 'bg-rose-500' : 'bg-emerald-500'}`}>
          {isLost ? 'Lost' : 'Found'}
        </span>
      </div>

      <div className="p-3">
        <p className="font-semibold text-gray-900 text-sm truncate">{post.itemName}</p>
        <p className="text-[11px] text-gray-400 mt-0.5">{timeAgo}</p>
        {post.displayAddress && (
          <div className="flex items-center gap-1 mt-2">
            <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
            <span className="text-[11px] text-gray-400 truncate">{post.displayAddress}</span>
          </div>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="text-[11px] font-semibold text-gray-500">View details</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        </div>
      </div>
    </div>
  )
}
