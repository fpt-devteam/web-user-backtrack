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
    <div>
      <ConversationHeader conversationId={conversationId} />
      <MessageList conversationId={conversationId} />
      <div className="sticky bottom-0 z-10 bg-background">
        <MessageInput conversationId={conversationId} />
      </div>
    </div>
  );
}
