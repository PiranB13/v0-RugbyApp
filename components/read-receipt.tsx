import { format } from "date-fns"
import { Check, CheckCheck } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { ReadReceipt } from "@/types/message"

interface ReadReceiptProps {
  isRead: boolean
  readReceipts?: ReadReceipt[]
  deliveredAt?: string
  readAt?: string
  isCurrentUser: boolean
}

export function ReadReceipt({ isRead, readReceipts, deliveredAt, readAt, isCurrentUser }: ReadReceiptProps) {
  // Only show read receipts for messages sent by the current user
  if (!isCurrentUser) return null

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return ""
    return format(new Date(timestamp), "HH:mm")
  }

  // If we have detailed read receipts, show them
  if (readReceipts && readReceipts.length > 0) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center text-xs text-white/70 dark:text-white/70">
              <CheckCheck className="h-3 w-3 mr-1" />
              <span>Read</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="left" align="end">
            <div className="space-y-1">
              {readReceipts.map((receipt) => (
                <div key={receipt.userId} className="text-xs">
                  <span className="font-medium">{receipt.userName}</span>
                  <span className="text-muted-foreground ml-1">
                    {format(new Date(receipt.timestamp), "dd MMM, HH:mm")}
                  </span>
                </div>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Otherwise show simple read/delivered status
  if (isRead) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center text-xs text-white/70 dark:text-white/70">
              <CheckCheck className="h-3 w-3 mr-1" />
              <span>Read</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="left" align="end">
            {readAt ? `Read at ${formatTime(readAt)}` : "Read"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  if (deliveredAt) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center text-xs text-white/70 dark:text-white/70">
              <Check className="h-3 w-3 mr-1" />
              <span>Delivered</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="left" align="end">
            {`Delivered at ${formatTime(deliveredAt)}`}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className="flex items-center text-xs text-white/70 dark:text-white/70">
      <Check className="h-3 w-3 mr-1" />
      <span>Sent</span>
    </div>
  )
}
