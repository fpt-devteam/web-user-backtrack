import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import {
  ArrowLeft,
  CheckCircle,
  ChevronRight,
  MapPin,
  PackageSearch,
  Shield,
  X,
} from 'lucide-react'
import type { Post } from '@/types/user.type'
import { useGetPublicQrProfile } from '@/hooks/use-qr'
import { useGetUserPosts } from '@/hooks/use-user'
import { StartChatButton } from '@/components/found-item/start-chat-button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { getErrorMessage } from '@/lib/utils'

export const Route = createFileRoute('/profile/$publicCode/')({
  component: OwnerProfilePage,
})

function OwnerProfilePage() {
  const { publicCode } = Route.useParams()
  const navigate = useNavigate()
  const [safetyDismissed, setSafetyDismissed] = useState(false)

  // Use the new hook for the public profile
  const { data: profile, isLoading: isProfileLoading, error: profileError } = useGetPublicQrProfile(publicCode)
  const userId = profile?.userId ?? ''
  
  // Use existing hooks for other data (posts)
  const { data: postsData, isLoading: isPostsLoading } = useGetUserPosts(userId, !!userId)

  const isLoading = isProfileLoading
  const posts = postsData ?? []
  const displayName = profile?.displayName ?? 'User'
  const initial = displayName[0]?.toUpperCase() ?? 'U'

  // Redirect to home if profile not found
  useEffect(() => {
    if (profileError) {
      const timer = setTimeout(() => {
        navigate({ to: '/' })
      }, 2000) // Show error for 2s before redirecting
      return () => clearTimeout(timer)
    }
  }, [profileError, navigate])

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col pb-40">
      
      {/* ── Floating back button ── */}
      <button
        onClick={() => navigate({ to: '/' })}
        className="fixed top-5 left-5 z-40 w-11 h-11 flex items-center justify-center rounded-2xl 
                   bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-gray-100
                   hover:bg-gray-50 active:scale-95 transition-all duration-200 cursor-pointer 
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 group"
        aria-label="Go back"
      >
        <ArrowLeft className="w-5 h-5 text-gray-700 group-hover:text-brand-600 transition-colors" />
      </button>

      {/* ── Cover / Header ── */}
      <div className="relative h-48 bg-brand-500 overflow-hidden shrink-0">
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 px-5 -mt-16 z-10">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Profile Card */}
          {isLoading ? (
            <ProfileSkeleton />
          ) : profile ? (
            <div className="bg-white rounded-[2.5rem] p-6 lg:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 sm:gap-6 -mt-16 sm:-mt-20">
                <div className="relative">
                  <Avatar className="w-28 h-28 sm:w-32 sm:h-32 border-[6px] border-white shadow-xl ring-1 ring-black/5">
                    <AvatarImage src={profile?.avatarUrl ?? undefined} className="object-cover" />
                    <AvatarFallback className="text-4xl font-black bg-brand-50 text-brand-600">
                      {initial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-1 right-1 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left pb-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                    <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                      {displayName}
                    </h1>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider rounded-full border border-emerald-100">
                      <Shield className="w-3 h-3" />
                      Verified
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-400">Owner of Backtrack code: {publicCode}</p>
                </div>
              </div>

              {/* Contact Info */}
              {(profile?.email || profile?.phone) && (
                <div className="mt-6 flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6 border-t border-gray-50 pt-6">
                  {profile.email && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold">{profile.email}</span>
                    </div>
                  )}
                  {profile.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold">{profile.phone}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Note */}
              {profile?.note && (
                <div className="mt-8 relative">
                  <div className="absolute -top-4 -left-2 text-6xl text-brand-100 font-serif leading-none select-none">“</div>
                  <p className="relative text-gray-600 leading-relaxed text-base italic font-medium pl-2">
                    {profile.note}
                  </p>
                </div>
              )}
            </div>
          ) : null}

          {/* Error Message */}
          {profileError && !isProfileLoading && (
            <div className="bg-red-50 border border-red-100 rounded-[2rem] p-5 text-center">
              <X className="w-10 h-10 text-red-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-red-900">Profile Not Found</p>
              <p className="text-xs text-red-600 mt-1">{getErrorMessage(profileError)}</p>
            </div>
          )}

          {/* Safety Reminder */}
          {!safetyDismissed && (
            <div className="bg-brand-50/50 border border-brand-100 rounded-[2rem] p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-brand-100 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-brand-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-brand-900">Safety First</p>
                <p className="text-xs text-brand-700/70 mt-0.5 leading-relaxed font-medium">
                  When returning found items, always meet in safe public locations or use official drop-off points.
                </p>
              </div>
              <button 
                onClick={() => setSafetyDismissed(true)}
                className="text-brand-300 hover:text-brand-600 transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Items Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-black text-gray-900 tracking-tight">Active Items</h3>
              {posts.length > 0 && (
                <span className="text-[10px] font-black text-brand-500 uppercase tracking-widest bg-brand-50 px-2 py-0.5 rounded-md">
                  {posts.length} {posts.length === 1 ? 'Item' : 'Items'}
                </span>
              )}
            </div>

            {isPostsLoading ? (
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="w-[220px] h-[280px] rounded-[2rem] shrink-0" />
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none px-1">
                {posts.map((post) => <PostCard key={post.id} post={post} />)}
              </div>
            ) : (
              <div className="bg-white rounded-[2rem] border border-gray-100 p-8 text-center space-y-2">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <PackageSearch className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-sm font-bold text-gray-500">No active items found</p>
                <p className="text-xs text-gray-400">The owner hasn't listed any items for this code yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Sticky Bottom Bar ── */}
      {profile && (
        <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/80 backdrop-blur-xl border-t border-gray-100 z-30">
          <div className="max-w-md mx-auto space-y-3">
            <StartChatButton partnerId={userId} />
            <button className="w-full text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest text-center">
              Report this profile
            </button>
          </div>
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
      className="min-w-[210px] max-w-[220px] bg-white rounded-[2rem] overflow-hidden
                 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]
                 snap-start shrink-0 cursor-pointer group
                 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-brand-100
                 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
    >
      {/* Image */}
      <div className="relative h-40 bg-gray-50 overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={post.itemName} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            loading="lazy" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PackageSearch className="w-8 h-8 text-gray-200" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className={`absolute top-3 left-3 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-sm
          ${isLost ? 'bg-rose-500' : 'bg-emerald-500'}`}>
          {isLost ? 'Lost' : 'Found'}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="font-black text-gray-900 text-sm leading-tight truncate group-hover:text-brand-600 transition-colors">
          {post.itemName}
        </p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="text-[10px] font-bold text-gray-400">{timeAgo}</span>
        </div>
        
        {post.displayAddress && (
          <div className="flex items-center gap-1 mt-3">
            <MapPin className="w-3 h-3 text-brand-400 shrink-0" />
            <span className="text-[10px] font-bold text-gray-400 truncate">{post.displayAddress}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Details</span>
          <div className="w-6 h-6 rounded-full bg-brand-50 flex items-center justify-center group-hover:bg-brand-500 transition-colors">
            <ChevronRight className="w-3 h-3 text-brand-500 group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Skeleton ── */
function ProfileSkeleton() {
  return (
    <div className="bg-white rounded-[2.5rem] p-6 lg:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100">
      <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 sm:gap-6 -mt-16 sm:-mt-20">
        <Skeleton className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-[6px] border-white shadow-xl" />
        <div className="flex-1 space-y-2 text-center sm:text-left">
          <Skeleton className="h-8 w-48 mx-auto sm:mx-0" />
          <Skeleton className="h-4 w-32 mx-auto sm:mx-0" />
        </div>
      </div>
      <div className="mt-8 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  )
}
