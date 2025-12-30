// src/hooks/use-chat.ts
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useCallback } from 'react';
import { chatService } from '@/services/chat.service';
import { useSocket } from './use-socket';
import type { Message, CreateConversationRequest } from '@/types/chat.types';

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

export function useGetMessages(conversationId: string | undefined) {
  return useQuery({
    queryKey: chatKeys.messages(conversationId!),
    queryFn: () => chatService.getMessages(conversationId!),
    enabled: !!conversationId,
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateConversationRequest) => chatService.createConversation(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
    },
  });
}

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => chatService.sendMessage(conversationId, content),
    onMutate: async (content) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: chatKeys.messages(conversationId) });

      // Snapshot previous value
      const previousMessages = queryClient.getQueryData<Message[]>(
        chatKeys.messages(conversationId)
      );

      // Optimistically update
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        conversationId,
        senderId: 'current-user', // Replace with actual user ID
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Message[]>(
        chatKeys.messages(conversationId),
        (old) => [...(old || []), optimisticMessage]
      );

      return { previousMessages };
    },
    onError: (_, __, context) => {
      // Rollback on error
      if (context?.previousMessages) {
        queryClient.setQueryData(
          chatKeys.messages(conversationId),
          context.previousMessages
        );
      }
    },
    onSettled: () => {
      // Always refetch after mutation
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