import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { InfiniteData } from '@tanstack/react-query';
import type { Socket } from 'socket.io-client';
import type { Conversation, Message } from '@/types/chat.type';
import type { CursorPagedResponse } from '@/types/pagination.type';
import { destroyChatSocket, getChatSocket } from '@/lib/socket';
import { useAuth } from '@/hooks/use-auth';

// Stable query key arrays (mirrors the factories in use-messager/use-chat)
const MESSAGER_CONV_KEY = ['messager', 'conversations'] as const;
const CHAT_CONV_KEY = ['chat', 'conversations'] as const;

// ─── Payload types ────────────────────────────────────────────────────────────
export interface SendMessagePayload {
  conversationId: string;
  type?: string;
  content: string;
  attachments?: unknown;
  /** When true, routes to message:send:support instead of message:send */
  isSupport?: boolean;
}

export interface MessageSendSuccessData {
  conversationId: string;
  message: Message;
  isNewConversation?: boolean;
}

export interface MessageSendErrorData {
  code: string;
  message: string;
}

export interface MessageSeenData {
  conversationId: string;
  readBy: string;
  readAt: string;
}

export interface ConversationNewData {
  conversationId: string;
  message: Message;
}

// ─── Context ──────────────────────────────────────────────────────────────────
interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  sendMessage: (payload: SendMessagePayload) => void;
  markConversationAsRead: (conversationId: string) => void;
  sendTypingStart: (conversationId: string) => void;
  sendTypingStop: (conversationId: string) => void;
  onMessageSendSuccess: (handler: (data: MessageSendSuccessData) => void) => () => void;
  onMessageSendSupportSuccess: (handler: (data: MessageSendSuccessData) => void) => () => void;
  onMessageSendError: (handler: (data: MessageSendErrorData) => void) => () => void;
  onMessageSeen: (handler: (data: MessageSeenData) => void) => () => void;
  onConversationNew: (handler: (data: ConversationNewData) => void) => () => void;
}

