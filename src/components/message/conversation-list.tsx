import { Edit, Search } from 'lucide-react'
import { useGetConversations } from '@/hooks/use-message'
import { ConversationListItem } from './conversation-list-item'
import { ConversationListSkeleton } from './conversation-list-skeleton'
import { cn } from '@/lib/utils'

type ConversationListProps = {
  readonly selectedId: string | null
  readonly onSelect: (id: string, isSupport: boolean) => void
}

export function ConversationList({ selectedId, onSelect }: ConversationListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useGetConversations()

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const conversations = data?.pages.flatMap((p) => p.items ?? []).filter(Boolean) ?? []

  return (
    <aside
      className={cn(
        'flex-shrink-0 border-r-2 border-gray-300 flex flex-col h-full bg-gray-50',
        'w-full md:w-[320px]',
        selectedId ? 'hidden md:flex' : 'flex',
      )}
    >
      <div className="px-5 pt-6 pb-4 border-b-2 border-gray-300">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-bold text-gray-900 tracking-tight">Messages</span>
          <button
            className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="New message"
          >
            <Edit className="w-5 h-5 text-gray-700" strokeWidth={2} />
          </button>
        </div>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
            strokeWidth={2}
          />
          <input
            type="text"
            placeholder="Search conversations…"
            className="w-full bg-white border-2 border-gray-300 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <ConversationListSkeleton />
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <p className="text-sm font-semibold text-gray-900 mb-1">No messages yet</p>
            <p className="text-xs text-gray-400">Start a conversation with someone.</p>
          </div>
        ) : (
          <>
            {conversations.map((conv, i) => (
              <ConversationListItem
                key={conv.conversationId}
                conv={conv}
                index={i}
                isActive={conv.conversationId === selectedId}
                onClick={() => onSelect(conv.conversationId, conv.type === 'support')}
              />
            ))}

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
  )
}
