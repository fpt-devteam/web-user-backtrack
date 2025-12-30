export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Partner {
  id: string;
  displayName: string;
  avatar: string;
}

export interface LastMessage {
  lastContent: string;
  timestamp: string;
}

export interface Conversation {
  conversationId: string;
  partner: Partner;
  lastMessage: LastMessage;
  unreadCount: number;
  updatedAt: string;
}

export interface CreateConversationRequest {
  partnerId: string;
  creatorKeyName: string;
  partnerKeyName: string;
}

export interface CreateConversationResponse {
  conversationId: string;
}