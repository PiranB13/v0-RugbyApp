"use client"

import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { MessageFilterOptions } from "@/components/message-filters"

interface ActiveFiltersProps {
  filters: MessageFilterOptions
  onRemoveFilter: (type: string, value: string) => void
  onClearFilters: () => void
}

export function ActiveFilters({ filters, onRemoveFilter, onClearFilters }: ActiveFiltersProps) {
  const hasActiveFilters =
    filters.messageTypes.length > 0 ||
    filters.categories.length > 0 ||
    filters.labels.length > 0 ||
    filters.hasAttachments ||
    filters.isUnread ||
    filters.isStarred

  if (!hasActiveFilters) {
    return null
  }

  const getFilterLabel = (type: string, value: string) => {
    switch (type) {
      case "messageType":
        return value.charAt(0).toUpperCase() + value.slice(1)
      case "category":
        return value.charAt(0).toUpperCase() + value.slice(1)
      case "label":
        return value
      default:
        return value
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 p-2">
      {filters.messageTypes.map((type) => (
        <Badge key={`type-${type}`} variant="secondary" className="flex items-center gap-1">
          Type: {getFilterLabel("messageType", type)}
          <Button
            variant="ghost"
            size="icon"
            className="h-3 w-3 p-0"
            onClick={() => onRemoveFilter("messageType", type)}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove {type} filter</span>
          </Button>
        </Badge>
      ))}

      {filters.categories.map((category) => (
        <Badge key={`category-${category}`} variant="secondary" className="flex items-center gap-1">
          Category: {getFilterLabel("category", category)}
          <Button
            variant="ghost"
            size="icon"
            className="h-3 w-3 p-0"
            onClick={() => onRemoveFilter("category", category)}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove {category} filter</span>
          </Button>
        </Badge>
      ))}

      {filters.labels.map((label) => (
        <Badge key={`label-${label}`} variant="secondary" className="flex items-center gap-1">
          Label: {getFilterLabel("label", label)}
          <Button variant="ghost" size="icon" className="h-3 w-3 p-0" onClick={() => onRemoveFilter("label", label)}>
            <X className="h-3 w-3" />
            <span className="sr-only">Remove {label} filter</span>
          </Button>
        </Badge>
      ))}

      {filters.hasAttachments && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Has Attachments
          <Button
            variant="ghost"
            size="icon"
            className="h-3 w-3 p-0"
            onClick={() => onRemoveFilter("hasAttachments", "true")}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove has attachments filter</span>
          </Button>
        </Badge>
      )}

      {(filters.isUnread || filters.isStarred) && (
        <>
          {filters.isUnread && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Unread
              <Button
                variant="ghost"
                size="icon"
                className="h-3 w-3 p-0"
                onClick={() => onRemoveFilter("isUnread", "true")}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove unread filter</span>
              </Button>
            </Badge>
          )}

          {filters.isStarred && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Starred
              <Button
                variant="ghost"
                size="icon"
                className="h-3 w-3 p-0"
                onClick={() => onRemoveFilter("isStarred", "true")}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove starred filter</span>
              </Button>
            </Badge>
          )}
        </>
      )}

      <Separator orientation="vertical" className="h-4" />

      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={onClearFilters}>
        Clear all
      </Button>
    </div>
  )
}
