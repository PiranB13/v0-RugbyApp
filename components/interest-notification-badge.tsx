"use client"

import { Badge } from "@/components/ui/badge"

interface InterestNotificationBadgeProps {
  count: number
}

export function InterestNotificationBadge({ count }: InterestNotificationBadgeProps) {
  if (count === 0) return null

  return (
    <Badge className="bg-[#1e4620] text-white absolute -top-2 -right-2 px-1.5 min-w-[20px] h-5 flex items-center justify-center">
      {count > 99 ? "99+" : count}
    </Badge>
  )
}
