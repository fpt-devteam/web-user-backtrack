// src/hooks/use-chat.ts
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { chatService } from '@/services/chat.service';
import { toast } from '@/lib/toast';

export const chatKeys = {
  all: ['chat'] as const,
  conversations: () => [...chatKeys.all, 'conversations'] as const,
  conversationByOrg: (orgId: string) => [...chatKeys.all, 'conversation-by-org', orgId] as const,
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

/** Check if current user already has a conversation with a given org. Returns null if none. */
export function useGetConversationByOrgId(orgId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: chatKeys.conversationByOrg(orgId),
    queryFn: () => chatService.getConversationByOrgId(orgId),
    enabled: !!orgId && enabled,
    staleTime: 1000 * 30,
    retry: false, // don't retry on 404
  });
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

