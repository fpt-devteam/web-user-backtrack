import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import {
  ArrowLeft,
  CheckCircle,
  ChevronRight,
  MapPin,
  Megaphone,
  Shield,
  X,
} from 'lucide-react'
import type { Post } from '@/types/user.type'
import { useGetQrByPublicCode } from '@/hooks/use-qr'
import { useGetPublicUserProfile, useGetUserPosts } from '@/hooks/use-user'
import { StartChatButton } from '@/components/found-item/start-chat-button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { InlineMessage } from '@/components/ui/inline-message'
import { getErrorMessage } from '@/lib/utils'

export const Route = createFileRoute('/profile/$publicCode/')({
  component: OwnerProfilePage,
})

function OwnerProfilePage() {
  const { publicCode } = Route.useParams()
  const navigate = useNavigate()
  const [safetyDismissed, setSafetyDismissed] = useState(false)

  const { data: qrData, isLoading: isQrLoading, error: qrError } = useGetQrByPublicCode(publicCode)
  const userId = qrData?.userId ?? ''
  const { data: profile, isLoading: isProfileLoading } = useGetPublicUserProfile(userId, !!userId)
  const { data: postsData, isLoading: isPostsLoading } = useGetUserPosts(userId, !!userId)

  const isLoading = isQrLoading || isProfileLoading
  const posts = postsData ?? []
  const displayName = profile?.displayName ?? 'Unknown Owner'
  const initial = displayName[0].toUpperCase()

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col">

      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-20 bg-white border-b border-[#F0F0F0] px-4 h-14 flex items-center justify-between">
        <button
          onClick={() => navigate({ to: '/' })}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F5F5F5]
                     transition-colors duration-150 cursor-pointer focus:outline-none
                     focus-visible:ring-2 focus-visible:ring-brand-400"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-[#222]" />
        </button>
        <p className="text-sm font-bold text-[#111]">Owner Profile</p>
        <div className="w-9" />
      </header>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto pb-36">
        <div className="max-w-md mx-auto px-4 py-5 space-y-4">

          {/* Error */}
          {qrError && !isQrLoading && (
            <InlineMessage variant="error" title="Profile Not Found">
              {getErrorMessage(qrError)}
            </InlineMessage>
          )}

          {/* Safety banner */}
          {!safetyDismissed && (
            <div className="flex items-start gap-3 bg-[#EFF6FF] border border-[#BFDBFE]
                            rounded-2xl px-4 py-3.5">
              <Shield className="w-4.5 h-4.5 text-[#3B82F6] mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#1E3A5F]">Safety reminder</p>
                <p className="text-xs text-[#3B82F6]/80 mt-0.5 leading-relaxed">
                  Meet in public places or use verified drop-off points when returning items.
                </p>
              </div>
              <button
                onClick={() => setSafetyDismissed(true)}
                className="text-[#93C5FD] hover:text-[#3B82F6] transition-colors cursor-pointer shrink-0 mt-0.5"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Profile card */}
          {isLoading ? (
            <ProfileSkeleton />
          ) : qrData && (
            <>
              {/* Avatar block */}
              <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden
                              shadow-[0_2px_8px_rgba(0,0,0,0.06)]">

                {/* Cover strip */}
                <div className="h-24 bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 relative">
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }}
                  />
                </div>

                <div className="px-5 pb-5">
                  {/* Avatar — overlaps cover */}
                  <div className="flex items-end justify-between -mt-10 mb-3">
                    <div className="relative">
                      <Avatar className="w-20 h-20 border-4 border-white shadow-md ring-1 ring-[#E5E7EB]">
                        <AvatarImage src={profile?.avatarUrl ?? undefined} />
                        <AvatarFallback className="text-2xl font-black bg-brand-50 text-brand-600">
                          {initial}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0.5 right-0.5 w-6 h-6 bg-[#22C55E] rounded-full
                                       border-2 border-white flex items-center justify-center">
                        <CheckCircle className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                      </span>
                    </div>

                    {/* Verified badge */}
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F0FDF4] border border-[#BBF7D0]
                                     rounded-full text-xs font-bold text-[#16A34A]">
                      <CheckCircle className="w-3.5 h-3.5 text-[#22C55E]" />
                      Verified Owner
                    </span>
                  </div>

                  <h2 className="text-lg font-black text-[#111] tracking-tight">{displayName}</h2>
                  <p className="text-xs text-[#888] mt-0.5 font-medium">Backtrack member</p>
                </div>
              </div>

              {/* Owner's note */}
              {qrData.note && (
                <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5
                                shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-7 h-7 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                      <Megaphone className="w-3.5 h-3.5 text-brand-600" />
                    </span>
                    <p className="text-sm font-bold text-[#111]">Message from owner</p>
                  </div>
                  <p className="text-sm text-[#444] leading-relaxed italic border-l-2 border-brand-200 pl-3">
                    "{qrData.note}"
                  </p>
                </div>
              )}

              {/* Posts */}
              {isPostsLoading ? (
                <div>
                  <p className="text-sm font-bold text-[#111] mb-3">Is this what you found?</p>
                  <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
                    {[1, 2].map((i) => (
                      <Skeleton key={i} className="w-48 h-56 rounded-2xl shrink-0" />
                    ))}
                  </div>
                </div>
              ) : posts.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-[#111]">Is this what you found?</p>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-600">
                      Active items
                    </span>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-none">
                    {posts.map((post) => <PostCard key={post.id} post={post} />)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Fixed bottom CTA ── */}
      {qrData && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F0F0F0]
                        px-4 pt-3 pb-7 space-y-2 z-20">
          <StartChatButton partnerId={qrData.userId} />
          <button className="w-full text-xs text-[#bbb] text-center hover:text-[#888]
                             transition-colors cursor-pointer">
            Report a problem with this QR code
          </button>
        </div>
      )}
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
      className="min-w-[190px] max-w-[210px] bg-white rounded-2xl overflow-hidden
                 border border-[#EBEBEB] shadow-[0_2px_8px_rgba(0,0,0,0.06)]
                 snap-start shrink-0 cursor-pointer
                 hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:border-[#D1D1D1]
                 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
    >
      {/* Image */}
      <div className="relative h-32 bg-[#F5F5F5]">
        {imageUrl ? (
          <img src={imageUrl} alt={post.itemName} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[#ccc] text-xs">No image</span>
          </div>
        )}
        <span className={`absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full
          ${isLost ? 'bg-rose-500/90' : 'bg-emerald-500/90'}`}>
          {isLost ? 'Lost' : 'Found'}
        </span>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="font-bold text-[#111] text-sm leading-tight truncate">{post.itemName}</p>
        <p className="text-[11px] text-[#aaa] mt-0.5">{timeAgo}</p>
        {post.displayAddress && (
          <div className="flex items-center gap-1 mt-2">
            <MapPin className="w-3 h-3 text-[#aaa] shrink-0" />
            <span className="text-[11px] text-[#aaa] truncate">{post.displayAddress}</span>
          </div>
        )}
        <div className="flex items-center justify-end mt-2.5 gap-0.5">
          <span className="text-[11px] font-bold text-brand-600">View details</span>
          <ChevronRight className="w-3 h-3 text-brand-600" />
        </div>
      </div>
    </div>
  )
}

/* ── Skeleton ── */
function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl overflow-hidden border border-[#EBEBEB]">
        <Skeleton className="h-24 w-full rounded-none" />
        <div className="px-5 pb-5 -mt-10 space-y-2">
          <Skeleton className="w-20 h-20 rounded-full border-4 border-white" />
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-3.5 w-24" />
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-[#EBEBEB] p-5 space-y-2">
        <Skeleton className="h-4 w-40 mb-3" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-4/5" />
      </div>
      <div>
        <Skeleton className="h-4 w-44 mb-3" />
        <div className="flex gap-3">
          <Skeleton className="w-48 h-56 rounded-2xl shrink-0" />
          <Skeleton className="w-48 h-56 rounded-2xl shrink-0" />
        </div>
      </div>
    </div>
  )
}
