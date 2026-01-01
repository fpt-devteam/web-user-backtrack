import { useEffect, useRef, useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useGetMessages, chatKeys } from '@/hooks/use-chat';
import { useSocket } from '@/hooks/use-socket';
import { useAuth } from '@/hooks/use-auth';
import type { Message } from '@/types/chat.types';
import type { CursorPagedResponse } from '@/types/pagination.type';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface MessageListProps {
  readonly conversationId: string;
}

export function MessageList({ conversationId }: MessageListProps) {
  const { profile } = useAuth();
  const { socket, joinConversation, leaveConversation } = useSocket();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetMessages(conversationId);

  // Join conversation on mount and leave on unmount
  useEffect(() => {
    if (conversationId) {
      joinConversation(conversationId);
      setIsInitialLoad(true); // Reset initial load flag when conversation changes
    }
    return () => {
      if (conversationId) {
        leaveConversation(conversationId);
      }
    };
  }, [conversationId, joinConversation, leaveConversation]);

  // Listen for new messages via WebSocket
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message: Message) => {
      queryClient.setQueryData<{
        pages: CursorPagedResponse<Message>[];
        pageParams: (string | null)[];
      }>(chatKeys.messages(conversationId), (oldData) => {
        if (!oldData) return oldData;

        const firstPage = oldData.pages[0];
        const messageExists = firstPage?.items.some((m) => m.id === message.id);

        if (messageExists) return oldData;

        return {
          ...oldData,
          pages: [
            {
              ...firstPage,
              items: [message, ...firstPage.items],
            },
            ...oldData.pages.slice(1),
          ],
        };
      });

      // Scroll to bottom when new message arrives
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      });
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket, conversationId, queryClient]);

  // Auto-scroll to bottom on initial load only
  useEffect(() => {
    if (data && !isLoading && isInitialLoad) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
        setIsInitialLoad(false);
      });
    }
  }, [data, isLoading, isInitialLoad]);

  // Handle scroll for infinite loading
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || isFetchingNextPage || !hasNextPage) return;

    const { scrollTop } = scrollContainerRef.current;

    if (scrollTop < 100) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Flatten all messages from pages (API returns latest first, so reverse for display)
  const allMessages = data?.pages.flatMap((page) => page.items).reverse() ?? [];

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!allMessages.length) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="flex h-full flex-col overflow-y-auto px-4 py-4 space-y-4"
    >
      {isFetchingNextPage && (
        <div className="flex justify-center py-2">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {allMessages.map((message) => {
        const isCurrentUser = message.senderId === profile?.id;
        const messageTime = new Date(message.createdAt).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });

        return (
          <div
            key={message.id}
            className={cn(
              'flex',
              isCurrentUser ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                'max-w-[70%] rounded-2xl px-4 py-2 break-words',
                isCurrentUser
                  ? 'bg-primary text-primary-foreground rounded-br-sm'
                  : 'bg-muted text-foreground rounded-bl-sm'
              )}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p
                className={cn(
                  'mt-1 text-xs',
                  isCurrentUser
                    ? 'text-primary-foreground/70'
                    : 'text-muted-foreground'
                )}
              >
                {messageTime}
              </p>
            </div>
          </div>
        );
      })}

      <div ref={messagesEndRef} />
    </div>
  );
}
