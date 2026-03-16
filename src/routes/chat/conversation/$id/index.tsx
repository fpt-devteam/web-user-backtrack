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
      <ConversationHeader conversationId={conversationId} />
      <div className="flex-1 min-h-0 bg-[#F7F7F7]">
        <MessageList conversationId={conversationId} />
      </div>
      <div className="shrink-0 border-t border-[#f0f0f0] bg-white">
        <MessageInput conversationId={conversationId} />
      </div>
    </div>
  )
}