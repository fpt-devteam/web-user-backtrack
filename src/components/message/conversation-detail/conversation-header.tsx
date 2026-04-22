import { useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import type { InfiniteData } from '@tanstack/react-query'
import type { Conversation } from '@/types/chat.type'
import type { CursorPagedResponse } from '@/types/pagination.type'
import { useGetConversationById, messageKeys } from '@/hooks/use-message'
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

export function ConversationHeader({ conversationId, fallback, onClose }: ConversationHeaderProps) {
  const queryClient = useQueryClient()

  // Use cached list data as a placeholder while the single-conversation fetch loads
  const cachedPages = queryClient.getQueryData<InfiniteData<CursorPagedResponse<Conversation>>>(
    messageKeys.conversations()
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

  // Merge: detail fetch may lack partner/org fields that the list endpoint provides.
  // Use detail as base but fill in partner/org from the cached list entry when missing.
  const conversation = fetchedConversation
    ? {
        ...fetchedConversation,
        partner: fetchedConversation.partner ?? cachedConversation?.partner,
        orgName: fetchedConversation.orgName ?? cachedConversation?.orgName,
        orgSlug: fetchedConversation.orgSlug ?? cachedConversation?.orgSlug,
        orgLogoUrl: fetchedConversation.orgLogoUrl ?? cachedConversation?.orgLogoUrl,
      }
    : cachedConversation
  const { isConnected } = useSocket()

  // Support conversations: use stored orgName first, fall back to slug lookup when missing
  const needsOrgLookup = !conversation?.orgName?.trim() && !!conversation?.orgSlug
  const { data: org, isLoading: isOrgLoading } = useGetOrgBySlug(
    conversation?.orgSlug ?? '',
    needsOrgLookup,
  )

  // If the conversation's partner has no displayName, fetch their public profile
  const partnerId = conversation?.partner?.id ?? ''
  const missingPartnerName = !!partnerId && !conversation?.partner?.displayName.trim()
  const { data: partnerProfile, isLoading: isPartnerLoading } = useGetPublicUserProfile(
    partnerId,
    missingPartnerName,
  )

  // Resolve display name + avatar — prefer conversation data, then fetched profile, then fallback
  const name =
    conversation?.orgName?.trim() ||
    org?.name.trim() ||
    conversation?.partner?.displayName.trim() ||
    partnerProfile?.displayName?.trim() ||
    fallback?.name ||
    'Unknown'
  const avatarUrl =
    conversation?.orgLogoUrl?.trim() ??
    org?.logoUrl?.trim() ??
    conversation?.partner?.avatarUrl?.trim() ??
    conversation?.partner?.avatar?.trim() ??
    partnerProfile?.avatarUrl?.trim() ??
    fallback?.avatarUrl ??
    undefined
  const initial = name.charAt(0).toUpperCase()

  // Still waiting for a secondary fetch that resolves the name
  const isResolvingName =
    (needsOrgLookup && isOrgLoading) || (missingPartnerName && isPartnerLoading)

  /* ── Skeleton — show while loading conversation OR resolving name, unless fallback covers it ── */
  if (conversationId && (isLoading || !conversation || isResolvingName) && !fallback) {
    return (
      <header className="flex items-center gap-3 px-5 py-3.5 border-b-2 border-gray-300 bg-white shrink-0">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-1.5 -ml-1.5 rounded-full hover:bg-gray-100 transition-colors shrink-0"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" strokeWidth={2} />
          </button>
        )}
        <div className="relative shrink-0">
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-4 w-32 rounded-full" />
          <Skeleton className="h-3 w-20 rounded-full" />
        </div>
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
      {/* Back button — mobile only */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="md:hidden p-1.5 -ml-1.5 rounded-full hover:bg-gray-100 transition-colors shrink-0"
          aria-label="Back"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" strokeWidth={2} />
        </button>
      )}
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

    </motion.header>
  )
}
