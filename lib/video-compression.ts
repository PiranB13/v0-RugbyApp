/**
 * Video compression utility for browser environments
 * Uses MediaRecorder API to compress videos client-side
 */

import { calculateCompressionPercentage } from "./image-compression"

export interface VideoCompressionOptions {
  maxWidth?: number
  maxHeight?: number
  bitrate?: number
  frameRate?: number
  mimeType?: string
  audioBitrate?: number
}

export interface CompressionProgress {
  stage: "analyzing" | "compressing" | "finalizing" | "complete"
  progress: number
}

export interface CompressionResult {
  file: File
  originalSize: number
  compressedSize: number
  compressionSavings: string
  width: number
  height: number
  duration: number
}

const DEFAULT_OPTIONS: VideoCompressionOptions = {
  maxWidth: 1280,
  maxHeight: 720,
  bitrate: 1000000, // 1 Mbps
  frameRate: 30,
  mimeType: "video/mp4",
  audioBitrate: 128000, // 128 kbps
}

/**
 * Check if the browser supports the required APIs for video compression
 */
export function isVideoCompressionSupported(): boolean {
  return (
    typeof MediaRecorder !== "undefined" &&
    typeof HTMLVideoElement !== "undefined" &&
    typeof HTMLCanvasElement !== "undefined"
  )
}

/**
 * Get supported MIME types for video compression
 */
export function getSupportedVideoMimeTypes(): string[] {
  if (!isVideoCompressionSupported()) return []

  const types = [
    "video/webm",
    "video/webm;codecs=vp8",
    "video/webm;codecs=vp9",
    "video/webm;codecs=h264",
    "video/mp4",
    "video/mp4;codecs=h264",
    "video/x-matroska",
  ]

  return types.filter((type) => MediaRecorder.isTypeSupported(type))
}

/**
 * Get the best supported MIME type for video compression
 */
export function getBestSupportedVideoMimeType(): string {
  const types = getSupportedVideoMimeTypes()
  if (types.includes("video/mp4;codecs=h264")) return "video/mp4;codecs=h264"
  if (types.includes("video/mp4")) return "video/mp4"
  if (types.includes("video/webm;codecs=h264")) return "video/webm;codecs=h264"
  if (types.includes("video/webm;codecs=vp9")) return "video/webm;codecs=vp9"
  if (types.includes("video/webm;codecs=vp8")) return "video/webm;codecs=vp8"
  if (types.includes("video/webm")) return "video/webm"
  return ""
}

/**
 * Compress a video file
 * @param file The video file to compress
 * @param options Compression options
 * @param onProgress Progress callback
 * @returns Promise with the compressed file
 */
export async function compressVideo(
  file: File,
  options: VideoCompressionOptions = {},
  onProgress?: (progress: CompressionProgress) => void,
): Promise<CompressionResult> {
  // Check if compression is supported
  if (!isVideoCompressionSupported()) {
    throw new Error("Video compression is not supported in this browser")
  }

  // Merge options with defaults
  const settings = { ...DEFAULT_OPTIONS, ...options }

  // Use the best supported MIME type if not specified
  if (!settings.mimeType || !MediaRecorder.isTypeSupported(settings.mimeType)) {
    settings.mimeType = getBestSupportedVideoMimeType()
    if (!settings.mimeType) {
      throw new Error("No supported video MIME type found")
    }
  }

  // Create a URL for the video file
  const videoURL = URL.createObjectURL(file)

  // Update progress
  if (onProgress) {
    onProgress({ stage: "analyzing", progress: 0 })
  }

  // Get video metadata
  const videoMetadata = await getVideoMetadata(videoURL)

  // Update progress
  if (onProgress) {
    onProgress({ stage: "analyzing", progress: 100 })
    onProgress({ stage: "compressing", progress: 0 })
  }

  // Calculate target dimensions
  const { width, height } = calculateTargetDimensions(
    videoMetadata.width,
    videoMetadata.height,
    settings.maxWidth!,
    settings.maxHeight!,
  )

  // Compress the video
  const compressedBlob = await transcodeVideo(videoURL, {
    ...settings,
    width,
    height,
    duration: videoMetadata.duration,
    onProgress: (progress) => {
      if (onProgress) {
        onProgress({ stage: "compressing", progress })
      }
    },
  })

  // Clean up
  URL.revokeObjectURL(videoURL)

  // Update progress
  if (onProgress) {
    onProgress({ stage: "finalizing", progress: 100 })
  }

  // Create a new file from the blob
  const compressedFile = new File([compressedBlob], file.name, {
    type: compressedBlob.type,
    lastModified: Date.now(),
  })

  // Calculate compression savings
  const originalSize = file.size
  const compressedSize = compressedFile.size
  const compressionSavings = calculateCompressionPercentage(originalSize, compressedSize)

  // Update progress
  if (onProgress) {
    onProgress({ stage: "complete", progress: 100 })
  }

  return {
    file: compressedFile,
    originalSize,
    compressedSize,
    compressionSavings,
    width,
    height,
    duration: videoMetadata.duration,
  }
}

