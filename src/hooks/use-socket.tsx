import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import type { Socket } from 'socket.io-client';
import { getChatSocket, destroyChatSocket } from '@/lib/socket';
import { useAuth } from '@/hooks/use-auth';
import type { Message } from '@/types/chat.type';

// ─── Payload types ────────────────────────────────────────────────────────────
export interface SendToConversationPayload {
  conversationId: string;
  type?: string;
  content: string;
}

export interface SendToRecipientPayload {
  recipientId: string;
  type?: string;
  content: string;
}

export interface SendToOrgPayload {
  orgId: string;
  type?: string;
  content: string;
}

export type SendMessagePayload =
  | SendToConversationPayload
  | SendToRecipientPayload
  | SendToOrgPayload;

export interface MessageSendSuccessData {
  conversationId: string;
  message: Message;
  isNewConversation?: boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────────
interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  sendMessage: (payload: SendMessagePayload) => void;
  sendTypingStart: (conversationId: string) => void;
  sendTypingStop: (conversationId: string) => void;
  onMessageSendSuccess: (handler: (data: MessageSendSuccessData) => void) => () => void;
  onMessageSendSupportSuccess: (handler: (data: MessageSendSuccessData) => void) => () => void;
}

const SocketContext = createContext<SocketContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function SocketProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
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

        socketInstance.on('connect', handleConnect);
        socketInstance.on('disconnect', handleDisconnect);
        socketInstance.on('connect_error', handleConnectError);

        // Sync initial state (socket may already be connected)
        setIsConnected(socketInstance.connected);

        cleanup = () => {
          socketInstance.off('connect', handleConnect);
          socketInstance.off('disconnect', handleDisconnect);
          socketInstance.off('connect_error', handleConnectError);
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
  }, [profile]);

  // ── Room management ──────────────────────────────────────────────────────────
  const joinConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit('join:conversation', conversationId);
  }, []);

  const leaveConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit('leave:conversation', conversationId);
  }, []);

  // ── Messaging ────────────────────────────────────────────────────────────────
  const sendMessage = useCallback((payload: SendMessagePayload) => {
    const isOrg = 'orgId' in payload;
    socketRef.current?.emit(
      isOrg ? 'message:send:support' : 'message:send',
      payload,
    );
  }, []);

  // ── Typing indicators ────────────────────────────────────────────────────────
  const sendTypingStart = useCallback((conversationId: string) => {
    socketRef.current?.emit('typing:start', { conversationId });
  }, []);

  const sendTypingStop = useCallback((conversationId: string) => {
    socketRef.current?.emit('typing:stop', { conversationId });
  }, []);

  // ── Event subscription ───────────────────────────────────────────────────────
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

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        joinConversation,
        leaveConversation,
        sendMessage,
        sendTypingStart,
        sendTypingStop,
        onMessageSendSuccess,
        onMessageSendSupportSuccess,
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