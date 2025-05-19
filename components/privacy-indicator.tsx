import { Globe, Lock, Users } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { PrivacyLevel } from "./privacy-settings-dialog"

interface PrivacyIndicatorProps {
  level: PrivacyLevel
  className?: string
}

export function PrivacyIndicator({ level, className }: PrivacyIndicatorProps) {
  const getIcon = () => {
    switch (level) {
      case "public":
        return <Globe className={`h-4 w-4 ${className}`} />
      case "connections":
        return <Users className={`h-4 w-4 ${className}`} />
      case "private":
        return <Lock className={`h-4 w-4 ${className}`} />
    }
  }

  const getTooltipText = () => {
    switch (level) {
      case "public":
        return "Visible to everyone"
      case "connections":
        return "Visible to connections only"
      case "private":
        return "Private - only visible to you"
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">{getIcon()}</div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
