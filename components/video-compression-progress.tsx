"use client"

import { useState, useEffect } from "react"
import { Film, Zap, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { formatFileSize } from "@/lib/image-compression"
import { formatDuration } from "@/lib/video-compression"
import { ThumbnailSelector } from "@/components/thumbnail-selector"
import type { CompressionProgress } from "@/lib/video-compression"
import type { Thumbnail } from "@/lib/video-thumbnails"

interface VideoCompressionProgressProps {
  file: File
  progress: CompressionProgress
  result?: {
    originalSize: number
    compressedSize: number
    compressionSavings: string
    duration: number
  }
  thumbnails?: Thumbnail[]
  onThumbnailSelect?: (thumbnail: Thumbnail) => void
  selectedThumbnailIndex?: number
}

export function VideoCompressionProgress({
  file,
  progress,
  result,
  thumbnails,
  onThumbnailSelect,
  selectedThumbnailIndex = 0,
}: VideoCompressionProgressProps) {
  const [expanded, setExpanded] = useState(false)

  // Auto-expand when thumbnails are available
  useEffect(() => {
    if (thumbnails && thumbnails.length > 0) {
      setExpanded(true)
    }
  }, [thumbnails])

  const getStageLabel = () => {
    switch (progress.stage) {
      case "analyzing":
        return "Analyzing video..."
      case "compressing":
        return "Compressing video..."
      case "finalizing":
        return "Finalizing..."
      case "complete":
        return "Compression complete"
      default:
        return "Processing..."
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex items-center p-3">
        <div className="w-10 h-10 bg-muted rounded flex items-center justify-center mr-3">
          <Film className="h-5 w-5 text-purple-500" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file.name}</p>
          <div className="flex items-center text-xs text-muted-foreground">
            <span>{formatFileSize(file.size)}</span>
            {result && (
              <div className="flex items-center ml-2 text-green-600">
                <Zap className="h-3 w-3 mr-1" />
                <span>Saved {result.compressionSavings}</span>
              </div>
            )}
            {result?.duration && (
              <div className="flex items-center ml-2">
                <Clock className="h-3 w-3 mr-1" />
                <span>{formatDuration(result.duration)}</span>
              </div>
            )}
          </div>

          {progress.stage !== "complete" && (
            <div className="mt-1">
              <p className="text-xs text-muted-foreground">{getStageLabel()}</p>
              <Progress value={progress.progress} className="h-1 mt-1" />
            </div>
          )}
        </div>

        {progress.stage === "complete" && thumbnails && thumbnails.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)} className="ml-2 text-xs">
            {expanded ? "Hide" : "Show"} Thumbnails
          </Button>
        )}
      </div>

      {expanded && thumbnails && thumbnails.length > 0 && onThumbnailSelect && (
        <div className="p-3 border-t">
          <ThumbnailSelector
            thumbnails={thumbnails}
            onSelect={onThumbnailSelect}
            selectedIndex={selectedThumbnailIndex}
          />
        </div>
      )}
    </div>
  )
}
