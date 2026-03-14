import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useGetQrByPublicCode } from '@/hooks/use-qr'
import { useGetPublicUserProfile, useGetUserPosts } from '@/hooks/use-user'
import { StartChatButton } from '@/components/found-item/start-chat-button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { InlineMessage } from '@/components/ui/inline-message'
import { getErrorMessage } from '@/lib/utils'
import type { Post } from '@/types/user.type'
import { X, Shield, CheckCircle, Megaphone, ChevronRight } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export const Route = createFileRoute('/profile/$public-code/')({
  component: OwnerProfilePage,
})

function OwnerProfilePage() {
  const { 'public-code': publicCode } = Route.useParams()
  const navigate = useNavigate()
  const [safetyDismissed, setSafetyDismissed] = useState(false)

  const {
    data: qrData,
    isLoading: isQrLoading,
    error: qrError,
  } = useGetQrByPublicCode(publicCode)

  const userId = qrData?.userId ?? ''

  const {
    data: profile,
    isLoading: isProfileLoading,
  } = useGetPublicUserProfile(userId, !!userId)

  const {
    data: postsData,
    isLoading: isPostsLoading,
  } = useGetUserPosts(userId, !!userId)

  const isLoading = isQrLoading || isProfileLoading || isPostsLoading
  const posts = postsData?.items ?? []

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={() => navigate({ to: '/' })}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-base font-semibold text-gray-900">Owner Profile</h1>
        <div className="w-7" />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="max-w-md mx-auto px-4 py-4 space-y-4">

          {/* Error State */}
          {qrError && !isQrLoading && (
            <InlineMessage variant="error" title="Profile Not Found">
              {getErrorMessage(qrError)}
            </InlineMessage>
          )}

          {/* Safety Banner */}
          {!safetyDismissed && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">Safety First</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  Please meet in public places or use safe drop-off points when returning items.
                </p>
              </div>
              <button
                onClick={() => setSafetyDismissed(true)}
                className="p-0.5 rounded hover:bg-blue-100 transition-colors shrink-0"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          )}

          {/* Profile Section */}
          {isLoading ? (
            <ProfileSkeleton />
          ) : qrData && (
            <>
              {/* Avatar + Name */}
              <div className="flex flex-col items-center pt-2 pb-1 gap-3">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-md">
                    <AvatarImage src={profile?.avatarUrl ?? undefined} />
                    <AvatarFallback className="text-2xl font-semibold bg-gray-200 text-gray-600">
                      {(profile?.displayName ?? '?')[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 w-7 h-7 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white fill-white" />
                  </div>
                </div>

                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-900">
                    {profile?.displayName ?? 'Unknown Owner'}
                  </h2>
                </div>

                <Badge className="bg-green-50 text-green-600 border border-green-200 hover:bg-green-50 gap-1.5 px-3 py-1">
                  <CheckCircle className="w-3.5 h-3.5 fill-green-500 text-white" />
                  Verified Owner
                </Badge>
              </div>

              {/* Owner's Note */}
              {qrData.note && (
                <Card className="p-4 border-l-4 border-l-blue-400">
                  <div className="flex items-center gap-2 mb-3">
                    <Megaphone className="w-5 h-5 text-blue-500" />
                    <span className="font-semibold text-gray-900">Owner's Note</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    "{qrData.note}"
                  </p>
                </Card>
              )}

              {/* Posts Section */}
              {posts.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-bold text-gray-900">Is this what you found?</h3>
                    <span className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
                      Active Items
                    </span>
                  </div>

                  <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory">
                    {posts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      {qrData && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 pt-3 pb-6 space-y-2">
          <StartChatButton partnerId={qrData.userId} />
          <button className="w-full text-xs text-gray-400 text-center hover:text-gray-600 transition-colors">
            Report a problem with this QR code
          </button>
        </div>
      )}
    </div>
  )
}

function PostCard({ post }: { post: Post }) {
  const lostAgo = formatDistanceToNow(new Date(post.eventTime), { addSuffix: false })
  const imageUrl = post.imageUrls?.[0]

  return (
    <div className="min-w-[200px] max-w-[220px] bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 snap-start shrink-0">
      {/* Image */}
      <div className="relative h-36 bg-gray-100">
        {imageUrl ? (
          <img src={imageUrl} alt={post.itemName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400 text-xs">No image</span>
          </div>
        )}
        <div className="absolute top-2 left-2 bg-gray-900/70 text-white text-xs font-medium px-2 py-1 rounded-full">
          Lost {lostAgo} ago
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="font-semibold text-gray-900 text-sm leading-tight">{post.itemName}</p>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{post.description}</p>
        {post.displayAddress && (
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400 truncate max-w-[140px]">{post.displayAddress}</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          </div>
        )}
      </div>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <>
      <div className="flex flex-col items-center gap-3 pt-2">
        <Skeleton className="w-24 h-24 rounded-full" />
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-7 w-32 rounded-full" />
      </div>
      <Card className="p-4">
        <Skeleton className="h-5 w-32 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </Card>
      <div>
        <Skeleton className="h-5 w-44 mb-3" />
        <div className="flex gap-3">
          <Skeleton className="w-52 h-56 rounded-2xl shrink-0" />
          <Skeleton className="w-52 h-56 rounded-2xl shrink-0" />
        </div>
      </div>
    </>
  )
}
