"use client"

import Link from "next/link"
import { MessageSquare } from "lucide-react"
import { Button, type ButtonProps } from "@/components/ui/button"

interface MessageButtonProps extends Omit<ButtonProps, "onClick"> {
  recipientId: string
  recipientName: string
  opportunityId?: string
  opportunityTitle?: string
  className?: string
}

export function MessageButton({
  recipientId,
  recipientName,
  opportunityId,
  opportunityTitle,
  className,
  ...props
}: MessageButtonProps) {
  // Create a conversation URL with optional query parameters
  const getConversationUrl = () => {
    const baseUrl = "/messages"
    const params = new URLSearchParams()

    params.append("recipient", recipientId)
    params.append("name", recipientName)

    if (opportunityId && opportunityTitle) {
      params.append("opportunityId", opportunityId)
      params.append("opportunityTitle", opportunityTitle)
    }

    return `${baseUrl}?${params.toString()}`
  }

  return (
    <Button asChild className={className} {...props}>
      <Link href={getConversationUrl()}>
        <MessageSquare className="mr-2 h-4 w-4" />
        Message
      </Link>
    </Button>
  )
}
