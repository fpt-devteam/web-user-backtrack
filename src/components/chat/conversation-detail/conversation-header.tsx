import { useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { Phone, Video } from 'lucide-react'
import type { InfiniteData } from '@tanstack/react-query'
import type { Conversation } from '@/types/chat.type'
import type { CursorPagedResponse } from '@/types/pagination.type'
import { useGetConversationById } from '@/hooks/use-chat'
import { messagerKeys } from '@/hooks/use-messager'
import { useGetOrgBySlug } from '@/hooks/use-org'
import { useGetPublicUserProfile } from '@/hooks/use-user'
import { useSocket } from '@/hooks/use-socket'
import { Skeleton } from '@/components/ui/skeleton'

type ConversationHeaderProps = {
  readonly conversationId?: string
  /** Fallback display data — used when there is no conversationId yet (new-chat flow) */
  readonly fallback?: {
    name: string
    avatarUrl?: string | null
  }
  /** Called when the user clicks the close button (split-layout only) */
  readonly onClose?: () => void
}

export function ConversationHeader({ conversationId, fallback }: ConversationHeaderProps) {
  const queryClient = useQueryClient()

  // Use cached list data as a placeholder while the single-conversation fetch loads
  const cachedPages = queryClient.getQueryData<InfiniteData<CursorPagedResponse<Conversation>>>(
    messagerKeys.conversations()
  )
  const cachedConversation = conversationId
    ? cachedPages?.pages.flatMap((p) => p.items).find((c) => c.conversationId === conversationId)
    : undefined

  // Always fetch the single conversation — the list endpoint often omits full
  // partner profile data (displayName / avatarUrl), so we need the detail call.
  const { data: fetchedConversation, isLoading } = useGetConversationById(
    conversationId ?? '',
    !!conversationId,
  )

  // Prefer the detail fetch (complete data); fall back to cached list entry while loading
  const conversation = fetchedConversation ?? cachedConversation
  const { isConnected } = useSocket()

  // Support conversations: use stored orgName first, fall back to slug lookup for legacy convs
  const { data: org } = useGetOrgBySlug(conversation?.orgSlug ?? '', !conversation?.orgName)

  // If the conversation's partner has no displayName, fetch their public profile
  const partnerId = conversation?.partner?.id ?? ''
  const missingPartnerName = !!partnerId && !conversation?.partner?.displayName?.trim()
  const { data: partnerProfile } = useGetPublicUserProfile(partnerId, missingPartnerName)

  // Resolve display name + avatar — prefer conversation data, then public profile, then fallback prop
  const name =
    conversation?.orgName?.trim() ||
    org?.name.trim() ||
    conversation?.partner?.displayName?.trim() ||
    partnerProfile?.displayName?.trim() ||
    fallback?.name ||
    'Unknown'
  const avatarUrl =
    conversation?.orgLogoUrl?.trim() ??
    conversation?.partner?.avatarUrl?.trim() ??
    conversation?.partner?.avatar?.trim() ??
    partnerProfile?.avatarUrl?.trim() ??
    org?.logoUrl?.trim() ??
    fallback?.avatarUrl ??
    undefined
  const initial = name.charAt(0).toUpperCase()

  /* ── Skeleton — only when fetching, not when using fallback ── */
  if (conversationId && (isLoading || !conversation) && !fallback) {
    return (
      <header className="flex items-center gap-3 px-5 py-3.5 border-b-2 border-gray-300 bg-white shrink-0">
        <div className="relative shrink-0">
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-4 w-32 rounded-full" />
          <Skeleton className="h-3 w-20 rounded-full" />
        </div>
        <Skeleton className="w-9 h-9 rounded-full" />
        <Skeleton className="w-9 h-9 rounded-full" />
      </header>
    )
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-3 px-5 py-3.5 border-b-2 border-gray-300 bg-white shrink-0"
    >
      {/* Avatar + online dot */}
      <div className="relative shrink-0">
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center ring-2 ring-gray-200">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name || 'Chat'} className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm font-bold text-gray-500">{initial}</span>
          )}
        </div>
        {/* Online / Offline dot */}
        <AnimatePresence mode="wait">
          <motion.span
            key={isConnected ? 'on' : 'off'}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
              isConnected ? 'bg-green-500' : 'bg-gray-300'
            }`}
          />
        </AnimatePresence>
      </div>

      {/* Name + status */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate leading-tight">{name}</p>
        <AnimatePresence mode="wait">
          {isConnected ? (
            <motion.p
              key="on"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-green-500 font-medium leading-tight"
            >
              Active now
            </motion.p>
          ) : (
            <motion.p
              key="off"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-gray-400 leading-tight"
            >
              Offline
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Action icons */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Voice call"
        >
          <Phone className="w-5 h-5 text-gray-800" strokeWidth={1.8} />
        </button>
        <button
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Video call"
        >
          <Video className="w-5 h-5 text-gray-800" strokeWidth={1.8} />
        </button>
      </div>
    </motion.header>
  )
}
