"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { format, isSameDay, isToday, isYesterday } from "date-fns"
import {
  Archive,
  ArrowLeft,
  MessageSquare,
  Plus,
  Search,
  Star,
  StarOff,
  Tag,
  UserPlus,
  Paperclip,
  X,
  FileText,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { ActiveFilters } from "@/components/active-filters"
import { MessageFilters, type MessageFilterOptions } from "@/components/message-filters"
import type { Conversation, Message, Attachment } from "@/types/message"
import { sendMessageNotification } from "@/actions/notification-actions"
import { markMessageAsRead, markConversationAsRead } from "@/actions/message-actions"
import { MessageAttachment } from "@/components/message-attachment"
import { ReadReceipt } from "@/components/read-receipt"

// Sample data - in a real app would come from an API
const sampleConversations: Conversation[] = [
  {
    id: "conv1",
    participants: [
      {
        id: "london-eagles",
        name: "London Eagles RFC",
        profileImage: "/placeholder.svg?height=40&width=40",
        type: "club",
      },
      {
        id: "player1",
        name: "James Wilson",
        profileImage: "/placeholder.svg?height=40&width=40",
        type: "player",
      },
    ],
    lastMessage: {
      id: "msg5",
      senderId: "london-eagles",
      senderName: "London Eagles RFC",
      senderProfileImage: "/placeholder.svg?height=40&width=40",
      senderType: "club",
      content: "Thanks for your interest! Could you come to our training session next Tuesday at 7pm?",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      isRead: false,
      messageType: "text",
      category: "recruitment",
    },
    unreadCount: 1,
    isStarred: true,
    relatedTo: {
      type: "opportunity",
      id: "opp1",
      title: "Scrum-half position",
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    categories: ["recruitment"],
    labels: ["Important"],
  },
  {
    id: "conv2",
    participants: [
      {
        id: "bristol-bears",
        name: "Bristol Bears Academy",
        profileImage: "/placeholder.svg?height=40&width=40",
        type: "club",
      },
      {
        id: "player1",
        name: "James Wilson",
        profileImage: "/placeholder.svg?height=40&width=40",
        type: "player",
      },
    ],
    lastMessage: {
      id: "msg3",
      senderId: "player1",
      senderName: "James Wilson",
      senderProfileImage: "/placeholder.svg?height=40&width=40",
      senderType: "player",
      content: "I'm very interested in your fly-half position. I've attached my highlight reel for your review.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      isRead: true,
      readAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
      messageType: "media",
      category: "recruitment",
      attachments: [
        {
          id: "att1",
          type: "video",
          url: "/placeholder.svg?height=200&width=300",
          name: "highlight-reel.mp4",
          size: 15000000,
          thumbnailUrl: "/rugby-player-action.png",
        },
      ],
    },
    unreadCount: 0,
    isStarred: false,
    relatedTo: {
      type: "opportunity",
      id: "opp2",
      title: "Fly-half position",
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    categories: ["recruitment"],
    labels: ["Follow-up"],
  },
  {
    id: "conv3",
    participants: [
      {
        id: "edinburgh-rugby",
        name: "Edinburgh Rugby Club",
        profileImage: "/placeholder.svg?height=40&width=40",
        type: "club",
      },
      {
        id: "player1",
        name: "James Wilson",
        profileImage: "/placeholder.svg?height=40&width=40",
        type: "player",
      },
    ],
    lastMessage: {
      id: "msg7",
      senderId: "edinburgh-rugby",
      senderName: "Edinburgh Rugby Club",
      senderProfileImage: "/placeholder.svg?height=40&width=40",
      senderType: "club",
      content: "We've reviewed your profile and would like to invite you for a trial next month. Are you available?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      isRead: true,
      messageType: "invitation",
      category: "training",
    },
    unreadCount: 0,
    isStarred: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
    categories: ["training", "recruitment"],
    labels: ["Urgent"],
  },
  {
    id: "conv4",
    participants: [
      {
        id: "cardiff-rfc",
        name: "Cardiff RFC",
        profileImage: "/placeholder.svg?height=40&width=40",
        type: "club",
      },
      {
        id: "player1",
        name: "James Wilson",
        profileImage: "/placeholder.svg?height=40&width=40",
        type: "player",
      },
    ],
    lastMessage: {
      id: "msg9",
      senderId: "cardiff-rfc",
      senderName: "Cardiff RFC",
      senderProfileImage: "/placeholder.svg?height=40&width=40",
      senderType: "club",
      content: "Thank you for your application. Unfortunately, we've filled the position with another candidate.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
      isRead: true,
      messageType: "text",
      category: "administrative",
    },
    unreadCount: 0,
    isStarred: false,
    relatedTo: {
      type: "opportunity",
      id: "opp4",
      title: "Winger position",
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
    categories: ["administrative", "recruitment"],
    labels: ["Archived"],
  },
  {
    id: "conv5",
    participants: [
      {
        id: "glasgow-warriors",
        name: "Glasgow Warriors",
        profileImage: "/placeholder.svg?height=40&width=40",
        type: "club",
      },
      {
        id: "player1",
        name: "James Wilson",
        profileImage: "/placeholder.svg?height=40&width=40",
        type: "player",
      },
    ],
    lastMessage: {
      id: "msg11",
      senderId: "glasgow-warriors",
      senderName: "Glasgow Warriors",
      senderProfileImage: "/placeholder.svg?height=40&width=40",
      senderType: "club",
      content: "Here's the training schedule for next month. Please confirm which sessions you can attend.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
      isRead: true,
      messageType: "document",
      category: "training",
      attachments: [
        {
          id: "att2",
          type: "document",
          url: "/placeholder.svg?height=200&width=300",
          name: "training-schedule.pdf",
          size: 2500000,
        },
      ],
    },
    unreadCount: 0,
    isStarred: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(), // 15 days ago
    categories: ["training"],
    labels: [],
  },
  {
    id: "conv6",
    participants: [
      {
        id: "harlequins",
        name: "Harlequins RFC",
        profileImage: "/placeholder.svg?height=40&width=40",
        type: "club",
      },
      {
        id: "player1",
        name: "James Wilson",
        profileImage: "/placeholder.svg?height=40&width=40",
        type: "player",
      },
    ],
    lastMessage: {
      id: "msg13",
      senderId: "harlequins",
      senderName: "Harlequins RFC",
      senderProfileImage: "/placeholder.svg?height=40&width=40",
      senderType: "club",
      content: "We're organizing a charity event next month. Would you be interested in participating?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
      isRead: true,
      messageType: "event",
      category: "general",
    },
    unreadCount: 0,
    isStarred: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(), // 20 days ago
    categories: ["general"],
    labels: [],
  },
]

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(sampleConversations)
  const [filter, setFilter] = useState<"all" | "unread" | "starred">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [advancedFilters, setAdvancedFilters] = useState<MessageFilterOptions>({
    messageTypes: [],
    categories: [],
    labels: [],
    hasAttachments: undefined,
    isUnread: undefined,
    isStarred: undefined,
  })

  // Apply filters and search
  const filteredConversations = conversations.filter((conversation) => {
    // Apply basic filters
    if (filter === "unread" && conversation.unreadCount === 0) return false
    if (filter === "starred" && !conversation.isStarred) return false

    // Apply advanced filters
    if (
      advancedFilters.messageTypes.length > 0 &&
      !advancedFilters.messageTypes.includes(conversation.lastMessage.messageType)
    ) {
      return false
    }

    if (
      advancedFilters.categories.length > 0 &&
      !advancedFilters.categories.some((category) => conversation.categories.includes(category))
    ) {
      return false
    }

    if (
      advancedFilters.labels.length > 0 &&
      !advancedFilters.labels.some((label) => conversation.labels?.includes(label))
    ) {
      return false
    }

    if (
      advancedFilters.hasAttachments &&
      (!conversation.lastMessage.attachments || conversation.lastMessage.attachments.length === 0)
    ) {
      return false
    }

    if (advancedFilters.isUnread && conversation.unreadCount === 0) {
      return false
    }

    if (advancedFilters.isStarred && !conversation.isStarred) {
      return false
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const otherParticipant = conversation.participants.find((p) => p.id !== "player1") // Assuming current user is player1
      return (
        otherParticipant?.name.toLowerCase().includes(query) ||
        conversation.lastMessage.content.toLowerCase().includes(query) ||
        conversation.relatedTo?.title.toLowerCase().includes(query) ||
        conversation.categories.some((category) => category.toLowerCase().includes(query)) ||
        conversation.labels?.some((label) => label.toLowerCase().includes(query))
      )
    }

    return true
  })

  // Select first conversation if none selected
  useEffect(() => {
    if (filteredConversations.length > 0 && !selectedConversation) {
      setSelectedConversation(filteredConversations[0])
    }
  }, [filteredConversations, selectedConversation])

  // Format timestamp for display
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp)
    if (isToday(date)) {
      return format(date, "HH:mm")
    } else if (isYesterday(date)) {
      return "Yesterday"
    } else if (isSameDay(date, new Date())) {
      return format(date, "HH:mm")
    } else {
      return format(date, "dd MMM")
    }
  }

  // Handle starring/unstarring a conversation
  const toggleStar = (conversationId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    setConversations(
      conversations.map((conv) => (conv.id === conversationId ? { ...conv, isStarred: !conv.isStarred } : conv)),
    )
  }

  // Handle removing a specific filter
  const handleRemoveFilter = (type: string, value: string) => {
    switch (type) {
      case "messageType":
        setAdvancedFilters({
          ...advancedFilters,
          messageTypes: advancedFilters.messageTypes.filter((t) => t !== value),
        })
        break
      case "category":
        setAdvancedFilters({
          ...advancedFilters,
          categories: advancedFilters.categories.filter((c) => c !== value),
        })
        break
      case "label":
        setAdvancedFilters({
          ...advancedFilters,
          labels: advancedFilters.labels.filter((l) => l !== value),
        })
        break
      case "hasAttachments":
        setAdvancedFilters({
          ...advancedFilters,
          hasAttachments: undefined,
        })
        break
      case "isUnread":
        setAdvancedFilters({
          ...advancedFilters,
          isUnread: undefined,
        })
        break
      case "isStarred":
        setAdvancedFilters({
          ...advancedFilters,
          isStarred: undefined,
        })
        break
      default:
        break
    }
  }

  // Handle clearing all filters
  const handleClearFilters = () => {
    setAdvancedFilters({
      messageTypes: [],
      categories: [],
      labels: [],
      hasAttachments: undefined,
      isUnread: undefined,
      isStarred: undefined,
    })
    setFilter("all")
    setSearchQuery("")
  }

  // Get message type icon
  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case "text":
        return null
      case "media":
        return (
          <Badge variant="outline" className="ml-1 px-1 py-0 text-xs">
            Media
          </Badge>
        )
      case "document":
        return (
          <Badge variant="outline" className="ml-1 px-1 py-0 text-xs">
            Doc
          </Badge>
        )
      case "event":
        return (
          <Badge variant="outline" className="ml-1 px-1 py-0 text-xs">
            Event
          </Badge>
        )
      case "invitation":
        return (
          <Badge variant="outline" className="ml-1 px-1 py-0 text-xs">
            Invite
          </Badge>
        )
      default:
        return null
    }
  }

  // Handle selecting a conversation
  const handleSelectConversation = async (conversation: Conversation) => {
    // If the conversation has unread messages, mark them as read
    if (conversation.unreadCount > 0) {
      // Update the UI immediately
      setConversations(
        conversations.map((conv) => {
          if (conv.id === conversation.id) {
            return {
              ...conv,
              unreadCount: 0,
              lastMessage: {
                ...conv.lastMessage,
                isRead: true,
                readAt: new Date().toISOString(),
              },
            }
          }
          return conv
        }),
      )

      // Call the server action to mark the conversation as read
      await markConversationAsRead(conversation.id, "player1", "James Wilson")
    }

    setSelectedConversation(conversation)
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between p-2">
            <Link href="/dashboard" className="flex items-center text-muted-foreground">
              <ArrowLeft size={18} className="mr-2" />
              <span className="font-medium">Back</span>
            </Link>
            <div className="text-xl font-bold">
              <span className="text-[#1e4620] dark:text-[#3a8e3f]">Rugby</span>Connect
            </div>
            <ThemeToggle />
          </div>
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center justify-between px-2 pb-2">
            <MessageFilters
              filters={advancedFilters}
              onFiltersChange={setAdvancedFilters}
              availableLabels={["Important", "Follow-up", "Urgent", "Archived"]}
            />
            <div className="flex items-center space-x-1">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                className="h-8"
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button
                variant={filter === "unread" ? "default" : "outline"}
                size="sm"
                className="h-8"
                onClick={() => setFilter("unread")}
              >
                Unread
                {conversations.reduce((sum, conv) => sum + conv.unreadCount, 0) > 0 && (
                  <Badge className="ml-1 bg-[#1e4620] text-white">
                    {conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)}
                  </Badge>
                )}
              </Button>
              <Button
                variant={filter === "starred" ? "default" : "outline"}
                size="sm"
                className="h-8"
                onClick={() => setFilter("starred")}
              >
                <Star className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <ActiveFilters
            filters={{
              ...advancedFilters,
              isUnread: filter === "unread" ? true : advancedFilters.isUnread,
              isStarred: filter === "starred" ? true : advancedFilters.isStarred,
            }}
            onRemoveFilter={handleRemoveFilter}
            onClearFilters={handleClearFilters}
          />
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="flex justify-between items-center">
              <span>Conversations</span>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Plus className="h-4 w-4" />
              </Button>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conversation) => {
                    const otherParticipant = conversation.participants.find((p) => p.id !== "player1") // Assuming current user is player1

                    return (
                      <SidebarMenuItem key={conversation.id}>
                        <SidebarMenuButton
                          isActive={selectedConversation?.id === conversation.id}
                          onClick={() => handleSelectConversation(conversation)}
                          className="h-auto py-3"
                        >
                          <div className="flex w-full">
                            <div className="relative mr-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden">
                                <Image
                                  src={otherParticipant?.profileImage || "/placeholder.svg"}
                                  alt={otherParticipant?.name || ""}
                                  width={40}
                                  height={40}
                                  className="object-cover"
                                />
                              </div>
                              {conversation.unreadCount > 0 && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#1e4620] rounded-full" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between">
                                <h4 className="font-medium truncate">{otherParticipant?.name}</h4>
                                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                  {formatMessageTime(conversation.lastMessage.timestamp)}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <p className="text-sm text-muted-foreground truncate">
                                  {conversation.lastMessage.content}
                                  {getMessageTypeIcon(conversation.lastMessage.messageType)}
                                </p>
                                <button
                                  onClick={(e) => toggleStar(conversation.id, e)}
                                  className="ml-2 text-muted-foreground hover:text-[#1e4620] dark:hover:text-[#3a8e3f]"
                                >
                                  {conversation.isStarred ? (
                                    <Star className="h-4 w-4 text-[#1e4620] dark:text-[#3a8e3f]" />
                                  ) : (
                                    <StarOff className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {conversation.categories.length > 0 && (
                                  <Badge variant="outline" className="text-xs px-1 py-0">
                                    {conversation.categories[0].charAt(0).toUpperCase() +
                                      conversation.categories[0].slice(1)}
                                  </Badge>
                                )}
                                {conversation.relatedTo && (
                                  <Badge variant="outline" className="text-xs px-1 py-0">
                                    {conversation.relatedTo.title}
                                  </Badge>
                                )}
                                {conversation.labels && conversation.labels.length > 0 && (
                                  <Badge variant="secondary" className="text-xs px-1 py-0 flex items-center">
                                    <Tag className="h-3 w-3 mr-1" />
                                    {conversation.labels[0]}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })
                ) : (
                  <div className="px-4 py-8 text-center text-muted-foreground">No conversations found</div>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        {selectedConversation ? (
          <ConversationView conversation={selectedConversation} onBack={() => setSelectedConversation(null)} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your Messages</h2>
            <p className="text-muted-foreground text-center max-w-md">
              Select a conversation to view messages or start a new conversation with a club
            </p>
            <Button className="mt-4 bg-[#1e4620] hover:bg-[#2a5f2d] text-white">
              <Plus className="mr-2 h-4 w-4" /> New Message
            </Button>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  )
}

// Conversation View Component
interface ConversationViewProps {
  conversation: Conversation
  onBack: () => void
}

function ConversationView({ conversation, onBack }: ConversationViewProps) {
  const otherParticipant = conversation.participants.find((p) => p.id !== "player1") // Assuming current user is player1
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [messageType, setMessageType] = useState<"text" | "media" | "document" | "event" | "invitation">("text")
  const [messageCategory, setMessageCategory] = useState<"recruitment" | "training" | "administrative" | "general">(
    conversation.categories[0] || "general",
  )
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const messageContainerRef = useRef<HTMLDivElement>(null)
  const [visibleMessages, setVisibleMessages] = useState<Set<string>>(new Set())
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Simulate loading messages from an API
  useEffect(() => {
    setIsLoading(true)

    // This would be replaced with an actual API call
    setTimeout(() => {
      // Generate some sample messages for this conversation
      const sampleMessages: Message[] = [
        {
          id: "msg1",
          conversationId: conversation.id,
          senderId: "player1",
          senderName: "James Wilson",
          senderProfileImage: "/placeholder.svg?height=40&width=40",
          senderType: "player",
          content: `Hello, I'm interested in the ${conversation.relatedTo?.title || "position"} at your club.`,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
          isRead: true,
          readAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 5).toISOString(), // 5 minutes after sending
          deliveredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 10).toISOString(), // 10 seconds after sending
          messageType: "text",
          category: "recruitment",
        },
        {
          id: "msg2",
          conversationId: conversation.id,
          senderId: otherParticipant?.id || "",
          senderName: otherParticipant?.name || "",
          senderProfileImage: otherParticipant?.profileImage || "",
          senderType: "club",
          content: `Hi James, thanks for your interest! Can you tell us more about your experience?`,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1.5).toISOString(), // 1.5 days ago
          isRead: true,
          messageType: "text",
          category: "recruitment",
        },
        {
          id: "msg3",
          conversationId: conversation.id,
          senderId: "player1",
          senderName: "James Wilson",
          senderProfileImage: "/placeholder.svg?height=40&width=40",
          senderType: "player",
          content:
            "I've been playing rugby for 5 years at a semi-professional level. I'm currently looking for a new challenge where I can contribute to a team with ambition.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          isRead: true,
          readAt: new Date(Date.now() - 1000 * 60 * 60 * 24 + 1000 * 60 * 10).toISOString(), // 10 minutes after sending
          deliveredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 + 1000 * 5).toISOString(), // 5 seconds after sending
          messageType: "text",
          category: "recruitment",
        },
      ]

      // Add the last message from the conversation
      sampleMessages.push({
        id: "msg4",
        conversationId: conversation.id,
        senderId: otherParticipant?.id || "",
        senderName: otherParticipant?.name || "",
        senderProfileImage: otherParticipant?.profileImage || "",
        senderType: "club",
        content: conversation.lastMessage.content,
        timestamp: conversation.lastMessage.timestamp,
        isRead: conversation.lastMessage.isRead,
        readAt: conversation.lastMessage.readAt,
        deliveredAt: conversation.lastMessage.deliveredAt,
        messageType: conversation.lastMessage.messageType,
        category: conversation.lastMessage.category,
        attachments: conversation.lastMessage.attachments,
      })

      setMessages(sampleMessages)
      setIsLoading(false)
    }, 1000)
  }, [
    conversation.id,
    conversation.lastMessage.content,
    conversation.lastMessage.isRead,
    conversation.lastMessage.timestamp,
    conversation.lastMessage.messageType,
    conversation.lastMessage.category,
    conversation.lastMessage.attachments,
    conversation.lastMessage.readAt,
    conversation.lastMessage.deliveredAt,
    conversation.relatedTo?.title,
    otherParticipant,
  ])

  // Set up intersection observer to track which messages are visible
  useEffect(() => {
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    // Create a new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const messageId = entry.target.getAttribute("data-message-id")
          if (messageId) {
            if (entry.isIntersecting) {
              // Message is visible
              setVisibleMessages((prev) => {
                const newSet = new Set(prev)
                newSet.add(messageId)
                return newSet
              })

              // If the message is from the other participant and not read yet, mark it as read
              const message = messages.find((m) => m.id === messageId)
              if (
                message &&
                !message.isRead &&
                message.senderId !== "player1" // Not sent by current user
              ) {
                // Mark as read in the UI
                setMessages((prevMessages) =>
                  prevMessages.map((m) =>
                    m.id === messageId
                      ? {
                          ...m,
                          isRead: true,
                          readAt: new Date().toISOString(),
                        }
                      : m,
                  ),
                )

                // Call the server action to mark as read
                markMessageAsRead(messageId, "player1", "James Wilson")
              }
            } else {
              // Message is no longer visible
              setVisibleMessages((prev) => {
                const newSet = new Set(prev)
                newSet.delete(messageId)
                return newSet
              })
            }
          }
        })
      },
      {
        root: messageContainerRef.current,
        threshold: 0.5, // Message is considered visible when 50% is in view
      },
    )

    // Observe all message elements
    const messageElements = document.querySelectorAll("[data-message-id]")
    messageElements.forEach((element) => {
      observerRef.current?.observe(element)
    })

    return () => {
      observerRef.current?.disconnect()
    }
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() && selectedFiles.length === 0) return

    // In a real app, this would upload files to storage and get URLs
    const attachments: Attachment[] = selectedFiles.map((file, index) => ({
      id: `attachment-${Date.now()}-${index}`,
      type: file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "document",
      url: URL.createObjectURL(file), // In a real app, this would be a storage URL
      name: file.name,
      size: file.size,
      file,
    }))

    // In a real app, this would send the message to an API
    const newMsg: Message = {
      id: `new-${Date.now()}`,
      conversationId: conversation.id,
      senderId: "player1",
      senderName: "James Wilson",
      senderProfileImage: "/placeholder.svg?height=40&width=40",
      senderType: "player",
      content: newMessage,
      timestamp: new Date().toISOString(),
      isRead: false,
      deliveredAt: new Date().toISOString(), // Assume immediate delivery in this demo
      messageType:
        selectedFiles.length > 0
          ? selectedFiles.some((f) => f.type.startsWith("image/"))
            ? "media"
            : "document"
          : messageType,
      category: messageCategory,
      attachments: attachments.length > 0 ? attachments : undefined,
    }

    setMessages([...messages, newMsg])
    setNewMessage("")
    setSelectedFiles([])

    // Get the recipient (the other participant)
    const recipient = conversation.participants.find((p) => p.id !== "player1")

    if (recipient) {
      // Send notification to the recipient
      await sendMessageNotification(recipient.id, "player1", "James Wilson", newMessage, conversation.id)
    }

    // Scroll to bottom after sending
    setTimeout(() => {
      if (messageContainerRef.current) {
        messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight
      }
    }, 100)
  }

  // Group messages by date
  const groupMessagesByDate = (msgs: Message[]) => {
    const groups: { date: string; messages: Message[] }[] = []

    msgs.forEach((message) => {
      const messageDate = new Date(message.timestamp)
      const dateStr = isToday(messageDate)
        ? "Today"
        : isYesterday(messageDate)
          ? "Yesterday"
          : format(messageDate, "dd MMMM yyyy")

      const existingGroup = groups.find((g) => g.date === dateStr)
      if (existingGroup) {
        existingGroup.messages.push(message)
      } else {
        groups.push({
          date: dateStr,
          messages: [message],
        })
      }
    })

    return groups
  }

  const messageGroups = groupMessagesByDate(messages)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messageContainerRef.current && !isLoading) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight
    }
  }, [messages, isLoading])

  return (
    <div className="flex flex-col h-svh">
      {/* Conversation Header */}
      <header className="border-b px-4 py-3">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="flex items-center flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
              <Image
                src={otherParticipant?.profileImage || "/placeholder.svg"}
                alt={otherParticipant?.name || ""}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="font-semibold truncate">{otherParticipant?.name}</h2>
              <div className="flex items-center text-xs text-muted-foreground">
                {conversation.relatedTo && <span className="mr-2">Re: {conversation.relatedTo.title}</span>}
                {conversation.categories.length > 0 && (
                  <Badge variant="outline" className="text-xs px-1 py-0 mr-1">
                    {conversation.categories[0].charAt(0).toUpperCase() + conversation.categories[0].slice(1)}
                  </Badge>
                )}
                {conversation.labels && conversation.labels.length > 0 && (
                  <Badge variant="secondary" className="text-xs px-1 py-0 flex items-center">
                    <Tag className="h-3 w-3 mr-1" />
                    {conversation.labels[0]}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon">
              <Star
                className={`h-5 w-5 ${conversation.isStarred ? "text-[#1e4620] dark:text-[#3a8e3f] fill-current" : ""}`}
              />
            </Button>
            <Button variant="ghost" size="icon">
              <Archive className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Message Container */}
      <div id="message-container" ref={messageContainerRef} className="flex-1 overflow-y-auto p-4 space-y-6">
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-pulse space-y-4 w-full max-w-md">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                  <div className={`h-16 bg-muted rounded-lg ${i % 2 === 0 ? "w-4/5" : "w-3/5"}`} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Related Opportunity */}
            {conversation.relatedTo && (
              <div className="bg-muted/30 rounded-lg p-4 border border-border mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Position Inquiry</h3>
                  <Badge variant="outline">{otherParticipant?.name}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  This conversation is regarding your interest in the following position:
                </p>
                <div className="font-medium flex items-center">
                  <UserPlus className="h-4 w-4 mr-2 text-[#1e4620] dark:text-[#3a8e3f]" />
                  {conversation.relatedTo.title}
                </div>
              </div>
            )}

            {/* Messages */}
            {messageGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="space-y-4">
                <div className="relative flex items-center justify-center">
                  <Separator className="absolute w-full" />
                  <span className="bg-background px-2 text-xs text-muted-foreground z-10">{group.date}</span>
                </div>

                {group.messages.map((message) => {
                  const isCurrentUser = message.senderId === "player1" // Assuming current user is player1
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                      data-message-id={message.id}
                    >
                      {!isCurrentUser && (
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                          <Image
                            src={message.senderProfileImage || "/placeholder.svg"}
                            alt={message.senderName}
                            width={32}
                            height={32}
                            className="object-cover"
                          />
                        </div>
                      )}

                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          isCurrentUser
                            ? "bg-[#1e4620] dark:bg-[#3a8e3f] text-white rounded-br-none"
                            : "bg-muted rounded-bl-none"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {message.messageType !== "text" && (
                            <Badge variant={isCurrentUser ? "secondary" : "outline"} className="text-xs px-1 py-0">
                              {message.messageType.charAt(0).toUpperCase() + message.messageType.slice(1)}
                            </Badge>
                          )}
                          {message.category && (
                            <Badge variant={isCurrentUser ? "secondary" : "outline"} className="text-xs px-1 py-0">
                              {message.category.charAt(0).toUpperCase() + message.category.slice(1)}
                            </Badge>
                          )}
                        </div>

                        <p className="whitespace-pre-wrap break-words">{message.content}</p>

                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {message.attachments.map((attachment) => (
                              <MessageAttachment key={attachment.id} attachment={attachment} isPreview={false} />
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-1">
                          <span className={`text-xs ${isCurrentUser ? "text-white/70" : "text-muted-foreground"}`}>
                            {format(new Date(message.timestamp), "HH:mm")}
                          </span>

                          {/* Read receipt indicator */}
                          {isCurrentUser && (
                            <ReadReceipt
                              isRead={message.isRead}
                              readAt={message.readAt}
                              deliveredAt={message.deliveredAt}
                              readReceipts={message.readReceipts}
                              isCurrentUser={isCurrentUser}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
          <div className="flex items-center gap-2 px-2">
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground mr-2">Type:</span>
              <select
                value={messageType}
                onChange={(e) => setMessageType(e.target.value as any)}
                className="text-sm bg-transparent border-none focus:outline-none focus:ring-0"
              >
                <option value="text">Text</option>
                <option value="media">Media</option>
                <option value="document">Document</option>
                <option value="event">Event</option>
                <option value="invitation">Invitation</option>
              </select>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground mr-2">Category:</span>
              <select
                value={messageCategory}
                onChange={(e) => setMessageCategory(e.target.value as any)}
                className="text-sm bg-transparent border-none focus:outline-none focus:ring-0"
              >
                <option value="recruitment">Recruitment</option>
                <option value="training">Training</option>
                <option value="administrative">Administrative</option>
                <option value="general">General</option>
              </select>
            </div>
          </div>

          {selectedFiles.length > 0 && (
            <div className="px-2 py-2">
              <div className="flex flex-wrap gap-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center bg-muted rounded-md p-1 pr-2">
                    <div className="w-6 h-6 rounded bg-background flex items-center justify-center mr-1">
                      {file.type.startsWith("image/") ? (
                        <Image
                          src={URL.createObjectURL(file) || "/placeholder.svg"}
                          alt={file.name}
                          width={24}
                          height={24}
                          className="object-cover rounded"
                        />
                      ) : (
                        <FileText className="h-3 w-3" />
                      )}
                    </div>
                    <span className="text-xs truncate max-w-[100px]">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 ml-1"
                      onClick={() => setSelectedFiles((prev) => prev.filter((_, i) => i !== index))}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 min-h-[80px] max-h-[200px] focus:outline-none focus:ring-2 focus:ring-[#1e4620] dark:focus:ring-[#3a8e3f] resize-none"
                placeholder={selectedFiles.length > 0 ? "Add a message (optional)..." : "Type a message..."}
                rows={3}
              />
              <div className="absolute bottom-2 right-2 flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) {
                      const newFiles = Array.from(e.target.files)
                      setSelectedFiles((prev) => [...prev, ...newFiles])
                    }
                  }}
                  accept="image/*,video/*,application/pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="bg-[#1e4620] hover:bg-[#2a5f2d] text-white"
              disabled={!newMessage.trim() && selectedFiles.length === 0}
            >
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
