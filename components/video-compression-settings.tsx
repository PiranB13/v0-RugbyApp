"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Settings, Info } from "lucide-react"
import {
  getVideoQualityPresets,
  isVideoCompressionSupported,
  type VideoCompressionOptions,
} from "@/lib/video-compression"

interface VideoCompressionSettingsProps {
  options: VideoCompressionOptions
  onChange: (options: VideoCompressionOptions) => void
  disabled?: boolean
}

export function VideoCompressionSettings({ options, onChange, disabled = false }: VideoCompressionSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const presets = getVideoQualityPresets()
  const isSupported = isVideoCompressionSupported()

  // Find which preset matches current options, or use "custom"
  const getCurrentPreset = (): string => {
    const preset = presets.findIndex(
      (p) =>
        p.options.maxWidth === options.maxWidth &&
        p.options.maxHeight === options.maxHeight &&
        p.options.bitrate === options.bitrate &&
        p.options.frameRate === options.frameRate,
    )
    return preset >= 0 ? preset.toString() : "custom"
  }

  const [selectedPreset, setSelectedPreset] = useState<string>(getCurrentPreset())

  const handlePresetChange = (value: string) => {
    setSelectedPreset(value)

    if (value !== "custom") {
      const presetIndex = Number.parseInt(value)
      onChange({
        ...options,
        ...presets[presetIndex].options,
      })
    }
  }

  const handleBitrateChange = (value: number[]) => {
    setSelectedPreset("custom")
    onChange({
      ...options,
      bitrate: value[0] * 100000, // Convert slider value to bps
    })
  }

  const handleFrameRateChange = (value: number[]) => {
    setSelectedPreset("custom")
    onChange({
      ...options,
      frameRate: value[0],
    })
  }

  if (!isSupported) {
    return <div className="text-sm text-muted-foreground">Video compression is not supported in this browser.</div>
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Video Quality</Label>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 px-2">
              <Settings className="h-4 w-4 mr-1" />
              <span>Settings</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium">Video Compression Settings</h4>

              <div className="space-y-2">
                <Label className="text-sm">Quality Preset</Label>
                <RadioGroup
                  value={selectedPreset}
                  onValueChange={handlePresetChange}
                  className="flex flex-col space-y-1"
                  disabled={disabled}
                >
                  {presets.map((preset, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={index.toString()} id={`preset-${index}`} />
                      <Label htmlFor={`preset-${index}`} className="text-sm font-normal">
                        {preset.label}
                      </Label>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="preset-custom" />
                    <Label htmlFor="preset-custom" className="text-sm font-normal">
                      Custom
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Bitrate: {(options.bitrate! / 1000000).toFixed(1)} Mbps</Label>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Info className="h-3 w-3 mr-1" />
                    <span>Higher = better quality, larger file</span>
                  </div>
                </div>
                <Slider
                  value={[options.bitrate! / 100000]}
                  min={1}
                  max={50}
                  step={1}
                  onValueChange={handleBitrateChange}
                  disabled={disabled || selectedPreset !== "custom"}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Frame Rate: {options.frameRate} fps</Label>
                <Slider
                  value={[options.frameRate!]}
                  min={15}
                  max={60}
                  step={1}
                  onValueChange={handleFrameRateChange}
                  disabled={disabled || selectedPreset !== "custom"}
                />
              </div>

              <div className="text-xs text-muted-foreground">
                <p>
                  Resolution: {options.maxWidth}×{options.maxHeight}
                </p>
                <p className="mt-1">
                  Compression reduces file size while maintaining reasonable quality. Higher quality settings result in
                  larger files.
                </p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
