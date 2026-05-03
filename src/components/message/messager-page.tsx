import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ConversationList } from './conversation-list'
import { InboxEmptyState } from './inbox-empty-state'
import { ConversationHeader } from './conversation-detail/conversation-header'
import { MessageList } from './conversation-detail/message-list'
import { MessageInput } from './conversation-detail/message-input'
import { cn } from '@/lib/utils'

type MessagerPageProps = {
  readonly initialSelectedId?: string
  readonly initialIsSupport?: boolean
  readonly fallbackName?: string
  readonly fallbackAvatarUrl?: string
}

export function MessagerPage({
  initialSelectedId,
  initialIsSupport = false,
  fallbackName,
  fallbackAvatarUrl,
}: MessagerPageProps) {
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId ?? null)
  const [isSupport, setIsSupport] = useState(initialIsSupport)

  const handleSelect = (id: string, support: boolean) => {
    setSelectedId(id)
    setIsSupport(support)
  }

  return (
    <div className="flex h-full border border-gray-100 overflow-hidden">
      <ConversationList selectedId={selectedId} onSelect={handleSelect} />

      <main
        className={cn(
          'flex-1 flex flex-col overflow-hidden bg-gray-50 p-4',
          selectedId ? 'flex' : 'hidden md:flex',
        )}
      >
        <AnimatePresence mode="wait" >
          {selectedId ? (
            <motion.div
              key={selectedId}
              className="flex flex-col h-full shadow-xl rounded-md bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <ConversationHeader
                conversationId={selectedId}
                onClose={() => setSelectedId(null)}
                fallback={
                  fallbackName ? { name: fallbackName, avatarUrl: fallbackAvatarUrl } : undefined
                }
              />

              <div className="flex-1 min-h-0">
                <MessageList conversationId={selectedId} />
              </div>

              <div className="shrink-0 border-t border-gray-100 bg-white rounded-b-md">
                <MessageInput conversationId={selectedId} isSupport={isSupport} />
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
