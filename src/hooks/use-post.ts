import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { postService } from '@/services/post.service'
import type { Post, PostType } from '@/types/post.type'

export const postKeys = {
  all: ['posts'] as const,
  detail: (id: string) => [...postKeys.all, 'detail', id] as const,
  byOrg: (orgId: string) => [...postKeys.all, 'org', orgId] as const,
  feed: (lat: number, lng: number, postType?: PostType | null) =>
    [...postKeys.all, 'feed', lat, lng, postType ?? 'all'] as const,
  search: (query: string) =>
    [...postKeys.all, 'search', query] as const,
}

export function useGetPostsByOrg(orgId: string) {
  return useQuery({
    queryKey: postKeys.byOrg(orgId),
    queryFn: () => postService.getPostsByOrgId(orgId),
    staleTime: 1000 * 60 * 2,
    enabled: !!orgId,
  })
}

export function useGetPost(id: string) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => postService.getPostById(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  })
}

const PAGE_SIZE = 20

interface UseFeedParams {
  latitude: number
  longitude: number
  postType?: PostType | null
  enabled?: boolean
}

export function useGetFeed({ latitude, longitude, postType, enabled = true }: UseFeedParams) {
  return useInfiniteQuery({
    queryKey: postKeys.feed(latitude, longitude, postType),
    queryFn: ({ pageParam }) =>
      postService.getFeed({
        location: { latitude, longitude },
        postType: postType ?? undefined,
        page: pageParam,
        pageSize: PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const fetched = allPages.length * PAGE_SIZE
      return fetched < lastPage.totalCount ? allPages.length + 1 : undefined
    },
    enabled: enabled && !!latitude && !!longitude,
    staleTime: 1000 * 60,
  })
}

interface UseSearchPostsParams {
  query: string
  enabled?: boolean
}

export function useSearchPosts({ query, enabled = true }: UseSearchPostsParams) {
  return useQuery<Array<Post>>({
    queryKey: postKeys.search(query),
    queryFn: () => postService.searchPosts(query),
    enabled: enabled && query.trim().length > 1,
    staleTime: 1000 * 30,
  })
}
