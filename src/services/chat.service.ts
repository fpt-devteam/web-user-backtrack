// src/services/chat.service.ts
import type { ApiResponse } from '@/types/api-response.type';
import type {
  Conversation,
  Message,
} from '@/types/chat.type';
import type { CursorPagedResponse } from '@/types/pagination.type';
import { privateClient } from '@/lib/api-client';

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
   */
  async getConversationByOrgId(orgId: string): Promise<Conversation | null> {
    const { data } = await privateClient.get<ApiResponse<Conversation | null>>(
      '/api/chat/conversations/partner',
      { params: { partnerId: orgId } }
    )
    if (!data.success) return null
    return data.data
  },

  /**
   * Returns existing direct conversation with a user, or null if none exists yet.
   */
  async getConversationByPartnerId(partnerId: string): Promise<Conversation | null> {
    const { data } = await privateClient.get<ApiResponse<Conversation | null>>(
      '/api/chat/conversations/partner',
      { params: { partnerId } }
    )
    if (!data.success) return null
    return data.data
  },

  async createSupportConversation(orgId: string): Promise<Conversation> {
    const { data } = await privateClient.post<ApiResponse<{ conversation: Conversation }>>(
      '/api/chat/conversations/organization',
      { orgId }
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to create conversation');
    return data.data.conversation;
  },

  async createDirectConversation(memberId: string): Promise<Conversation> {
    const { data } = await privateClient.post<ApiResponse<{ conversation: Conversation }>>(
      '/api/chat/conversations/direct',
      { memberId }
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to create conversation');
    return data.data.conversation;
  },

  async getMessages(conversationId: string, cursor: string | null): Promise<CursorPagedResponse<Message>> {
    const url = `/api/chat/conversations/${conversationId}/messages` + (cursor ? `?cursor=${cursor}` : '');
    const { data } = await privateClient.get<ApiResponse<Record<string, unknown>>>(url);
    if (!data.success) throw new Error((data.error as { message?: string }).message ?? 'Failed to fetch messages');

    // Backend returns { messages: [], nextCursor, hasMore } — normalize to CursorPagedResponse shape
    const raw = data.data;
    const items = (raw.messages ?? raw.items ?? []) as Array<Message>;
    return {
      items,
      nextCursor: (raw.nextCursor ?? raw.next_cursor ?? null) as string | null,
      hasMore: (raw.hasMore ?? raw.has_more ?? false) as boolean,
    };
  },

};