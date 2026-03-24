// src/services/chat.service.ts
import { privateClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api-response.type';
import type {
  Conversation,
  Message,
} from '@/types/chat.type';
import type { CursorPagedResponse } from '@/types/pagination.type';

export const chatService = {
  async getConversations(cursor?: string | null): Promise<CursorPagedResponse<Conversation>> {
    const params = cursor ? { cursor } : {};
    const { data } = await privateClient.get<ApiResponse<CursorPagedResponse<Conversation>>>(
      '/api/chat/conversations',
      { params }
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch conversations');
    return data.data;
  },

  async getConversationById(id: string): Promise<Conversation> {
    const { data } = await privateClient.get<ApiResponse<Conversation>>(
      `/api/chat/conversations/${id}`
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch conversations');
    return data.data;
  },

  /**
   * Returns existing conversation with this org, or null if none exists yet.
   * Fetches all conversation pages and matches by partner.id === orgId.
   */
  async getConversationByOrgId(orgId: string): Promise<Conversation | null> {
    let cursor: string | null = null
    do {
      const page = await chatService.getConversations(cursor)
      const found = page.items.find((c) => c.partner?.id === orgId)
      if (found) return found
      cursor = page.hasMore ? (page.nextCursor ?? null) : null
    } while (cursor)
    return null
  },

  async getMessages(conversationId: string, cursor: string | null): Promise<CursorPagedResponse<Message>> {
    const url = `/api/chat/conversations/${conversationId}/messages` + (cursor ? `?cursor=${cursor}` : '');
    const { data } = await privateClient.get<ApiResponse<Record<string, unknown>>>(url);
    if (!data.success) throw new Error((data.error as { message?: string })?.message ?? 'Failed to fetch messages');

    // Backend returns { messages: [], nextCursor, hasMore } — normalize to CursorPagedResponse shape
    const raw = data.data as Record<string, unknown>;
    const items = (raw.messages ?? raw.items ?? []) as Message[];
    return {
      items,
      nextCursor: (raw.nextCursor ?? raw.next_cursor ?? null) as string | null,
      hasMore: (raw.hasMore ?? raw.has_more ?? false) as boolean,
    };
  },

};