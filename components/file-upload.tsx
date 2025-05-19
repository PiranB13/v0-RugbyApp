"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { X, FileText, ImageIcon, Film, Paperclip, Upload, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { compressImage, formatFileSize, calculateCompressionPercentage } from "@/lib/image-compression"
import {
  compressVideo,
  isVideoCompressionSupported,
  type VideoCompressionOptions,
  type CompressionProgress,
} from "@/lib/video-compression"
import { generateVideoThumbnails, type Thumbnail } from "@/lib/video-thumbnails"
import { VideoCompressionSettings } from "@/components/video-compression-settings"
import { VideoCompressionProgress } from "@/components/video-compression-progress"

interface FileUploadProps {
  onFileSelect: (files: File[]) => void
  onFileRemove: (index: number) => void
  onThumbnailGenerated?: (videoFile: File, thumbnail: Thumbnail) => void
  selectedFiles: File[]
  maxFiles?: number
  maxSize?: number // in MB
  allowedTypes?: string[]
  className?: string
}

interface FileWithMetadata extends File {
  originalSize?: number
  compressionSavings?: string
  thumbnail?: Thumbnail
}

interface VideoCompressionState {
  fileId: string
  file: File
  progress: CompressionProgress
  thumbnails?: Thumbnail[]
  selectedThumbnailIndex?: number
  result?: {
    originalSize: number
    compressedSize: number
    compressionSavings: string
    duration: number
  }
}

