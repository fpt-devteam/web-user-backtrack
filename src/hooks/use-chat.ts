// src/hooks/use-chat.ts
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useCallback } from 'react';
import { chatService } from '@/services/chat.service';
import { useSocket } from './use-socket';
import type { Message, CreateConversationRequest } from '@/types/chat.types';
import { toast } from '@/lib/toast';

export const chatKeys = {
  all: ['chat'] as const,
  conversations: () => [...chatKeys.all, 'conversations'] as const,
  messages: (conversationId: string) => [...chatKeys.all, 'messages', conversationId] as const,
};

export function useGetConversations() {
  return useInfiniteQuery({
    queryKey: chatKeys.conversations(),
    queryFn: ({ pageParam }) => chatService.getConversations(pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useGetConversationById(id: string, enabled: boolean = true) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['chat', 'conversation', id],
    queryFn: () => chatService.getConversationById(id),
    enabled,
    staleTime: 1000 * 60, // 1 minute
  });
  if (error) {
    toast.fromError(error);
  }
  return { data, isLoading };

}

export function useGetMessages(conversationId: string) {
  return useInfiniteQuery({
    queryKey: chatKeys.messages(conversationId),
    queryFn: ({ pageParam }) =>
      chatService.getMessages(conversationId, pageParam),
    enabled: !!conversationId,
    staleTime: 1000 * 30, // 30 seconds,
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,

  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateConversationRequest) => chatService.createConversation(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
    },
    onError: (error) => {
      console.error('Error creating conversation:', error);
      toast.fromError(error);
    }
  });
}

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => chatService.sendMessage(conversationId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(conversationId) });
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
    },
  });

}

export function useRealtimeMessages(conversationId: string | undefined) {
  const { socket, joinConversation, leaveConversation } = useSocket();
  const queryClient = useQueryClient();

  const handleNewMessage = useCallback(
    (message: Message) => {
      if (message.conversationId !== conversationId) return;

      queryClient.setQueryData<Message[]>(
        chatKeys.messages(conversationId),
        (old) => {
          if (!old) return [message];
          // Avoid duplicates
          if (old.some((m) => m.id === message.id)) return old;
          return [...old, message];
        }
      );

      // Update conversation list
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
    },
    [conversationId, queryClient]
  );

  useEffect(() => {
    if (!socket || !conversationId) return;

    joinConversation(conversationId);
    socket.on('receive_message', handleNewMessage);

    return () => {
      leaveConversation(conversationId);
      socket.off('receive_message', handleNewMessage);
    };
  }, [socket, conversationId, joinConversation, leaveConversation, handleNewMessage]);
}