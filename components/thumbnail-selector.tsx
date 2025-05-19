"use client"

import { useState } from "react"
import Image from "next/image"
import { Check, Clock } from "lucide-react"
import { formatTimeOffset } from "@/lib/video-thumbnails"
import type { Thumbnail } from "@/lib/video-thumbnails"

interface ThumbnailSelectorProps {
  thumbnails: Thumbnail[]
  onSelect: (thumbnail: Thumbnail) => void
  selectedIndex?: number
}

export function ThumbnailSelector({ thumbnails, onSelect, selectedIndex = 0 }: ThumbnailSelectorProps) {
  const [selected, setSelected] = useState(selectedIndex)

  const handleSelect = (index: number) => {
    setSelected(index)
    onSelect(thumbnails[index])
  }

  if (!thumbnails.length) {
    return null
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Select a thumbnail:</p>
      <div className="grid grid-cols-5 gap-2">
        {thumbnails.map((thumbnail, index) => (
          <div
            key={index}
            className={`relative rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
              selected === index ? "border-primary ring-2 ring-primary/20" : "border-transparent hover:border-gray-300"
            }`}
            onClick={() => handleSelect(index)}
          >
            <div className="relative aspect-video">
              <Image
                src={thumbnail.url || "/placeholder.svg"}
                alt={`Thumbnail at ${formatTimeOffset(thumbnail.timeOffset)}`}
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-1 py-0.5 flex items-center justify-center">
              <Clock className="h-3 w-3 mr-1" />
              {formatTimeOffset(thumbnail.timeOffset)}
            </div>
            {selected === index && (
              <div className="absolute top-1 right-1 bg-primary rounded-full p-0.5">
                <Check className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
