// src/components/chat/chat-container.tsx
import { useState } from 'react';
import { ConversationList } from '@/components/chat/conversation-list';
import { MessageList } from '@/components/chat/conversation-detail/message-list';
import { MessageInput } from '@/components/chat/conversation-detail/message-input';
import { useRealtimeMessages } from '@/hooks/use-chat';
import { Card } from '@/components/ui/card';
import { useSocket } from '@/hooks/use-socket';
import { Badge } from '@/components/ui/badge';

export function ChatContainer() {
  const [selectedConversationId, setSelectedConversationId] = useState<string>();
  const { isConnected } = useSocket();

  // Subscribe to real-time messages for selected conversation
  useRealtimeMessages(selectedConversationId);

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4 p-4">
      {/* Sidebar */}
      <Card className="w-80 flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold">Conversations</h2>
          <Badge variant={isConnected ? 'default' : 'destructive'}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
        </div>
        <ConversationList
          selectedId={selectedConversationId}
          onSelect={setSelectedConversationId}
        />
      </Card>

      {/* Main chat area */}
      <Card className="flex-1 flex flex-col">
        {selectedConversationId ? (
          <>
            <MessageList conversationId={selectedConversationId} />
            <MessageInput conversationId={selectedConversationId} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select a conversation to start chatting
          </div>
        )}
      </Card>
    </div>
  );
}