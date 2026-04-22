import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Conversation } from '@/types/chat.type'
import type { CursorPagedResponse } from '@/types/pagination.type'
import { messageService } from '@/services/message.service'
import { toast } from '@/lib/toast'

export const messageKeys = {
  all: ['message'] as const,
  conversations: () => [...messageKeys.all, 'conversations'] as const,
  conversation: (id: string) => [...messageKeys.all, 'conversation', id] as const,
  messages: (conversationId: string) => [...messageKeys.all, 'messages', conversationId] as const,
}

export function useGetConversations() {
  return useInfiniteQuery({
    queryKey: messageKeys.conversations(),
    queryFn: ({ pageParam }) => messageService.getConversations(pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? (lastPage.nextCursor ?? null) : null),
    staleTime: 1000 * 30,
  })
}

export function useGetConversationById(id: string, enabled = true) {
  const validId = !!id && id !== 'undefined'
  const { data, isLoading, error } = useQuery({
    queryKey: messageKeys.conversation(id),
    queryFn: () => messageService.getConversationById(id),
    enabled: validId && enabled,
    staleTime: 1000 * 60,
  })
  if (error) toast.fromError(error)
  return { data, isLoading }
}

export function useCreateDirectConversation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (recipientId: string) => messageService.createDirectConversation(recipientId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: messageKeys.conversations() })
    },
  })
}

export function useTotalUnreadCount(): number {
  const { data } = useInfiniteQuery<CursorPagedResponse<Conversation>>({
    queryKey: messageKeys.conversations(),
    queryFn: ({ pageParam }) => messageService.getConversations(pageParam as string | null),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? (lastPage.nextCursor ?? null) : null),
    staleTime: 1000 * 30,
  })
  if (!data) return 0
  return data.pages.flatMap((p) => p.items).reduce((sum, conv) => sum + conv.unreadCount, 0)
}

export function useGetMessages(conversationId: string) {
  return useInfiniteQuery({
    queryKey: messageKeys.messages(conversationId),
    queryFn: ({ pageParam }) => messageService.getMessages(conversationId, pageParam),
    enabled: !!conversationId && conversationId !== 'undefined',
    staleTime: 1000 * 30,
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
  })
}