/**
 * Get video metadata (width, height, duration)
 * @param videoURL URL of the video
 * @returns Promise with video metadata
 */
async function getVideoMetadata(videoURL: string): Promise<{ width: number; height: number; duration: number }> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video")
    video.preload = "metadata"
    video.muted = true

    video.onloadedmetadata = () => {
      resolve({
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration,
      })
      video.remove()
    }

    video.onerror = () => {
      reject(new Error("Failed to load video metadata"))
      video.remove()
    }

    video.src = videoURL
  })
}

/**
 * Calculate target dimensions while maintaining aspect ratio
 */
function calculateTargetDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number,
): { width: number; height: number } {
  let width = originalWidth
  let height = originalHeight

  // Scale down if width exceeds maxWidth
  if (width > maxWidth) {
    height = Math.round((height * maxWidth) / width)
    width = maxWidth
  }

  // Scale down if height still exceeds maxHeight
  if (height > maxHeight) {
    width = Math.round((width * maxHeight) / height)
    height = maxHeight
  }

  // Ensure dimensions are even (required by some codecs)
  width = Math.floor(width / 2) * 2
  height = Math.floor(height / 2) * 2

  return { width, height }
}

/**
 * Transcode a video to a compressed format
 */
async function transcodeVideo(
  videoURL: string,
  options: {
    width: number
    height: number
    duration: number
    bitrate: number
    frameRate: number
    mimeType: string
    audioBitrate: number
    onProgress?: (progress: number) => void
  },
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const { width, height, duration, bitrate, frameRate, mimeType, audioBitrate, onProgress } = options

    // Create video element to decode the original video
    const video = document.createElement("video")
    video.muted = true
    video.playsInline = true
    video.src = videoURL

    // Create canvas for drawing video frames
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d", { alpha: false })
    if (!ctx) {
      reject(new Error("Failed to get canvas context"))
      return
    }

    // Create MediaRecorder to encode the compressed video
    const stream = canvas.captureStream(frameRate)
    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: bitrate,
      audioBitsPerSecond: audioBitrate,
    })

    const chunks: Blob[] = []
    let startTime: number
    let frameCount = 0

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data)
      }
    }

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType.split(";")[0] })
      resolve(blob)
      video.remove()
      canvas.remove()
    }

    recorder.onerror = (e) => {
      reject(e.error)
      video.remove()
      canvas.remove()
    }

    // Start recording when video can play
    video.oncanplay = () => {
      video
        .play()
        .then(() => {
          recorder.start(1000) // Collect data in 1-second chunks
          startTime = performance.now()
          drawFrame()
        })
        .catch(reject)
    }

    // Draw frames to canvas
    function drawFrame() {
      if (video.ended || video.paused) {
        recorder.stop()
        return
      }

      ctx.drawImage(video, 0, 0, width, height)
      frameCount++

      // Calculate and report progress
      if (onProgress && duration) {
        const progress = Math.min(100, Math.round((video.currentTime / duration) * 100))
        onProgress(progress)
      }

      // Request next frame
      requestAnimationFrame(drawFrame)
    }

    // Handle errors
    video.onerror = () => {
      reject(new Error("Video loading failed"))
      video.remove()
      canvas.remove()
    }
  })
}

/**
 * Format duration in seconds to MM:SS format
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

/**
 * Get video compression quality presets
 */
export function getVideoQualityPresets(): { label: string; options: VideoCompressionOptions }[] {
  return [
    {
      label: "High (720p)",
      options: {
        maxWidth: 1280,
        maxHeight: 720,
        bitrate: 2500000, // 2.5 Mbps
        frameRate: 30,
      },
    },
    {
      label: "Medium (480p)",
      options: {
        maxWidth: 854,
        maxHeight: 480,
        bitrate: 1000000, // 1 Mbps
        frameRate: 30,
      },
    },
    {
      label: "Low (360p)",
      options: {
        maxWidth: 640,
        maxHeight: 360,
        bitrate: 600000, // 600 Kbps
        frameRate: 24,
      },
    },
  ]
}