const SocketContext = createContext<SocketContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function SocketProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  // Stable ref so callbacks don't need socket in their dep arrays
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!profile) {
      // Tear down existing connection when user logs out
      destroyChatSocket();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
      return;
    }

    let cleanup: (() => void) | undefined;

    const initSocket = async () => {
      try {
        const socketInstance = await getChatSocket();
        socketRef.current = socketInstance;
        setSocket(socketInstance);

        const handleConnect = () => setIsConnected(true);
        const handleDisconnect = () => setIsConnected(false);
        const handleConnectError = (err: Error) => {
          console.error('[Socket] connect_error:', err.message);
          setIsConnected(false);
        };

        // ── conversation:updated — unified realtime update ─────────────────
        // Replaces conversation:unread. Fired in 3 cases:
        //   1. New message received by participants  → unreadCount + lastMessage
        //   2. Sender's own message confirmed        → unreadCount=0 + lastMessage
        //   3. Conversation marked as read           → unreadCount=0, no lastMessage
        const handleConversationUpdated = ({
          conversationId,
          unreadCount,
          lastMessage,
        }: {
          conversationId: string;
          unreadCount: number;
          lastMessage?: { senderId: string; content: string; timestamp: string };
        }) => {
          const patch = (
            old: InfiniteData<CursorPagedResponse<Conversation>> | undefined,
          ) => {
            if (!old) return old;
            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                items: page.items.map((conv) => {
                  if (conv.conversationId !== conversationId) return conv;
                  return {
                    ...conv,
                    unreadCount,
                    ...(lastMessage ? { lastMessage } : {}),
                  };
                }),
              })),
            };
          };
          queryClient.setQueryData<InfiniteData<CursorPagedResponse<Conversation>>>(
            MESSAGER_CONV_KEY,
            patch,
          );
          queryClient.setQueryData<InfiniteData<CursorPagedResponse<Conversation>>>(
            CHAT_CONV_KEY,
            patch,
          );
        };

        // ── conversation:new — new conversation initiated by other party ───
        const handleConversationNew = () => {
          void queryClient.invalidateQueries({ queryKey: [...MESSAGER_CONV_KEY] });
          void queryClient.invalidateQueries({ queryKey: [...CHAT_CONV_KEY] });
        };

        socketInstance.on('connect', handleConnect);
        socketInstance.on('disconnect', handleDisconnect);
        socketInstance.on('connect_error', handleConnectError);
        socketInstance.on('conversation:updated', handleConversationUpdated);
        socketInstance.on('conversation:new', handleConversationNew);

        // Sync initial state (socket may already be connected)
        setIsConnected(socketInstance.connected);

        cleanup = () => {
          socketInstance.off('connect', handleConnect);
          socketInstance.off('disconnect', handleDisconnect);
          socketInstance.off('connect_error', handleConnectError);
          socketInstance.off('conversation:updated', handleConversationUpdated);
          socketInstance.off('conversation:new', handleConversationNew);
        };
      } catch (err) {
        console.error('[Socket] initSocket failed:', err);
        setIsConnected(false);
      }
    };

    initSocket();

    return () => {
      cleanup?.();
    };
  }, [profile, queryClient]);

  // ── Room management ──────────────────────────────────────────────────────────
  const joinConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit('join:conversation', conversationId);
  }, []);

  const leaveConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit('leave:conversation', conversationId);
  }, []);

  // ── Mark as read ─────────────────────────────────────────────────────────────
  // Emits conversation:read. Server resets unreadCount in DB, emits message:seen
  // to the other party, and emits conversation:unread { unreadCount: 0 } back
  // to this user for multi-tab sync.
  const markConversationAsRead = useCallback((conversationId: string) => {
    socketRef.current?.emit('conversation:read', { conversationId });
  }, []);

  // ── Messaging ────────────────────────────────────────────────────────────────
  const sendMessage = useCallback((payload: SendMessagePayload) => {
    const { isSupport, ...rest } = payload;
    socketRef.current?.emit(
      isSupport ? 'message:send:support' : 'message:send',
      rest,
    );
  }, []);

  // ── Typing indicators ────────────────────────────────────────────────────────
  const sendTypingStart = useCallback(
    (conversationId: string) => {
      socketRef.current?.emit('typing:start', {
        conversationId,
        displayName: profile?.displayName,
      });
    },
    [profile?.displayName],
  );

  const sendTypingStop = useCallback((conversationId: string) => {
    socketRef.current?.emit('typing:stop', { conversationId });
  }, []);

  // ── Event subscriptions ───────────────────────────────────────────────────────
  const onMessageSendSuccess = useCallback(
    (handler: (data: MessageSendSuccessData) => void) => {
      const s = socketRef.current;
      if (!s) return () => {};
      s.on('message:send:success', handler);
      return () => s.off('message:send:success', handler);
    },
    [],
  );

  const onMessageSendSupportSuccess = useCallback(
    (handler: (data: MessageSendSuccessData) => void) => {
      const s = socketRef.current;
      if (!s) return () => {};
      s.on('message:send:support:success', handler);
      return () => s.off('message:send:support:success', handler);
    },
    [],
  );

  const onMessageSendError = useCallback(
    (handler: (data: MessageSendErrorData) => void) => {
      const s = socketRef.current;
      if (!s) return () => {};
      s.on('message:send:error', handler);
      return () => s.off('message:send:error', handler);
    },
    [],
  );

  const onMessageSeen = useCallback(
    (handler: (data: MessageSeenData) => void) => {
      const s = socketRef.current;
      if (!s) return () => {};
      s.on('message:seen', handler);
      return () => s.off('message:seen', handler);
    },
    [],
  );

  const onConversationNew = useCallback(
    (handler: (data: ConversationNewData) => void) => {
      const s = socketRef.current;
      if (!s) return () => {};
      s.on('conversation:new', handler);
      return () => s.off('conversation:new', handler);
    },
    [],
  );

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        joinConversation,
        leaveConversation,
        sendMessage,
        markConversationAsRead,
        sendTypingStart,
        sendTypingStop,
        onMessageSendSuccess,
        onMessageSendSupportSuccess,
        onMessageSendError,
        onMessageSeen,
        onConversationNew,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
