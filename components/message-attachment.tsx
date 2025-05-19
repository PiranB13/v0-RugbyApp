"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { FileText, Download, ImageIcon, Film, X, Eye, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { formatFileSize } from "@/lib/image-compression"
import { formatDuration } from "@/lib/video-compression"
import type { Attachment } from "@/types/message"

interface MessageAttachmentProps {
  attachment: Attachment
  onRemove?: () => void
  isPreview?: boolean
}

export function MessageAttachment({ attachment, onRemove, isPreview = false }: MessageAttachmentProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [videoDuration, setVideoDuration] = useState<number | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const getAttachmentIcon = () => {
    switch (attachment.type) {
      case "image":
        return <ImageIcon className="h-5 w-5 text-blue-500" />
      case "video":
        return <Film className="h-5 w-5 text-purple-500" />
      case "document":
      default:
        return <FileText className="h-5 w-5 text-orange-500" />
    }
  }

  const handleVideoLoad = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget
    setVideoDuration(video.duration)
  }

  const handleVideoPlay = () => {
    setIsVideoPlaying(true)
  }

  const handleVideoPause = () => {
    setIsVideoPlaying(false)
  }

  const getAttachmentPreview = () => {
    if (attachment.type === "image") {
      return (
        <div className="relative w-full h-32 rounded overflow-hidden bg-muted">
          <Image
            src={attachment.url || (attachment.file ? URL.createObjectURL(attachment.file) : "/placeholder.svg")}
            alt={attachment.name}
            fill
            className="object-contain"
          />
        </div>
      )
    } else if (attachment.type === "video") {
      // If we have a thumbnail, use it instead of loading the video
      if (attachment.thumbnailUrl) {
        return (
          <div className="relative w-full h-32 rounded overflow-hidden bg-black group">
            <Image
              src={attachment.thumbnailUrl || "/placeholder.svg"}
              alt={`Thumbnail for ${attachment.name}`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:bg-black/60 transition-colors">
              <Play className="h-10 w-10 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
            {attachment.duration && (
              <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                {formatDuration(attachment.duration)}
              </div>
            )}
          </div>
        )
      }

      // Fallback to video element if no thumbnail
      return (
        <div className="relative w-full h-32 rounded overflow-hidden bg-black group">
          <video
            src={attachment.url || (attachment.file ? URL.createObjectURL(attachment.file) : "")}
            className="w-full h-full object-contain"
            preload="metadata"
            onLoadedMetadata={handleVideoLoad}
            onPlay={handleVideoPlay}
            onPause={handleVideoPause}
          />
          {!isVideoPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:bg-black/60 transition-colors">
              <Play className="h-10 w-10 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
          {videoDuration && (
            <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
              {formatDuration(videoDuration)}
            </div>
          )}
        </div>
      )
    }

    return <div className="w-full h-32 rounded bg-muted flex items-center justify-center">{getAttachmentIcon()}</div>
  }

  const handleDownload = () => {
    if (attachment.url) {
      const link = document.createElement("a")
      link.href = attachment.url
      link.download = attachment.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="relative flex flex-col border rounded-md overflow-hidden">
      {attachment.type === "image" ? (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="text-left">{getAttachmentPreview()}</button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] p-0 overflow-hidden">
            <div className="relative w-full h-[80vh]">
              <Image
                src={attachment.url || (attachment.file ? URL.createObjectURL(attachment.file) : "/placeholder.svg")}
                alt={attachment.name}
                fill
                className="object-contain"
              />
            </div>
            <div className="p-4 bg-background flex items-center justify-between">
              <div>
                <p className="font-medium">{attachment.name}</p>
                {attachment.size && <p className="text-sm text-muted-foreground">{formatFileSize(attachment.size)}</p>}
              </div>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      ) : attachment.type === "video" ? (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="text-left">{getAttachmentPreview()}</button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] p-0 overflow-hidden">
            <div className="relative w-full h-[80vh] bg-black flex items-center justify-center">
              <video
                src={attachment.url || (attachment.file ? URL.createObjectURL(attachment.file) : "")}
                controls
                autoPlay
                className="max-w-full max-h-full"
                onLoadedMetadata={handleVideoLoad}
              />
            </div>
            <div className="p-4 bg-background flex items-center justify-between">
              <div>
                <p className="font-medium">{attachment.name}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>{formatFileSize(attachment.size || 0)}</span>
                  {(videoDuration || attachment.duration) && (
                    <>
                      <span className="mx-1">•</span>
                      <span>{formatDuration(videoDuration || attachment.duration || 0)}</span>
                    </>
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        getAttachmentPreview()
      )}

      <div className="p-2 flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">{attachment.name}</p>
          {attachment.size && <p className="text-xs text-muted-foreground">{formatFileSize(attachment.size)}</p>}
        </div>

        <div className="flex items-center space-x-1">
          {(attachment.type === "image" || attachment.type === "video") && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsDialogOpen(true)}>
              <Eye className="h-4 w-4" />
            </Button>
          )}

          {attachment.url && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
          )}

          {isPreview && onRemove && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onRemove}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

interface MessageAttachmentsProps {
  attachments: Attachment[]
  onRemove?: (index: number) => void
  isPreview?: boolean
}

export function MessageAttachments({ attachments, onRemove, isPreview = false }: MessageAttachmentsProps) {
  if (!attachments || attachments.length === 0) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
      {attachments.map((attachment, index) => (
        <MessageAttachment
          key={attachment.id || index}
          attachment={attachment}
          onRemove={onRemove ? () => onRemove(index) : undefined}
          isPreview={isPreview}
        />
      ))}
    </div>
  )
}
