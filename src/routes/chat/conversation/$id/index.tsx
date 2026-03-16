import { createFileRoute } from '@tanstack/react-router'
import { ConversationHeader } from '@/components/chat/conversation-detail/conversation-header';
import { MessageList } from '@/components/chat/conversation-detail/message-list';
import { MessageInput } from '@/components/chat/conversation-detail/message-input';

export const Route = createFileRoute('/chat/conversation/$id/')({
  component: ConversationDetail,
})

function ConversationDetail() {
  const { id: conversationId } = Route.useParams();

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <ConversationHeader conversationId={conversationId} />
      {/* min-h-0 prevents flexbox from growing this child beyond the remaining space */}
      <div className="flex-1 min-h-0">
        <MessageList conversationId={conversationId} />
      </div>
      <div className="shrink-0 border-t bg-background">
        <MessageInput conversationId={conversationId} />
      </div>
    </div>
  );
}
