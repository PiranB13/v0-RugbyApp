"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/file-upload"
import { MessageAttachments } from "@/components/message-attachment"
import { TemplateSelector } from "@/components/template-selector"
import { TemplateVariableForm } from "@/components/template-variable-form"
import type { MessageTemplate } from "@/types/message-template"
import { v4 as uuidv4 } from "uuid"
import type { Attachment } from "@/types/message"
import { FileText, X } from "lucide-react"

interface ComposeMessageModalProps {
  isOpen: boolean
  onClose: () => void
  recipient: {
    id: string
    name: string
    profileImage: string
    type: "player" | "club"
  }
  onSend: (message: {
    content: string
    attachments?: Attachment[]
  }) => void
}

export function ComposeMessageModal({ isOpen, onClose, recipient, onSend }: ComposeMessageModalProps) {
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null)
  const [showTemplateVariableForm, setShowTemplateVariableForm] = useState(false)
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({})
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Pre-fill some template variables based on recipient
  useEffect(() => {
    if (recipient) {
      setTemplateVariables({
        playerName: recipient.type === "player" ? recipient.name : "",
        clubName: recipient.type === "club" ? recipient.name : "",
        // Add more default values as needed
      })
    }
  }, [recipient])

  const handleSend = async () => {
    if (!message.trim() && selectedFiles.length === 0) return

    setIsSending(true)

    // Convert File objects to Attachment objects
    const attachments: Attachment[] = selectedFiles.map((file) => ({
      id: uuidv4(),
      type: file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "document",
      url: URL.createObjectURL(file), // In a real app, you'd upload to a server and get a URL
      name: file.name,
      size: file.size,
      file: file, // Keep reference to the file
    }))

    // In a real app, you'd upload the files to a server here
    // For now, we'll just simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onSend({
      content: message,
      attachments: attachments.length > 0 ? attachments : undefined,
    })

    // Reset form
    setMessage("")
    setSelectedFiles([])
    setIsSending(false)
    setSelectedTemplate(null)
    setShowTemplateVariableForm(false)
    onClose()
  }

  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(files)
  }

  const handleFileRemove = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleTemplateSelect = (template: MessageTemplate) => {
    setSelectedTemplate(template)
    setShowTemplateVariableForm(true)
  }

  const handleTemplateComplete = (processedContent: string, variables: Record<string, string>) => {
    setMessage(processedContent)
    setTemplateVariables(variables)
    setShowTemplateVariableForm(false)
  }

  const handleCancelTemplate = () => {
    setShowTemplateVariableForm(false)
    setSelectedTemplate(null)
  }

  const clearTemplate = () => {
    setMessage("")
    setSelectedTemplate(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Message to {recipient.name}</DialogTitle>
        </DialogHeader>

        {showTemplateVariableForm && selectedTemplate ? (
          <TemplateVariableForm
            template={selectedTemplate}
            onComplete={handleTemplateComplete}
            onCancel={handleCancelTemplate}
            initialValues={templateVariables}
          />
        ) : (
          <div className="space-y-4 py-4">
            {selectedTemplate ? (
              <div className="mb-2 flex items-center justify-between rounded-md border border-muted bg-muted/50 p-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{selectedTemplate.title}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={clearTemplate}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <TemplateSelector
                onSelectTemplate={handleTemplateSelect}
                category={recipient.type === "player" ? "recruitment" : "general"}
              />
            )}

            <Textarea
              ref={textareaRef}
              placeholder={`Write your message to ${recipient.name}...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px]"
            />

            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <MessageAttachments
                  attachments={selectedFiles.map((file, index) => ({
                    id: `preview-${index}`,
                    type: file.type.startsWith("image/")
                      ? "image"
                      : file.type.startsWith("video/")
                        ? "video"
                        : "document",
                    url: "",
                    name: file.name,
                    size: file.size,
                    file: file,
                  }))}
                  onRemove={handleFileRemove}
                  isPreview={true}
                />
              </div>
            )}

            <FileUpload onFileSelect={handleFileSelect} onFileRemove={handleFileRemove} selectedFiles={selectedFiles} />
          </div>
        )}

        {!showTemplateVariableForm && (
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSend} disabled={isSending || (!message.trim() && selectedFiles.length === 0)}>
              {isSending ? "Sending..." : "Send Message"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
