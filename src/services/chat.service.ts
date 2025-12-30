// src/services/chat.service.ts
import { privateClient } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api-response.type';
import type {
  Conversation,
  Message,
  CreateConversationRequest,
  CreateConversationResponse
} from '@/types/chat.types';
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

  async getMessages(conversationId: string, cursor: string | null): Promise<CursorPagedResponse<Message>> {
    const url = `/api/chat/messages/${conversationId}` + (cursor ? `?cursor=${cursor}` : '');
    const { data } = await privateClient.get<ApiResponse<CursorPagedResponse<Message>>>(url);
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch messages');
    return data.data;
  },

  async sendMessage(conversationId: string, content: string): Promise<Message> {
    console.log('Sending message to conversation:', conversationId, 'Content:', content);
    const { data } = await privateClient.post<ApiResponse<Message>>(
      `/api/chat/messages/${conversationId}`,
      { content }
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to send message');
    return data.data;
  },

  async createConversation(request: CreateConversationRequest): Promise<CreateConversationResponse> {
    const { data } = await privateClient.post<ApiResponse<CreateConversationResponse>>(
      '/api/chat/conversations',
      request
    );
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to create conversation');
    return data.data;
  },
};