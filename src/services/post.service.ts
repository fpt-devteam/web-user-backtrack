import type { ApiResponse } from '@/types/api-response.type'
import type { PagedResponse } from '@/types/pagination.type'
import type { FeedApiPost, FeedApiResponse, FeedRequest, Post } from '@/types/post.type'
import { privateClient } from '@/lib/api-client'

function mapApiPost(apiPost: FeedApiPost): Post {
  return {
    id: apiPost.id,
    title: apiPost.item.itemName,
    postType: apiPost.postType,
    imageUrl: apiPost.imageUrls?.[0] ?? null,
    location: {
      latitude: apiPost.location.latitude,
      longitude: apiPost.location.longitude,
      displayAddress: apiPost.displayAddress ?? null,
    },
    distanceKm: apiPost.distanceInMeters != null ? apiPost.distanceInMeters / 1000 : null,
    createdAt: apiPost.createdAt,
    userId: apiPost.author.id,
    userName: apiPost.author.displayName,
    userAvatarUrl: apiPost.author.avatarUrl ?? null,
  }
}

function flattenFeedResponse(raw: FeedApiResponse): Array<Post> {
  return Object.values(raw)
    .flatMap((category) => category ?? [])
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    .filter((p): p is FeedApiPost => p != null && 'id' in p)
    .map(mapApiPost)
}

export const postService = {
  async getPostsByOrgId(orgId: string): Promise<Array<Post>> {
    const { data } = await privateClient.get<ApiResponse<{ items: Array<FeedApiPost> }>>(
      `/api/core/posts/orgs/${orgId}`,
    )
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch org posts')
    return data.data.items.map(mapApiPost)
  },

  async getPostById(id: string): Promise<FeedApiPost> {
    const { data } = await privateClient.get<ApiResponse<FeedApiPost>>(
      `/api/core/posts/${id}`,
    )
    if (!data.success) throw new Error(data.error?.message ?? 'Post not found')
    return data.data
  },

  async getFeed(req: FeedRequest): Promise<PagedResponse<Post>> {
    const { data } = await privateClient.post<ApiResponse<FeedApiResponse>>(
      '/api/core/posts/feed',
      req,
    )
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch feed')
    const items = flattenFeedResponse(data.data ?? {})
    return {
      items,
      page: req.page ?? 1,
      pageSize: req.pageSize ?? items.length,
      totalCount: items.length,
    }
  },

  async searchPosts(query: string): Promise<Array<Post>> {
    const { data } = await privateClient.post<ApiResponse<Array<FeedApiPost>>>(
      '/api/core/posts/search',
      { query },
    )
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to search posts')
    return data.data.map(mapApiPost)
  },
}
