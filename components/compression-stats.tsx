import { Zap, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { formatFileSize } from "@/lib/image-compression"

interface CompressionStatsProps {
  originalSize: number
  compressedSize: number
  className?: string
}

export function CompressionStats({ originalSize, compressedSize, className }: CompressionStatsProps) {
  const bytesSaved = originalSize - compressedSize
  const percentageSaved = ((bytesSaved / originalSize) * 100).toFixed(1)

  // Only show if we actually saved space
  if (bytesSaved <= 0) return null

  return (
    <div className={`flex items-center text-xs text-green-600 ${className}`}>
      <Zap className="h-3 w-3 mr-1" />
      <span>
        Saved {percentageSaved}% ({formatFileSize(bytesSaved)})
      </span>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="ml-1">
              <Info className="h-3 w-3 text-muted-foreground" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Original: {formatFileSize(originalSize)}</p>
            <p>Compressed: {formatFileSize(compressedSize)}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
