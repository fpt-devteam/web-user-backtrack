// src/components/chat/message-list.tsx
import { useGetMessages } from '@/hooks/use-chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface MessageListProps {
  readonly conversationId: string;
}

export function MessageList({ conversationId }: MessageListProps) {
  const { data: messages, isLoading, error } = useGetMessages(conversationId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentUserId = 'current-user'; // Replace with actual user ID

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 p-4 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={cn('flex gap-3', i % 2 === 0 && 'justify-end')}>
            <Skeleton className="h-16 w-64 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-destructive">
        Failed to load messages
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages?.map((message) => {
          const isOwn = message.senderId === currentUserId;

          return (
            <div
              key={message.id}
              className={cn('flex gap-3', isOwn && 'flex-row-reverse')}
            >
              {!isOwn && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {message.senderId.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
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
        })}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
}