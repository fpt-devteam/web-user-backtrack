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
  readonly fallbackName?: string
  readonly fallbackAvatarUrl?: string
}

export function MessagerPage({ initialSelectedId, fallbackName, fallbackAvatarUrl }: MessagerPageProps) {
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId ?? null)

  return (
    <div className="flex h-full bg-white overflow-hidden">
      <ConversationList selectedId={selectedId} onSelect={setSelectedId} />

      <main
        className={cn(
          'flex-1 flex flex-col overflow-hidden bg-white',
          selectedId ? 'flex' : 'hidden md:flex',
        )}
      >
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

              <div className="shrink-0 border-t-2 border-gray-300 bg-white">
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
