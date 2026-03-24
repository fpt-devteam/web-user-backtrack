import { privateClient } from '@/lib/api-client'
import type { ApiResponse } from '@/types/api-response.type'
import type { Conversation } from '@/types/chat.type'
import type { CursorPagedResponse } from '@/types/pagination.type'

export const messagerService = {
  /**
   * Fetch a page of conversations for the current user.
   * Normalizes backend response which may use `conversations` key instead of `items`.
   */
  async getConversations(
    cursor?: string | null,
  ): Promise<CursorPagedResponse<Conversation>> {
    const params = cursor ? { cursor } : {}
    const { data } = await privateClient.get<ApiResponse<Record<string, unknown>>>(
      '/api/chat/conversations',
      { params },
    )

    if (!data.success)
      throw new Error(data.error?.message ?? 'Failed to fetch conversations')

    // Backend returns { conversations: [], nextCursor, hasMore }
    // OR the standard { items: [], nextCursor, hasMore }
    const raw = data.data as Record<string, unknown>
    const items = (raw.conversations ?? raw.items ?? []) as Conversation[]

    return {
      items,
      nextCursor: (raw.nextCursor ?? raw.next_cursor ?? null) as string | null,
      hasMore: (raw.hasMore ?? raw.has_more ?? false) as boolean,
    }
  },
}
