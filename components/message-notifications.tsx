"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { format, isToday, isYesterday } from "date-fns"
import { MessageSquare, X, Check, CheckCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Conversation } from "@/types/message"

// Reuse the sample data from messages page
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
      deliveredAt: new Date(Date.now() - 1000 * 60 * 60 * 5 + 1000 * 5).toISOString(), // 5 seconds after sending
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
]

export function MessageNotifications() {
  const [unreadConversations, setUnreadConversations] = useState<Conversation[]>([])

  useEffect(() => {
    // Filter to only show unread conversations
    setUnreadConversations(sampleConversations.filter((conv) => conv.unreadCount > 0))
  }, [])

  const totalUnread = unreadConversations.reduce((sum, conv) => sum + conv.unreadCount, 0)

  // Format timestamp for display
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp)
    if (isToday(date)) {
      return format(date, "HH:mm")
    } else if (isYesterday(date)) {
      return "Yesterday"
    } else {
      return format(date, "dd MMM")
    }
  }

  const markAsRead = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setUnreadConversations(unreadConversations.filter((conv) => conv.id !== conversationId))
    // In a real app, this would call an API to mark the conversation as read
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative">
          <MessageSquare size={20} />
          {totalUnread > 0 && (
            <Badge className="absolute -top-2 -right-2 px-1 min-w-[20px] h-5 flex items-center justify-center bg-[#1e4620] text-white">
              {totalUnread}
            </Badge>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Messages</span>
          {totalUnread > 0 && <Badge className="bg-[#1e4620] text-white">{totalUnread} unread</Badge>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {unreadConversations.length > 0 ? (
            unreadConversations.map((conversation) => {
              const otherParticipant = conversation.participants.find((p) => p.id !== "player1")
              const isFromCurrentUser = conversation.lastMessage.senderId === "player1"

              return (
                <DropdownMenuItem key={conversation.id} asChild>
                  <Link
                    href={`/messages?conversation=${conversation.id}`}
                    className="p-0 cursor-pointer focus:bg-transparent hover:bg-transparent"
                  >
                    <div className="flex w-full p-2 hover:bg-muted/50 rounded-md">
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
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">
                              {formatMessageTime(conversation.lastMessage.timestamp)}
                            </span>
                            <button
                              onClick={(e) => markAsRead(conversation.id, e)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage.content}</p>
                        <div className="flex items-center justify-between mt-1">
                          {conversation.relatedTo && (
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              {conversation.relatedTo.title}
                            </Badge>
                          )}

                          {/* Read status indicator */}
                          {isFromCurrentUser && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              {conversation.lastMessage.isRead ? (
                                <CheckCheck className="h-3 w-3 mr-1" />
                              ) : (
                                <Check className="h-3 w-3 mr-1" />
                              )}
                              <span>{conversation.lastMessage.isRead ? "Read" : "Sent"}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              )
            })
          ) : (
            <div className="px-2 py-4 text-center text-muted-foreground">No unread messages</div>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/messages" className="justify-center cursor-pointer">
            View all messages
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
