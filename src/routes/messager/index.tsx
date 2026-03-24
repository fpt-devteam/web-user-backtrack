import { createFileRoute } from '@tanstack/react-router'
import { useGetConversations } from '@/hooks/use-messager'
import { useGetOrgById } from '@/hooks/use-org'
import { Skeleton } from '@/components/ui/skeleton'
import { Edit, Search, Send } from 'lucide-react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { useState } from 'react'
import type { Conversation } from '@/types/chat.type'
import { ConversationHeader } from '@/components/chat/conversation-detail/conversation-header'
import { MessageList } from '@/components/chat/conversation-detail/message-list'
import { MessageInput } from '@/components/chat/conversation-detail/message-input'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/messager/')({
  component: MessagerPage,
})

/* ── Motion variants ─────────────────────────────────────── */
const listItem: Variants = {
  hidden: { opacity: 0, x: -8 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  }),
}

/* ── Helpers ─────────────────────────────────────────────── */
function formatTimestamp(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60_000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m`
  const diffHrs = Math.floor(diffMins / 60)
  if (diffHrs < 24) return `${diffHrs}h`
  const diffDays = Math.floor(diffHrs / 24)
  if (diffDays < 7) return `${diffDays}d`
  const diffWeeks = Math.floor(diffDays / 7)
  if (diffWeeks < 52) return `${diffWeeks}w`
  return d.toLocaleDateString()
}

/* ── ConversationListItem ─────────────────────────────────── */
type ConversationListItemProps = {
  readonly conv: Conversation
  readonly index: number
  readonly isActive: boolean
  readonly onClick: () => void
}

function ConversationListItem({ conv, index, isActive, onClick }: ConversationListItemProps) {
  // Fetch org when orgId is present (support/org conversations have partner = null)
  const { data: org } = useGetOrgById(conv.orgId ?? '')

  // Resolve display name:
  //   - direct conversation  → partner.displayName
  //   - support conversation → org.name (fetched via orgId)
  //   - fallback             → 'Unknown'
  const displayName =
    conv.partner?.displayName?.trim() ||
    org?.name?.trim() ||
    'Unknown'

  // API returns avatarUrl (not avatar)
  const avatarUrl = conv.partner?.avatarUrl?.trim() ?? conv.partner?.avatar?.trim()

  // API returns lastMessage.content (not lastContent)
  const lastContent = conv.lastMessage?.content ?? conv.lastMessage?.lastContent

  return (
    <motion.div
      custom={index}
      variants={listItem}
      initial="hidden"
      animate="show"
    >
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'w-full flex items-center gap-3 px-5 py-3 transition-colors duration-100 text-left',
          isActive ? 'bg-gray-100' : 'hover:bg-gray-50',
        )}
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-[56px] h-[56px] rounded-full bg-gray-200 flex items-center justify-center overflow-hidden ring-1 ring-gray-100">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-gray-400">
                {displayName[0]?.toUpperCase() ?? '?'}
              </span>
            )}
          </div>
          {/* Unread badge */}
          {conv.unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#0095f6] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm">
              {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
            </span>
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm leading-snug truncate ${
              conv.unreadCount > 0
                ? 'font-bold text-gray-900'
                : 'font-semibold text-gray-800'
            }`}
          >
            {displayName}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            {lastContent ? (
              <p
                className={`text-xs truncate max-w-[170px] ${
                  conv.unreadCount > 0
                    ? 'font-semibold text-gray-900'
                    : 'text-gray-400 font-normal'
                }`}
              >
                {lastContent}
              </p>
            ) : null}
            {conv.lastMessage?.timestamp && (
              <span className="text-[11px] text-gray-400 shrink-0">
                {lastContent ? ' · ' : ''}
                {formatTimestamp(conv.lastMessage.timestamp)}
              </span>
            )}
          </div>
        </div>
      </button>
    </motion.div>
  )
}

/* ── Page ────────────────────────────────────────────────── */
function MessagerPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetConversations()

  const conversations =
    data?.pages.flatMap((p) => p.items ?? []).filter(Boolean) ?? []

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* ═══════════════════════════════
          LEFT PANEL — conversation list
      ═══════════════════════════════ */}
      <aside className="w-[340px] flex-shrink-0 border-r border-gray-200 flex flex-col h-full">

        {/* Header */}
        <div className="px-5 pt-10 pb-3">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              Messages
            </span>
            <button
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="New message"
            >
              <Edit className="w-5 h-5 text-gray-800" strokeWidth={1.8} />
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              strokeWidth={2}
            />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-gray-100 rounded-full pl-9 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-0"
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <ConversationListSkeleton />
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <p className="text-sm font-semibold text-gray-900 mb-1">No messages yet</p>
              <p className="text-xs text-gray-400">
                Start a conversation with someone.
              </p>
            </div>
          ) : (
            <>
              {conversations.map((conv, i) => (
                <ConversationListItem
                  key={conv.conversationId}
                  conv={conv}
                  index={i}
                  isActive={conv.conversationId === selectedId}
                  onClick={() => setSelectedId(conv.conversationId)}
                />
              ))}

              {/* Load more */}
              {hasNextPage && (
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="w-full py-4 text-xs font-semibold text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isFetchingNextPage ? 'Loading…' : 'Load more'}
                </button>
              )}
            </>
          )}
        </div>
      </aside>

      {/* ═══════════════════════════════
          RIGHT PANEL — empty state OR active chat
      ═══════════════════════════════ */}
      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        <AnimatePresence mode="wait">
          {selectedId ? (
            <motion.div
              key={selectedId}
              className="flex flex-col h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {/* Header — no back button needed inside split layout */}
              <ConversationHeader
                conversationId={selectedId}
                onClose={() => setSelectedId(null)}
              />

              {/* Messages */}
              <div className="flex-1 min-h-0">
                <MessageList conversationId={selectedId} />
              </div>

              {/* Input */}
              <div className="shrink-0 border-t border-gray-100">
                <MessageInput conversationId={selectedId} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              className="flex-1 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <InboxEmptyState />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

/* ── Skeletons ───────────────────────────────────────────── */
function ConversationListSkeleton() {
  return (
    <div>
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-5 py-3">
          <Skeleton className="w-14 h-14 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-28 rounded-full" />
            <Skeleton className="h-3 w-44 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── Right-panel empty state ─────────────────────────────── */
function InboxEmptyState() {
  return (
    <motion.div
      className="flex flex-col items-center gap-4 text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="w-[90px] h-[90px] rounded-full border-2 border-gray-900 flex items-center justify-center">
        <Send className="w-10 h-10 text-gray-900 -rotate-12" strokeWidth={1.4} />
      </div>

      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-gray-900">Your messages</h2>
        <p className="text-sm text-gray-500 max-w-[220px] leading-relaxed">
          Send a message to start a chat.
        </p>
      </div>
    </motion.div>
  )
}
