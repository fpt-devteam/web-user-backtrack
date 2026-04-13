import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Message } from '@/types/chat.type'
import type { CursorPagedResponse } from '@/types/pagination.type'
import { chatKeys, useGetMessages } from '@/hooks/use-chat'
import { useSocket } from '@/hooks/use-socket'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'


interface MessageListProps {
  readonly conversationId?: string
}

export function MessageList({ conversationId = '' }: MessageListProps) {
  const { profile, firebaseUser } = useAuth()
  const {
    socket,
    joinConversation,
    leaveConversation,
    markConversationAsRead,
    onMessageSendSuccess,
    onMessageSendSupportSuccess,
    onMessageSeen,
    onConversationNew,
  } = useSocket()
  const queryClient = useQueryClient()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [typingUserIds, setTypingUserIds] = useState<Array<string>>([])
  const typingTimersRef = useRef<Record<string, ReturnType<typeof setTimeout> | undefined>>({})
  // Timestamp of when the other party last read our messages (for "Seen" receipt)
  const [seenAt, setSeenAt] = useState<string | null>(null)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetMessages(conversationId)

  /* ── Helpers ── */
  const isNearBottom = useCallback(() => {
    const el = scrollContainerRef.current
    if (!el) return true
    return el.scrollHeight - el.scrollTop - el.clientHeight < 120
  }, [])

  const scrollToBottom = useCallback(() => {
    const el = scrollContainerRef.current
    if (el) el.scrollTop = el.scrollHeight
    else messagesEndRef.current?.scrollIntoView({ behavior: 'auto' })
  }, [])

  /* ── Inject message into cache ── */
  const injectMessage = useCallback(
    (message: Message, targetConversationId?: string) => {
      const cid = targetConversationId || conversationId
      if (!cid || message.conversationId !== cid) return
      queryClient.setQueryData<{
        pages: Array<CursorPagedResponse<Message>>
        pageParams: Array<string | null>
      }>(chatKeys.messages(cid), (old) => {
        if (!old) {
          // Seed the cache for a brand-new conversation — no prior fetch exists yet
          return {
            pages: [{ items: [message], nextCursor: null, hasMore: false }],
            pageParams: [null],
          }
        }
        const first = old.pages[0]
        if (first.items.some((m) => m.id === message.id)) return old
        return {
          ...old,
          pages: [
            { ...first, items: [message, ...first.items] },
            ...old.pages.slice(1),
          ],
        }
      })
    },
    [conversationId, queryClient],
  )

  /* ── Socket lifecycle ── */
  // Re-runs whenever socket connects/reconnects so the join is never missed.
  // Also invalidates the messages cache so a fresh fetch runs after joining.
  useEffect(() => {
    if (!conversationId || !socket) return
    joinConversation(conversationId)
    queryClient.invalidateQueries({ queryKey: chatKeys.messages(conversationId) })
    return () => { leaveConversation(conversationId) }
  }, [conversationId, socket, joinConversation, leaveConversation, queryClient])

  // Reset per-conversation state when switching conversations
  useEffect(() => {
    if (!conversationId) return
    setIsInitialLoad(true)
    setSeenAt(null)
  }, [conversationId])

  /* ── Mark as read ── */
  // Emit conversation:read when opening the conversation and whenever the tab
  // regains visibility. Server resets unreadCount and sends message:seen to the
  // other party; also emits conversation:unread { unreadCount: 0 } back to this
  // user for multi-tab sync.
  useEffect(() => {
    if (!conversationId || !socket) return
    markConversationAsRead(conversationId)

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        markConversationAsRead(conversationId)
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [conversationId, socket, markConversationAsRead])

  /* ── Incoming messages ── */
  useEffect(() => {
    if (!socket) return
    const handle = (msg: Message) => injectMessage(msg)
    socket.on('message:new', handle)
    return () => { socket.off('message:new', handle) }
  }, [socket, injectMessage])

  // message:send:success — own message confirmed by server
  useEffect(() => {
    if (!socket) return
    return onMessageSendSuccess((d) => {
      injectMessage(d.message, d.conversationId)
    })
  }, [socket, onMessageSendSuccess, injectMessage])

  useEffect(() => {
    if (!socket) return
    return onMessageSendSupportSuccess((d) => {
      injectMessage(d.message, d.conversationId)
    })
  }, [socket, onMessageSendSupportSuccess, injectMessage])

  // conversation:new — first message in a brand-new conversation started by the other party
  useEffect(() => {
    if (!socket) return
    return onConversationNew((d) => {
      injectMessage(d.message, d.conversationId)
    })
  }, [socket, onConversationNew, injectMessage])

  /* ── Seen receipt ── */
  // message:seen fires when the other party opens/reads our messages.
  // We track seenAt so we can render a "Seen" label below our last read message.
  useEffect(() => {
    if (!socket) return
    return onMessageSeen((d) => {
      if (d.conversationId !== conversationId) return
      setSeenAt(d.readAt)
    })
  }, [socket, conversationId, onMessageSeen])

  const allMessages = (data?.pages.flatMap((p) => p.items) ?? []).reverse()

  useEffect(() => {
    if (!data) return
    if (isInitialLoad) { scrollToBottom(); setIsInitialLoad(false); return }
    if (isNearBottom()) scrollToBottom()
  }, [allMessages.length, data, isInitialLoad, isNearBottom, scrollToBottom])

  /* ── Typing indicators ── */
  useEffect(() => {
    if (!socket) return
    const handle = (d: { conversationId: string; userId: string; isTyping: boolean }) => {
      if (d.conversationId !== conversationId || d.userId === profile?.id || d.userId === firebaseUser?.uid) return
      const { userId, isTyping } = d
      const existing = typingTimersRef.current[userId]
      if (existing) clearTimeout(existing)
      if (isTyping) {
        typingTimersRef.current[userId] = setTimeout(() => {
          delete typingTimersRef.current[userId]
          setTypingUserIds((p) => p.filter((id) => id !== userId))
        }, 4000)
        setTypingUserIds((p) => (p.includes(userId) ? p : [...p, userId]))
      } else {
        delete typingTimersRef.current[userId]
        setTypingUserIds((p) => p.filter((id) => id !== userId))
      }
    }
    socket.on('typing:user', handle)
    return () => {
      socket.off('typing:user', handle)
      Object.values(typingTimersRef.current).forEach((t) => { if (t) clearTimeout(t) })
    }
  }, [socket, conversationId, profile?.id])

  /* ── Infinite scroll ── */
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || isFetchingNextPage || !hasNextPage) return
    if (scrollContainerRef.current.scrollTop < 80) fetchNextPage()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  /* ── Compute last-sent-message-id for "Seen" receipt ── */
  let lastSentMsgId: string | undefined
  if (seenAt) {
    const seenDate = new Date(seenAt)
    for (let i = allMessages.length - 1; i >= 0; i--) {
      const m = allMessages[i]
      if ((m.senderId === profile?.id || m.senderId === firebaseUser?.uid) && new Date(m.createdAt) <= seenDate) {
        lastSentMsgId = m.id
        break
      }
    }
  }

  /* ── Loading state ── */
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
      </div>
    )
  }

  /* ── Empty state with quick suggestions ── */
  if (!allMessages.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex h-full flex-col items-center justify-center gap-4 px-6"
      >
        <div className="w-14 h-14 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
          <span className="text-2xl">👋</span>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-700">Start the conversation</p>
          <p className="text-xs text-gray-400 mt-0.5">Send a message to get things started</p>
        </div>
        <p className="text-xs text-gray-400">Use the suggestions below to get started ↓</p>
      </motion.div>
    )
  }

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="flex flex-col h-full overflow-y-auto px-4 py-4 bg-gray-50/40"
      style={{ scrollbarWidth: 'none' }}
    >
      {/* Load-older spinner */}
      <AnimatePresence>
        {isFetchingNextPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center pb-3"
          >
            <Loader2 className="h-4 w-4 animate-spin text-gray-300" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex flex-col gap-1">
        {allMessages.map((message, index) => {
          // senderId can be either the backend UUID (profile.id) or Firebase UID
          // depending on which service stored the message — check both
          const isMe =
            message.senderId === profile?.id ||
            message.senderId === firebaseUser?.uid

          // Grouping: same sender, within 2 min of adjacent messages
          const next = index + 1 < allMessages.length ? allMessages[index + 1] : undefined
          const prev = index > 0 ? allMessages[index - 1] : undefined
          const isGroupedWithNext =
            next !== undefined &&
            next.senderId === message.senderId &&
            Math.abs(
              new Date(next.createdAt).getTime() - new Date(message.createdAt).getTime(),
            ) < 2 * 60 * 1000
          const isGroupedWithPrev =
            prev !== undefined &&
            prev.senderId === message.senderId &&
            Math.abs(
              new Date(message.createdAt).getTime() - new Date(prev.createdAt).getTime(),
            ) < 2 * 60 * 1000

          // Bubble border-radius: Instagram rounds everything *except* the tail corner,
          // and "flattens" the inner corners of grouped bubbles.
          const radiusMe = cn(
            'rounded-[22px]',
            isGroupedWithPrev && 'rounded-tr-[6px]',
            isGroupedWithNext && 'rounded-br-[6px]',
          )
          const radiusThem = cn(
            'rounded-[22px]',
            isGroupedWithPrev && 'rounded-tl-[6px]',
            isGroupedWithNext && 'rounded-bl-[6px]',
          )

          const time = new Date(message.createdAt).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })

          // Row gap: normal gap between groups, tiny within a group
          const isNewGroup = !isGroupedWithPrev
          const showSeen = isMe && lastSentMsgId === message.id

          return (
            <Fragment key={message.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                className={cn(
                  'flex items-end gap-2',
                  isMe ? 'justify-end' : 'justify-start',
                  isNewGroup ? 'mt-3' : 'mt-0.5',
                )}
              >
                {/* Messages bubble */}
                <div
                  className={cn(
                    'relative max-w-[65%] px-3.5 py-2 break-words text-sm leading-relaxed',
                    isMe ? [radiusMe, 'bg-[#0095f6] text-white'] : [radiusThem, 'bg-gray-100 text-gray-900'],
                  )}
                  title={time}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </motion.div>

              {/* Seen receipt — shown below the last message the other party has read */}
              {showSeen && (
                <div className="flex justify-end pr-1 -mt-0.5">
                  <span className="text-[10px] text-gray-400">Seen</span>
                </div>
              )}
            </Fragment>
          )
        })}
      </div>

      {/* Typing indicator */}
      <AnimatePresence>
        {typingUserIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 6 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="flex justify-start mt-2"
          >
            <div className="bg-gray-100 rounded-[22px] rounded-bl-[6px] px-4 py-3 flex items-center gap-1">
              {[0, 0.18, 0.36].map((delay, i) => (
                <motion.span
                  key={i}
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 0.9, delay, ease: 'easeInOut' }}
                  className="h-2 w-2 rounded-full bg-gray-400"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll anchor */}
      <div ref={messagesEndRef} className="h-1" />
    </div>
  )
}
