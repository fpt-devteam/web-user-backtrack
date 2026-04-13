import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { postService } from '@/services/post.service'
import type { Post, PostCategory, PostType } from '@/types/post.type'

export const postKeys = {
  all: ['posts'] as const,
  detail: (id: string) => [...postKeys.all, 'detail', id] as const,
  byOrg: (orgId: string) => [...postKeys.all, 'org', orgId] as const,
  feed: (
    lat: number,
    lng: number,
    postType?: PostType | null,
    category?: PostCategory | null,
    radius?: number | null,
  ) => [...postKeys.all, 'feed', lat, lng, postType ?? 'all', category ?? 'all', radius ?? 'default'] as const,
  search: (query: string, postType?: PostType | null, category?: PostCategory | null) =>
    [...postKeys.all, 'search', query, postType ?? 'all', category ?? 'all'] as const,
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
  radiusInKm?: number | null
  postType?: PostType | null
  category?: PostCategory | null
  enabled?: boolean
}

export function useGetFeed({ latitude, longitude, radiusInKm, postType, category, enabled = true }: UseFeedParams) {
  return useInfiniteQuery({
    queryKey: postKeys.feed(latitude, longitude, postType, category, radiusInKm),
    queryFn: ({ pageParam }) =>
      postService.getFeed({
        location: { latitude, longitude },
        query: '',
        filters: {
          geo: { radiusInKm: radiusInKm ?? null },
          postType: postType ?? null,
          category: category ?? null,
        },
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
  postType?: PostType | null
  category?: PostCategory | null
  enabled?: boolean
}

export function useSearchPosts({ query, postType, category, enabled = true }: UseSearchPostsParams) {
  return useQuery<Array<Post>>({
    queryKey: postKeys.search(query, postType, category),
    queryFn: () =>
      postService.searchPosts({
        query,
        filters: {
          postType: postType ?? null,
          category: category ?? null,
        },
      }),
    enabled: enabled,
    staleTime: 1000 * 30,
  })
}
