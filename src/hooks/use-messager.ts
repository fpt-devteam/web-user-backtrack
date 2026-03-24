import { useInfiniteQuery } from '@tanstack/react-query'
import { messagerService } from '@/services/messager.service'

export const messagerKeys = {
  all: ['messager'] as const,
  conversations: () => [...messagerKeys.all, 'conversations'] as const,
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
