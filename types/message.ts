export interface Attachment {
  id: string
  type: "image" | "video" | "document"
  url: string
  name: string
  size?: number
  file?: File
  width?: number
  height?: number
  duration?: number
  thumbnailUrl?: string
  thumbnailWidth?: number
  thumbnailHeight?: number
}

export interface ReadReceipt {
  userId: string
  userName: string
  timestamp: string
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderProfileImage: string
  senderType: "player" | "club"
  content: string
  timestamp: string
  isRead: boolean
  readReceipts?: ReadReceipt[]
  readAt?: string
  deliveredAt?: string
  messageType: "text" | "media" | "document" | "event" | "invitation"
  category?: "recruitment" | "training" | "administrative" | "general"
  attachments?: Attachment[]
  metadata?: {
    [key: string]: any
  }
}

export interface Conversation {
  id: string
  participants: {
    id: string
    name: string
    profileImage: string
    type: "player" | "club"
  }[]
  lastMessage: Omit<Message, "conversationId">
  unreadCount: number
  isStarred: boolean
  relatedTo?: {
    type: "opportunity"
    id: string
    title: string
  }
  createdAt: string
  categories: ("recruitment" | "training" | "administrative" | "general")[]
  labels?: string[]
}
