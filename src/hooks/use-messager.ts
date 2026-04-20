import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import type { Conversation } from '@/types/chat.type'
import type { CursorPagedResponse } from '@/types/pagination.type'
import { messagerService } from '@/services/messager.service'
import { chatService } from '@/services/chat.service'

export const messagerKeys = {
  all: ['messager'] as const,
  conversations: () => [...messagerKeys.all, 'conversations'] as const,
}

export function useCreateDirectConversation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (recipientId: string) => chatService.createDirectConversation(recipientId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: messagerKeys.conversations() })
    },
  })
}

export function useGetConversations() {
  return useInfiniteQuery({
    queryKey: messagerKeys.conversations(),
    queryFn: ({ pageParam }) =>
      messagerService.getConversations(pageParam as string | null),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? (lastPage.nextCursor ?? null) : null,
    staleTime: 1000 * 30,
  })
}

/** Returns total unread count, reactive to socket-driven cache updates. */
export function useTotalUnreadCount(): number {
  const { data } = useInfiniteQuery<CursorPagedResponse<Conversation>>({
    queryKey: messagerKeys.conversations(),
    queryFn: ({ pageParam }) =>
      messagerService.getConversations(pageParam as string | null),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? (lastPage.nextCursor ?? null) : null,
    staleTime: 1000 * 30,
  })
  if (!data) return 0
  return data.pages
    .flatMap((p) => p.items)
    .reduce((sum, conv) => sum + (conv.unreadCount ?? 0), 0)
}