export function FileUpload({
  onFileSelect,
  onFileRemove,
  onThumbnailGenerated,
  selectedFiles,
  maxFiles = 5,
  maxSize = 10, // 10MB default
  allowedTypes = ["image/*", "application/pdf", "video/*", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx"],
  className,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [compressImages, setCompressImages] = useState(true)
  const [compressVideos, setCompressVideos] = useState(true)
  const [generateThumbnails, setGenerateThumbnails] = useState(true)
  const [compressionQuality, setCompressionQuality] = useState(0.8)
  const [processingFiles, setProcessingFiles] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const [videoCompressionOptions, setVideoCompressionOptions] = useState<VideoCompressionOptions>({
    maxWidth: 1280,
    maxHeight: 720,
    bitrate: 1000000, // 1 Mbps
    frameRate: 30,
  })
  const [videoCompressions, setVideoCompressions] = useState<VideoCompressionState[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoCompressionSupported = isVideoCompressionSupported()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`)
      return false
    }

    // Check file type
    const fileType = file.type
    if (
      !allowedTypes.some((type) => {
        if (type.includes("*")) {
          return fileType.startsWith(type.split("*")[0])
        }
        return fileType === type || file.name.endsWith(type)
      })
    ) {
      alert(`File ${file.name} has an unsupported format.`)
      return false
    }

    return true
  }

  const processFiles = async (files: FileList | null) => {
    if (!files) return

    const newFiles: FileWithMetadata[] = []
    const pendingVideoCompressions: VideoCompressionState[] = []

    // Check if adding these files would exceed the max files limit
    if (selectedFiles.length + files.length > maxFiles) {
      alert(`You can only upload a maximum of ${maxFiles} files.`)
      return
    }

    setProcessingFiles(true)

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      if (validateFile(file)) {
        // Start simulating upload progress
        simulateUploadProgress(file.name)

        try {
          // If it's an image and compression is enabled, compress it
          if (compressImages && file.type.startsWith("image/") && file.type !== "image/gif") {
            const originalSize = file.size
            const compressedFile = (await compressImage(file, 1920, compressionQuality)) as FileWithMetadata

            // Add metadata about compression
            compressedFile.originalSize = originalSize
            compressedFile.compressionSavings = calculateCompressionPercentage(originalSize, compressedFile.size)

            newFiles.push(compressedFile)
          }
          // If it's a video, handle compression and thumbnails
          else if (file.type.startsWith("video/")) {
            const fileId = `video-${Date.now()}-${i}`

            // Generate thumbnails regardless of compression setting
            let thumbnails: Thumbnail[] = []
            if (generateThumbnails) {
              try {
                thumbnails = await generateVideoThumbnails(file)
              } catch (error) {
                console.error(`Error generating thumbnails for ${file.name}:`, error)
              }
            }

            // If compression is enabled and supported, prepare for compression
            if (compressVideos && videoCompressionSupported) {
              pendingVideoCompressions.push({
                fileId,
                file,
                thumbnails,
                selectedThumbnailIndex: 0,
                progress: { stage: "analyzing", progress: 0 },
              })
            } else {
              // Just add thumbnails without compression
              const fileWithMeta = file as FileWithMetadata
              if (thumbnails.length > 0) {
                fileWithMeta.thumbnail = thumbnails[0]
                if (onThumbnailGenerated) {
                  onThumbnailGenerated(file, thumbnails[0])
                }
              }
              newFiles.push(fileWithMeta)
            }
          } else {
            newFiles.push(file as FileWithMetadata)
          }
        } catch (error) {
          console.error(`Error processing file ${file.name}:`, error)
          // If compression fails, use the original file
          newFiles.push(file as FileWithMetadata)
        }
      }
    }

    // Add the files to the selected files
    if (newFiles.length > 0) {
      onFileSelect([...selectedFiles, ...newFiles])
    }

    // Start video compressions
    if (pendingVideoCompressions.length > 0) {
      setVideoCompressions((prev) => [...prev, ...pendingVideoCompressions])
    } else {
      setProcessingFiles(false)
    }
  }

  // Handle thumbnail selection
  const handleThumbnailSelect = (compressionState: VideoCompressionState, thumbnail: Thumbnail, index: number) => {
    // Update the compression state with the selected thumbnail
    setVideoCompressions((prev) =>
      prev.map((vc) =>
        vc.fileId === compressionState.fileId
          ? {
              ...vc,
              selectedThumbnailIndex: index,
            }
          : vc,
      ),
    )

    // Find the file in selectedFiles and update its thumbnail
    const fileIndex = selectedFiles.findIndex((f) => f === compressionState.file)
    if (fileIndex !== -1) {
      const updatedFiles = [...selectedFiles]
      const fileWithMeta = updatedFiles[fileIndex] as FileWithMetadata
      fileWithMeta.thumbnail = thumbnail

      // Notify parent component about the thumbnail
      if (onThumbnailGenerated) {
        onThumbnailGenerated(compressionState.file, thumbnail)
      }

      onFileSelect(updatedFiles)
    }
  }

  // Process video compressions
  useEffect(() => {
    const processVideoCompressions = async () => {
      const pendingCompressions = videoCompressions.filter((vc) => vc.progress.stage !== "complete" && !vc.result)

      if (pendingCompressions.length === 0) {
        setProcessingFiles(false)
        return
      }

      // Process one video at a time to avoid overloading the browser
      const compression = pendingCompressions[0]

      try {
        // Compress the video
        const result = await compressVideo(compression.file, videoCompressionOptions, (progress) => {
          setVideoCompressions((prev) =>
            prev.map((vc) => (vc.fileId === compression.fileId ? { ...vc, progress } : vc)),
          )
        })

        // Generate thumbnails if not already generated
        let thumbnails = compression.thumbnails || []
        if (generateThumbnails && (!thumbnails || thumbnails.length === 0)) {
          try {
            thumbnails = await generateVideoThumbnails(result.file)
          } catch (error) {
            console.error(`Error generating thumbnails for ${compression.file.name}:`, error)
          }
        }

        // Update the compression result
        setVideoCompressions((prev) =>
          prev.map((vc) =>
            vc.fileId === compression.fileId
              ? {
                  ...vc,
                  thumbnails,
                  selectedThumbnailIndex: 0,
                  progress: { stage: "complete", progress: 100 },
                  result: {
                    originalSize: result.originalSize,
                    compressedSize: result.compressedSize,
                    compressionSavings: result.compressionSavings,
                    duration: result.duration,
                  },
                }
              : vc,
          ),
        )

        // Add thumbnail to the compressed file
        const compressedFile = result.file as FileWithMetadata
        if (thumbnails.length > 0) {
          compressedFile.thumbnail = thumbnails[0]

          // Notify parent component about the thumbnail
          if (onThumbnailGenerated) {
            onThumbnailGenerated(result.file, thumbnails[0])
          }
        }

        // Replace the original file with the compressed one
        onFileSelect(selectedFiles.map((f) => (f === compression.file ? compressedFile : f)))
      } catch (error) {
        console.error(`Error compressing video ${compression.file.name}:`, error)

        // Mark as complete with error
        setVideoCompressions((prev) =>
          prev.map((vc) =>
            vc.fileId === compression.fileId ? { ...vc, progress: { stage: "complete", progress: 100 } } : vc,
          ),
        )
      }

      // Continue processing other videos
      setProcessingFiles(pendingCompressions.length > 1)
    }

    if (videoCompressions.some((vc) => vc.progress.stage !== "complete")) {
      processVideoCompressions()
    }
  }, [
    videoCompressions,
    videoCompressionOptions,
    selectedFiles,
    onFileSelect,
    generateThumbnails,
    onThumbnailGenerated,
  ])

  const simulateUploadProgress = (fileName: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
      }
      setUploadProgress((prev) => ({ ...prev, [fileName]: progress }))
    }, 200)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    processFiles(e.dataTransfer.files)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const getFileIcon = (file: File) => {
    const fileType = file.type

    if (fileType.startsWith("image/")) {
      return <ImageIcon className="h-5 w-5 text-blue-500" />
    } else if (fileType.startsWith("video/")) {
      return <Film className="h-5 w-5 text-purple-500" />
    } else {
      return <FileText className="h-5 w-5 text-orange-500" />
    }
  }

  const getFilePreview = (file: File) => {
    const fileWithMeta = file as FileWithMetadata

    // If it's a video with a thumbnail, show the thumbnail
    if (file.type.startsWith("video/") && fileWithMeta.thumbnail) {
      return (
        <div className="relative w-12 h-12 rounded overflow-hidden bg-muted">
          <Image
            src={fileWithMeta.thumbnail.url || "/placeholder.svg"}
            alt={`Thumbnail for ${file.name}`}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Film className="h-5 w-5 text-white" />
          </div>
        </div>
      )
    }

    // If it's an image, show the image preview
    if (file.type.startsWith("image/")) {
      return (
        <div className="relative w-12 h-12 rounded overflow-hidden bg-muted">
          <Image src={URL.createObjectURL(file) || "/placeholder.svg"} alt={file.name} fill className="object-cover" />
        </div>
      )
    }

    // For other file types, show an icon
    return <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">{getFileIcon(file)}</div>
  }

  // Count file types
  const imageCount = selectedFiles.filter((file) => file.type.startsWith("image/")).length
  const videoCount = selectedFiles.filter((file) => file.type.startsWith("video/")).length
  const documentCount = selectedFiles.filter(
    (file) => !file.type.startsWith("image/") && !file.type.startsWith("video/"),
  ).length

  return (
    <div className={className}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="images" disabled={imageCount === 0}>
            Images {imageCount > 0 && `(${imageCount})`}
          </TabsTrigger>
          <TabsTrigger value="videos" disabled={videoCount === 0}>
            Videos {videoCount > 0 && `(${videoCount})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch id="compress-images" checked={compressImages} onCheckedChange={setCompressImages} />
                <Label htmlFor="compress-images" className="text-sm cursor-pointer">
                  Compress images
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Zap className="h-4 w-4 text-yellow-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reduces image file size while maintaining quality</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {compressImages && (
                <div className="flex items-center space-x-2">
                  <Label htmlFor="compression-quality" className="text-xs">
                    Quality: {Math.round(compressionQuality * 100)}%
                  </Label>
                  <Slider
                    id="compression-quality"
                    min={0.5}
                    max={1}
                    step={0.05}
                    value={[compressionQuality]}
                    onValueChange={(value) => setCompressionQuality(value[0])}
                    className="w-24"
                  />
                </div>
              )}
            </div>

            {videoCompressionSupported && (
              <>
                <div className="flex items-center space-x-2">
                  <Switch id="compress-videos" checked={compressVideos} onCheckedChange={setCompressVideos} />
                  <Label htmlFor="compress-videos" className="text-sm cursor-pointer">
                    Compress videos
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Zap className="h-4 w-4 text-yellow-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Reduces video file size for faster uploads</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="generate-thumbnails"
                    checked={generateThumbnails}
                    onCheckedChange={setGenerateThumbnails}
                  />
                  <Label htmlFor="generate-thumbnails" className="text-sm cursor-pointer">
                    Generate video thumbnails
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <ImageIcon className="h-4 w-4 text-blue-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Creates preview images from videos</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </>
            )}

            <div
              className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20"
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleChange}
                accept={allowedTypes.join(",")}
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center py-4">
                <Paperclip className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-center mb-1">
                  <span className="font-medium">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground text-center">
                  Supports images, videos, and documents (max {maxSize}MB)
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleButtonClick}
                  className="mt-3"
                  disabled={processingFiles}
                >
                  {processingFiles ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Select Files
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="images">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch id="compress-images-tab" checked={compressImages} onCheckedChange={setCompressImages} />
                <Label htmlFor="compress-images-tab" className="text-sm cursor-pointer">
                  Compress images
                </Label>
              </div>

              {compressImages && (
                <div className="flex items-center space-x-2">
                  <Label htmlFor="compression-quality-tab" className="text-xs">
                    Quality: {Math.round(compressionQuality * 100)}%
                  </Label>
                  <Slider
                    id="compression-quality-tab"
                    min={0.5}
                    max={1}
                    step={0.05}
                    value={[compressionQuality]}
                    onValueChange={(value) => setCompressionQuality(value[0])}
                    className="w-24"
                  />
                </div>
              )}
            </div>

            <div className="text-sm">
              <p>Image compression reduces file size while maintaining visual quality.</p>
              <p className="text-xs text-muted-foreground mt-1">
                Higher quality settings result in larger files but better image quality.
              </p>
            </div>

            {imageCount > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Image Files ({imageCount})</h4>
                <div className="space-y-2">
                  {selectedFiles
                    .filter((file) => file.type.startsWith("image/"))
                    .map((file, index) => {
                      const fileWithMeta = file as FileWithMetadata
                      const fileIndex = selectedFiles.indexOf(file)
                      return (
                        <div key={`${file.name}-${index}`} className="flex items-center bg-muted/30 rounded-lg p-2">
                          {getFilePreview(file)}

                          <div className="ml-3 flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <span>{formatFileSize(file.size)}</span>

                              {fileWithMeta.originalSize && fileWithMeta.compressionSavings && (
                                <div className="flex items-center ml-2 text-green-600">
                                  <Zap className="h-3 w-3 mr-1" />
                                  <span>Saved {fileWithMeta.compressionSavings}</span>
                                </div>
                              )}
                            </div>

                            {uploadProgress[file.name] !== undefined && uploadProgress[file.name] < 100 && (
                              <Progress value={uploadProgress[file.name]} className="h-1 mt-1" />
                            )}
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 ml-2"
                            onClick={() => onFileRemove(fileIndex)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    })}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="videos">
          <div className="space-y-4">
            {videoCompressionSupported ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch id="compress-videos-tab" checked={compressVideos} onCheckedChange={setCompressVideos} />
                    <Label htmlFor="compress-videos-tab" className="text-sm cursor-pointer">
                      Compress videos
                    </Label>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="generate-thumbnails-tab"
                    checked={generateThumbnails}
                    onCheckedChange={setGenerateThumbnails}
                  />
                  <Label htmlFor="generate-thumbnails-tab" className="text-sm cursor-pointer">
                    Generate video thumbnails
                  </Label>
                </div>

                {compressVideos && (
                  <VideoCompressionSettings
                    options={videoCompressionOptions}
                    onChange={setVideoCompressionOptions}
                    disabled={processingFiles}
                  />
                )}

                <div className="text-sm">
                  <p>Video compression reduces file size for faster uploads and sharing.</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Compression may take a few moments depending on the video size.
                  </p>
                </div>
              </>
            ) : (
              <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md">
                <p className="text-sm font-medium">Video compression is not supported in this browser.</p>
                <p className="text-xs mt-1">Try using Chrome, Edge, or Firefox for video compression features.</p>
              </div>
            )}

            {videoCount > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Video Files ({videoCount})</h4>
                <div className="space-y-2">
                  {videoCompressions.map((compression) => (
                    <VideoCompressionProgress
                      key={compression.fileId}
                      file={compression.file}
                      progress={compression.progress}
                      result={compression.result}
                      thumbnails={compression.thumbnails}
                      selectedThumbnailIndex={compression.selectedThumbnailIndex}
                      onThumbnailSelect={
                        compression.thumbnails && compression.thumbnails.length > 0
                          ? (thumbnail, index) => handleThumbnailSelect(compression, thumbnail, index)
                          : undefined
                      }
                    />
                  ))}

                  {selectedFiles
                    .filter((file) => file.type.startsWith("video/"))
                    .filter((file) => !videoCompressions.some((vc) => vc.file === file))
                    .map((file, index) => {
                      const fileIndex = selectedFiles.indexOf(file)
                      return (
                        <div key={`${file.name}-${index}`} className="flex items-center bg-muted/30 rounded-lg p-2">
                          {getFilePreview(file)}

                          <div className="ml-3 flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>

                            {uploadProgress[file.name] !== undefined && uploadProgress[file.name] < 100 && (
                              <Progress value={uploadProgress[file.name]} className="h-1 mt-1" />
                            )}
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 ml-2"
                            onClick={() => onFileRemove(fileIndex)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    })}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {selectedFiles.length > 0 && activeTab === "general" && (
        <div className="mt-4 space-y-3">
          <p className="text-sm font-medium">
            Selected Files ({selectedFiles.length}/{maxFiles})
          </p>

          <div className="space-y-2">
            {selectedFiles.map((file, index) => {
              const fileWithMeta = file as FileWithMetadata
              return (
                <div key={`${file.name}-${index}`} className="flex items-center bg-muted/30 rounded-lg p-2">
                  {getFilePreview(file)}

                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>{formatFileSize(file.size)}</span>

                      {fileWithMeta.originalSize && fileWithMeta.compressionSavings && (
                        <div className="flex items-center ml-2 text-green-600">
                          <Zap className="h-3 w-3 mr-1" />
                          <span>Saved {fileWithMeta.compressionSavings}</span>
                        </div>
                      )}
                    </div>

                    {uploadProgress[file.name] !== undefined && uploadProgress[file.name] < 100 && (
                      <Progress value={uploadProgress[file.name]} className="h-1 mt-1" />
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 ml-2"
                    onClick={() => onFileRemove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
