// src/components/chat/message-list.tsx
import { useGetMessages } from '@/hooks/use-chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { InlineMessage } from '@/components/ui/inline-message';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useRef } from 'react';
import type { Message } from '@/types/chat.types';

interface MessageListProps {
  readonly conversationId: string;
}

export function MessageList({ conversationId }: MessageListProps) {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetMessages(conversationId);
  const { profile: currentUser, loading: authLoading } = useAuth();
  const messages =
    data?.pages.flatMap((p) => p.items) ?? [];
  const reversedMessages = [...messages].reverse();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const firstLoad = useRef(true);

  const goToBottom = () => {
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  };

  if (isLoading || authLoading) {
    return (
      <div className="flex-1 p-4 space-y-4">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={`skeleton-${i}`} className={cn('flex gap-3', i % 2 === 0 && 'justify-end')}>
            <Skeleton className="h-16 w-64 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <InlineMessage variant="error">
        Failed to load messages.
      </InlineMessage>
    );
  }

  if (firstLoad.current) {
    goToBottom();
    firstLoad.current = false;
  }

  return (
    <ScrollArea className="flex-1 p-4">
      {hasNextPage && (
        <button
          disabled={isFetchingNextPage}
          onClick={() => fetchNextPage()}
          className="text-xs text-muted-foreground text-center mb-4 w-full"
        >
          {isFetchingNextPage ? "Loading..." : "Load older messages"}
        </button>
      )}
      <div className="space-y-4">
        {currentUser && reversedMessages?.map((message) => {
          const isOwn = message.senderId === currentUser.id;
          return <MessageItem key={message.id} message={message} isOwn={isOwn} />;
        })}
      </div>
      <div ref={bottomRef} className="scroll-mb-24" />
    </ScrollArea>
  );
}

function MessageItem({ message, isOwn }: { readonly message: Message; readonly isOwn: boolean }) {
  return (
    <div className={cn('flex gap-3', isOwn && 'flex-row-reverse')}>
      <div
        className={cn(
          'max-w-[70%] rounded-lg px-4 py-2',
          isOwn
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        )}
      >
        <p className="break-words">{message.content}</p>
        <p
          className={cn(
            'text-xs mt-1',
            isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
          )}
        >
          {format(new Date(message.createdAt), 'HH:mm')}
        </p>
      </div>
    </div>
  );
}