import { createFileRoute } from '@tanstack/react-router'
import { ConversationHeader } from '@/components/chat/conversation-detail/conversation-header'
import { MessageList } from '@/components/chat/conversation-detail/message-list'
import { MessageInput } from '@/components/chat/conversation-detail/message-input'

export const Route = createFileRoute('/chat/conversation/$id/')({
  component: ConversationDetail,
})

function ConversationDetail() {
  const { id: conversationId } = Route.useParams()

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      {/* Header — pinned at top */}
      <ConversationHeader conversationId={conversationId} />

      {/* Message body — scrollable, fills remaining space */}
      <div className="flex-1 min-h-0 bg-white">
        <MessageList conversationId={conversationId} />
      </div>

      {/* Input — pinned at bottom */}
      <div className="shrink-0 border-t border-gray-100 bg-white">
        <MessageInput conversationId={conversationId} />
      </div>
    </div>
  )
}