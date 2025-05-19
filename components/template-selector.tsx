"use client"

import { useState, useEffect } from "react"
import { ChevronDown, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import type { MessageTemplate } from "@/types/message-template"
import { templateService } from "@/services/template-service"

interface TemplateSelectorProps {
  onSelectTemplate: (template: MessageTemplate) => void
  category?: MessageTemplate["category"]
}

export function TemplateSelector({ onSelectTemplate, category }: TemplateSelectorProps) {
  const [open, setOpen] = useState(false)
  const [templates, setTemplates] = useState<MessageTemplate[]>([])
  const [selectedCategory, setSelectedCategory] = useState<MessageTemplate["category"]>(category || "recruitment")

  useEffect(() => {
    // Load templates based on category
    const loadedTemplates = category ? templateService.getTemplatesByCategory(category) : templateService.getTemplates()
    setTemplates(loadedTemplates)
  }, [category])

  const handleCategoryChange = (newCategory: MessageTemplate["category"]) => {
    setSelectedCategory(newCategory)
    const filteredTemplates = templateService.getTemplatesByCategory(newCategory)
    setTemplates(filteredTemplates)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Select a template</span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Tabs
          defaultValue={selectedCategory}
          onValueChange={(value) => handleCategoryChange(value as MessageTemplate["category"])}
        >
          <div className="flex items-center px-3 pb-2 pt-3">
            <TabsList className="w-full">
              <TabsTrigger value="recruitment" className="flex-1">
                Recruitment
              </TabsTrigger>
              <TabsTrigger value="training" className="flex-1">
                Training
              </TabsTrigger>
              <TabsTrigger value="administrative" className="flex-1">
                Admin
              </TabsTrigger>
              <TabsTrigger value="general" className="flex-1">
                General
              </TabsTrigger>
            </TabsList>
          </div>

          <Command>
            <CommandInput placeholder="Search templates..." />
            <CommandList>
              <CommandEmpty>No templates found.</CommandEmpty>
              <CommandGroup>
                {templates.map((template) => (
                  <CommandItem
                    key={template.id}
                    onSelect={() => {
                      onSelectTemplate(template)
                      setOpen(false)
                    }}
                    className="flex flex-col items-start"
                  >
                    <div className="flex w-full items-center justify-between">
                      <span className="font-medium">{template.title}</span>
                      {template.isDefault && (
                        <Badge variant="outline" className="ml-2">
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                      {template.content.substring(0, 60)}...
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {template.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {template.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
