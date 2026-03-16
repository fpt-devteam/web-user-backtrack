import { useEffect, useRef, useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useGetMessages, chatKeys } from '@/hooks/use-chat';
import { useSocket } from '@/hooks/use-socket';
import { useAuth } from '@/hooks/use-auth';
import type { Message } from '@/types/chat.type';
import type { CursorPagedResponse } from '@/types/pagination.type';
import { cn } from '@/lib/utils';
import { Loader2, MessagesSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MessageListProps {
  readonly conversationId: string;
}

export function MessageList({ conversationId }: MessageListProps) {
  const { profile } = useAuth();
  const { socket, joinConversation, leaveConversation, onMessageSendSuccess } = useSocket();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [typingUserIds, setTypingUserIds] = useState<string[]>([]);
  const typingTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetMessages(conversationId);

  // ── Helpers ──────────────────────────────────────────────────────────────────

  /** Returns true if the user is already scrolled near the bottom */
  const isNearBottom = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return true;
    // within 120px of bottom
    return el.scrollHeight - el.scrollTop - el.clientHeight < 120;
  }, []);

  /** Scrolls the list to the very bottom */
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    // Use scrollTop directly on the container — more reliable than scrollIntoView
    // when the element is inside an overflow-y-auto container.
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior });
    }
  }, []);

  // ── Inject a message into the query cache ────────────────────────────────────
  const injectMessage = useCallback((message: Message) => {
    if (message.conversationId !== conversationId) return;

    queryClient.setQueryData<{
      pages: CursorPagedResponse<Message>[];
      pageParams: (string | null)[];
    }>(chatKeys.messages(conversationId), (oldData) => {
      if (!oldData) return oldData;
      const firstPage = oldData.pages[0];
      // Deduplicate
      if (firstPage?.items.some((m) => m?.id === message.id)) return oldData;
      return {
        ...oldData,
        pages: [
          { ...firstPage, items: [message, ...(firstPage?.items ?? []).filter(Boolean)] },
          ...oldData.pages.slice(1),
        ],
      };
    });
  }, [conversationId, queryClient]);

  // ── Join / leave room ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!conversationId) return;
    joinConversation(conversationId);
    setIsInitialLoad(true);
    return () => { leaveConversation(conversationId); };
  }, [conversationId, joinConversation, leaveConversation]);

  // ── message:new — messages from OTHER users ──────────────────────────────────
  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (message: Message) => {
      injectMessage(message);
    };
    socket.on('message:new', handleNewMessage);
    return () => { socket.off('message:new', handleNewMessage); };
  }, [socket, injectMessage]);

  // ── message:send:success — the sender's OWN message confirmation ─────────────
  useEffect(() => {
    const unsub = onMessageSendSuccess((data) => {
      // Only handle messages that belong to THIS conversation
      if (data.conversationId === conversationId && data.message) {
        injectMessage(data.message);
      }
    });
    return unsub;
  }, [onMessageSendSuccess, conversationId, injectMessage]);

  // ── Auto-scroll when new messages arrive ────────────────────────────────────
  const allMessages = (data?.pages.flatMap((page) => page.items) ?? []).filter(Boolean).reverse();

  useEffect(() => {
    if (!data) return;
    if (isInitialLoad) {
      // On first load jump instantly to bottom, no animation
      scrollToBottom('auto');
      setIsInitialLoad(false);
      return;
    }
    // For subsequent messages only auto-scroll if user is already near the bottom
    if (isNearBottom()) {
      scrollToBottom('smooth');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allMessages.length]);

  // ── Typing indicators ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const handleTyping = (data: { conversationId: string; userId: string; isTyping: boolean }) => {
      if (data.conversationId !== conversationId) return;
      if (data.userId === profile?.id) return;
      const { userId, isTyping } = data;

      if (typingTimersRef.current[userId]) clearTimeout(typingTimersRef.current[userId]);

      if (isTyping) {
        typingTimersRef.current[userId] = setTimeout(() => {
          delete typingTimersRef.current[userId];
          setTypingUserIds((prev) => prev.filter((id) => id !== userId));
        }, 4000);
        setTypingUserIds((prev) => (prev.includes(userId) ? prev : [...prev, userId]));
      } else {
        delete typingTimersRef.current[userId];
        setTypingUserIds((prev) => prev.filter((id) => id !== userId));
      }
    };

    socket.on('typing:user', handleTyping);
    return () => {
      socket.off('typing:user', handleTyping);
      Object.values(typingTimersRef.current).forEach(clearTimeout);
    };
  }, [socket, conversationId, profile?.id]);

  // ── Infinite scroll — load older messages when scrolled to top ──────────────
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || isFetchingNextPage || !hasNextPage) return;
    if (scrollContainerRef.current.scrollTop < 100) fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // ── Render ───────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        >
          <Loader2 className="h-8 w-8 text-violet-400" />
        </motion.div>
      </div>
    );
  }

  if (!allMessages.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex h-full flex-col items-center justify-center gap-4 px-6"
      >
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full bg-violet-400 blur-xl"
          />
          <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-400/30">
            <MessagesSquare className="h-8 w-8 text-white" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground text-center leading-relaxed">
          No messages yet.{' '}
          <span className="text-violet-600 font-medium">Start the conversation!</span>
        </p>
      </motion.div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className="flex flex-col h-full overflow-y-auto px-4 py-4 space-y-2"
      style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(139,92,246,0.15) transparent' }}
    >
      {/* Loading older messages indicator */}
      <AnimatePresence>
        {isFetchingNextPage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex justify-center py-2"
          >
            <Loader2 className="h-5 w-5 animate-spin text-violet-400" />
          </motion.div>
        )}
      </AnimatePresence>

      {allMessages.map((message, index) => {
        const isCurrentUser = message.senderId === profile?.id;
        const messageTime = new Date(message.createdAt).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });

        // Group messages: hide timestamp if same sender as next message within 2 min
        const nextMsg = allMessages[index + 1];
        const isGrouped =
          nextMsg &&
          nextMsg.senderId === message.senderId &&
          Math.abs(new Date(nextMsg.createdAt).getTime() - new Date(message.createdAt).getTime()) < 2 * 60 * 1000;

        return (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, scale: 0.88, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className={cn(
              'flex items-end gap-2',
              isCurrentUser ? 'justify-end' : 'justify-start',
              isGrouped ? 'mb-0.5' : 'mb-1.5',
            )}
          >
            <div
              className={cn(
                'relative max-w-[72%] px-4 py-2.5 break-words shadow-sm',
                isCurrentUser
                  ? 'bg-gradient-to-br from-blue-500 via-violet-600 to-purple-600 text-white rounded-3xl rounded-br-md shadow-violet-500/20'
                  : 'bg-white border border-gray-100 text-gray-800 rounded-3xl rounded-bl-md shadow-black/5',
              )}
            >
              {/* Subtle inner glow for user messages */}
              {isCurrentUser && (
                <div className="absolute inset-0 rounded-3xl rounded-br-md bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
              )}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              {!isGrouped && (
                <p
                  className={cn(
                    'mt-1 text-[10px] font-medium',
                    isCurrentUser ? 'text-white/60 text-right' : 'text-gray-400',
                  )}
                >
                  {messageTime}
                </p>
              )}
            </div>
          </motion.div>
        );
      })}

      {/* Typing indicator */}
      <AnimatePresence>
        {typingUserIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="flex justify-start"
          >
            <div className="bg-white border border-gray-100 rounded-3xl rounded-bl-md px-4 py-3 flex items-center gap-1 shadow-sm">
              {/* delays: 0s, 0.15s, 0.3s */}
              {[0, 0.15, 0.3].map((delay, i) => (
                <motion.span
                  key={i}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay, ease: 'easeInOut' }}
                  className="h-2 w-2 rounded-full bg-gradient-to-b from-violet-400 to-purple-500"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Anchor for scrollIntoView fallback */}
      <div ref={messagesEndRef} />
    </div>
  );
}
