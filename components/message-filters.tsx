"use client"

import { useState } from "react"
import { Check, Filter, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export type MessageFilterOptions = {
  messageTypes: ("text" | "media" | "document" | "event" | "invitation")[]
  categories: ("recruitment" | "training" | "administrative" | "general")[]
  labels: string[]
  dateRange?: {
    from: Date | undefined
    to: Date | undefined
  }
  hasAttachments?: boolean
  isUnread?: boolean
  isStarred?: boolean
}

interface MessageFiltersProps {
  filters: MessageFilterOptions
  onFiltersChange: (filters: MessageFilterOptions) => void
  availableLabels?: string[]
}

export function MessageFilters({
  filters,
  onFiltersChange,
  availableLabels = ["Important", "Follow-up", "Urgent", "Archived"],
}: MessageFiltersProps) {
  const [open, setOpen] = useState(false)

  const messageTypeOptions = [
    { value: "text", label: "Text" },
    { value: "media", label: "Media" },
    { value: "document", label: "Document" },
    { value: "event", label: "Event" },
    { value: "invitation", label: "Invitation" },
  ]

  const categoryOptions = [
    { value: "recruitment", label: "Recruitment" },
    { value: "training", label: "Training" },
    { value: "administrative", label: "Administrative" },
    { value: "general", label: "General" },
  ]

  const handleToggleMessageType = (type: "text" | "media" | "document" | "event" | "invitation") => {
    const updatedTypes = filters.messageTypes.includes(type)
      ? filters.messageTypes.filter((t) => t !== type)
      : [...filters.messageTypes, type]

    onFiltersChange({
      ...filters,
      messageTypes: updatedTypes,
    })
  }

  const handleToggleCategory = (category: "recruitment" | "training" | "administrative" | "general") => {
    const updatedCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category]

    onFiltersChange({
      ...filters,
      categories: updatedCategories,
    })
  }

  const handleToggleLabel = (label: string) => {
    const updatedLabels = filters.labels.includes(label)
      ? filters.labels.filter((l) => l !== label)
      : [...filters.labels, label]

    onFiltersChange({
      ...filters,
      labels: updatedLabels,
    })
  }

  const handleToggleAttachments = () => {
    onFiltersChange({
      ...filters,
      hasAttachments: !filters.hasAttachments,
    })
  }

  const handleClearFilters = () => {
    onFiltersChange({
      messageTypes: [],
      categories: [],
      labels: [],
      dateRange: undefined,
      hasAttachments: undefined,
      isUnread: undefined,
      isStarred: undefined,
    })
  }

  const activeFilterCount = [
    filters.messageTypes.length > 0,
    filters.categories.length > 0,
    filters.labels.length > 0,
    filters.hasAttachments,
    filters.dateRange?.from || filters.dateRange?.to,
  ].filter(Boolean).length

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <Filter className="mr-2 h-3.5 w-3.5" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2 rounded-sm px-1 font-normal lg:hidden">
              {activeFilterCount}
            </Badge>
          )}
          <div className="hidden space-x-1 lg:flex">
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                {activeFilterCount}
              </Badge>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[340px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search filters..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Message Type">
              {messageTypeOptions.map((option) => (
                <CommandItem key={option.value} onSelect={() => handleToggleMessageType(option.value as any)}>
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      filters.messageTypes.includes(option.value as any)
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible",
                    )}
                  >
                    <Check className="h-4 w-4" />
                  </div>
                  <span>{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Categories">
              {categoryOptions.map((option) => (
                <CommandItem key={option.value} onSelect={() => handleToggleCategory(option.value as any)}>
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      filters.categories.includes(option.value as any)
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible",
                    )}
                  >
                    <Check className="h-4 w-4" />
                  </div>
                  <span>{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Labels">
              <div className="p-2">
                <div className="flex flex-wrap gap-1">
                  {availableLabels.map((label) => (
                    <Badge
                      key={label}
                      variant={filters.labels.includes(label) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleToggleLabel(label)}
                    >
                      {label}
                      {filters.labels.includes(label) && <X className="ml-1 h-3 w-3" />}
                    </Badge>
                  ))}
                </div>
              </div>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Options">
              <CommandItem onSelect={handleToggleAttachments}>
                <div
                  className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    filters.hasAttachments ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible",
                  )}
                >
                  <Check className="h-4 w-4" />
                </div>
                <span>Has Attachments</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
          <div className="border-t p-2">
            <Button variant="outline" size="sm" className="w-full" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
