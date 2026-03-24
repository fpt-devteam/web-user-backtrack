export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

/** User partner info (present only for "direct" conversations) */
export interface Partner {
  id: string;
  displayName: string;
  email?: string | null;
  /** API returns avatarUrl (not avatar) */
  avatarUrl?: string | null;
  /** Legacy alias kept for compatibility – prefer avatarUrl */
  avatar?: string | null;
}

/** Last message preview in a conversation */
export interface LastMessage {
  senderId?: string | null;
  /** API returns "content" (not "lastContent") */
  content?: string | null;
  /** Legacy alias kept for compatibility – prefer content */
  lastContent?: string | null;
  timestamp: string;
}

export interface Conversation {
  conversationId: string;
  /** "direct" | "support" */
  type: 'direct' | 'support' | string;
  /** Present for "support" org conversations */
  orgId?: string | null;
  /** "queue" | "active" | "resolved" | null */
  status?: string | null;
  assignedStaffId?: string | null;
  /** null for "support" conversations */
  partner?: Partner | null;
  lastMessage?: LastMessage | null;
  unreadCount: number;
  createdAt?: string;
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