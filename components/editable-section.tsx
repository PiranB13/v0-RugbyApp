"use client"

import { useState, type ReactNode } from "react"
import { Edit, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface EditableSectionProps {
  title: string
  children: ReactNode
  editForm: ReactNode
  onSave?: () => void
  className?: string
}

export function EditableSection({ title, children, editForm, onSave, className }: EditableSectionProps) {
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    if (onSave) {
      onSave()
    }
    setIsEditing(false)
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div>
          {!isEditing ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 p-0"
              aria-label="Edit"
            >
              <Edit className="h-4 w-4" />
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(false)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                aria-label="Cancel"
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className="h-8 w-8 p-0 text-[#1e4620] dark:text-[#3a8e3f] hover:text-[#1e4620] dark:hover:text-[#3a8e3f]"
                aria-label="Save"
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>{isEditing ? editForm : children}</CardContent>
    </Card>
  )
}
