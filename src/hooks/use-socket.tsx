// src/hooks/use-socket.ts
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { Socket } from 'socket.io-client';
import { socketManager } from '@/lib/socket';
import { useAuth } from '@/hooks/use-auth';
import { auth } from '@/lib/firebase';

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
}

const SocketContext = createContext<SocketContextValue | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!profile) {
      socketManager.disconnect();
      setSocket(null);
      setIsConnected(false);
      return;
    }

    const initSocket = async () => {
      const token = await auth.currentUser?.getIdToken();
      if (!token) return;

      const socketInstance = socketManager.connect(token);
      setSocket(socketInstance);

      const handleConnect = () => {
        console.log('Socket connected:', socketInstance.id);
        setIsConnected(true);
      };

      const handleDisconnect = (reason: string) => {
        console.log('Socket disconnected:', reason);
        setIsConnected(false);
      };

      const handleConnectError = (error: Error) => {
        console.error('Socket connection error:', error.message);
        setIsConnected(false);
      };

      socketInstance.on('connect', handleConnect);
      socketInstance.on('disconnect', handleDisconnect);
      socketInstance.on('connect_error', handleConnectError);

      // Set initial state
      setIsConnected(socketInstance.connected);
    };

    initSocket();

    return () => {
      socket?.off('connect');
      socket?.off('disconnect');
      socket?.off('connect_error');
    };
  }, [profile]);

  const joinConversation = useCallback((conversationId: string) => {
    socket?.emit('join_conversation', conversationId);
  }, [socket]);

  const leaveConversation = useCallback((conversationId: string) => {
    socket?.emit('leave_conversation', conversationId);
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, joinConversation, leaveConversation }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}