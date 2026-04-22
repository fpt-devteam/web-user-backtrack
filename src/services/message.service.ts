import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { privateClient } from '@/lib/api-client'
import { auth, storage } from '@/lib/firebase'
import type { ApiResponse } from '@/types/api-response.type'
import type { Conversation, Message } from '@/types/chat.type'
import type { CursorPagedResponse } from '@/types/pagination.type'

export const messageService = {
  async uploadChatImage(file: File): Promise<string> {
    const uid = auth.currentUser?.uid
    if (!uid) throw new Error('Not authenticated')
    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `chat/images/${uid}/${Date.now()}.${ext}`
    const snapshot = await uploadBytes(ref(storage, path), file, { contentType: file.type })
    return getDownloadURL(snapshot.ref)
  },

  async getConversations(cursor?: string | null): Promise<CursorPagedResponse<Conversation>> {
    const params = cursor ? { cursor } : {}
    const { data } = await privateClient.get<ApiResponse<Record<string, unknown>>>(
      '/api/chat/conversations',
      { params },
    )
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch conversations')
    const raw = data.data
    return {
      items: (raw.conversations ?? raw.items ?? []) as Array<Conversation>,
      nextCursor: (raw.nextCursor ?? raw.next_cursor ?? null) as string | null,
      hasMore: (raw.hasMore ?? raw.has_more ?? false) as boolean,
    }
  },

  async getConversationById(id: string): Promise<Conversation> {
    const { data } = await privateClient.get<ApiResponse<{ conversation: Conversation }>>(
      `/api/chat/conversations/${id}`,
    )
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to fetch conversation')
      console.log('Fetched conversation details:', data.data.conversation)
    return data.data.conversation
  },

  async createSupportConversation(orgId: string): Promise<Conversation> {
    const { data } = await privateClient.post<ApiResponse<{ conversation: Conversation }>>(
      '/api/chat/conversations/organization',
      { orgId },
    )
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to create conversation')
    return data.data.conversation
  },

  async createDirectConversation(memberId: string): Promise<Conversation> {
    const { data } = await privateClient.post<ApiResponse<{ conversation: Conversation }>>(
      '/api/chat/conversations/direct',
      { memberId },
    )
    if (!data.success) throw new Error(data.error?.message ?? 'Failed to create conversation')
    return data.data.conversation
  },

  async getMessages(
    conversationId: string,
    cursor: string | null,
  ): Promise<CursorPagedResponse<Message>> {
    const url =
      `/api/chat/conversations/${conversationId}/messages` + (cursor ? `?cursor=${cursor}` : '')
    const { data } = await privateClient.get<ApiResponse<Record<string, unknown>>>(url)
    if (!data.success)
      throw new Error((data.error as { message?: string }).message ?? 'Failed to fetch messages')
    const raw = data.data
    return {
      items: (raw.messages ?? raw.items ?? []) as Array<Message>,
      nextCursor: (raw.nextCursor ?? raw.next_cursor ?? null) as string | null,
      hasMore: (raw.hasMore ?? raw.has_more ?? false) as boolean,
    }
  },
}
