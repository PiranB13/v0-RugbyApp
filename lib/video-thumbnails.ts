/**
 * Video thumbnail generation utility
 * Extracts frames from videos to create thumbnails
 */

export interface ThumbnailOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: "image/jpeg" | "image/png" | "image/webp"
}

export interface Thumbnail {
  url: string
  blob: Blob
  width: number
  height: number
  timeOffset: number
}

const DEFAULT_OPTIONS: ThumbnailOptions = {
  maxWidth: 320,
  maxHeight: 180,
  quality: 0.7,
  format: "image/jpeg",
}

/**
 * Generate thumbnails from a video file
 * @param videoFile The video file
 * @param timeOffsets Array of time offsets in seconds to capture frames
 * @param options Thumbnail generation options
 * @returns Promise with array of thumbnails
 */
export async function generateVideoThumbnails(
  videoFile: File,
  timeOffsets: number[] = [0],
  options: ThumbnailOptions = {},
): Promise<Thumbnail[]> {
  // Merge options with defaults
  const settings = { ...DEFAULT_OPTIONS, ...options }

  // Create a URL for the video file
  const videoURL = URL.createObjectURL(videoFile)

  try {
    // Get video metadata
    const { width, height, duration } = await getVideoMetadata(videoURL)

    // If no specific timeOffsets provided, generate frames at start, 25%, 50%, 75%, and near end
    if (timeOffsets.length === 1 && timeOffsets[0] === 0) {
      timeOffsets = [
        0, // Start
        duration * 0.25, // 25%
        duration * 0.5, // Middle
        duration * 0.75, // 75%
        Math.max(0, duration - 0.5), // Near end (0.5 seconds before end)
      ]
    }

    // Generate thumbnails for each time offset
    const thumbnails = await Promise.all(
      timeOffsets.map(async (timeOffset) => {
        // Ensure timeOffset is within video duration
        const validTimeOffset = Math.min(Math.max(0, timeOffset), duration - 0.1)

        // Extract frame at the specified time offset
        const {
          blob,
          width: thumbWidth,
          height: thumbHeight,
        } = await extractVideoFrame(videoURL, validTimeOffset, width, height, settings)

        // Create a URL for the thumbnail
        const url = URL.createObjectURL(blob)

        return {
          url,
          blob,
          width: thumbWidth,
          height: thumbHeight,
          timeOffset: validTimeOffset,
        }
      }),
    )

    return thumbnails
  } finally {
    // Clean up the video URL
    URL.revokeObjectURL(videoURL)
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
 * Extract a frame from a video at a specific time offset
 * @param videoURL URL of the video
 * @param timeOffset Time offset in seconds
 * @param videoWidth Original video width
 * @param videoHeight Original video height
 * @param options Thumbnail options
 * @returns Promise with the extracted frame as a Blob
 */
async function extractVideoFrame(
  videoURL: string,
  timeOffset: number,
  videoWidth: number,
  videoHeight: number,
  options: Required<ThumbnailOptions>,
): Promise<{ blob: Blob; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video")
    video.muted = true
    video.preload = "auto"

    video.onseeked = () => {
      // Calculate dimensions while maintaining aspect ratio
      const { width, height } = calculateThumbnailDimensions(
        videoWidth,
        videoHeight,
        options.maxWidth,
        options.maxHeight,
      )

      // Create canvas and draw the video frame
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        reject(new Error("Failed to get canvas context"))
        video.remove()
        return
      }

      // Draw the video frame on the canvas
      ctx.drawImage(video, 0, 0, width, height)

      // Convert canvas to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve({ blob, width, height })
          } else {
            reject(new Error("Failed to create thumbnail"))
          }
          video.remove()
          canvas.remove()
        },
        options.format,
        options.quality,
      )
    }

    video.onerror = () => {
      reject(new Error("Failed to load video"))
      video.remove()
    }

    // Set the video source and seek to the specified time
    video.src = videoURL
    video.currentTime = timeOffset
  })
}

/**
 * Calculate thumbnail dimensions while maintaining aspect ratio
 * @param originalWidth Original width
 * @param originalHeight Original height
 * @param maxWidth Maximum width
 * @param maxHeight Maximum height
 * @returns Calculated dimensions
 */
function calculateThumbnailDimensions(
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
 * Format time in seconds to MM:SS format
 * @param seconds Time in seconds
 * @returns Formatted time string
 */
export function formatTimeOffset(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

/**
 * Create a thumbnail filename
 * @param videoFilename Original video filename
 * @param timeOffset Time offset in seconds
 * @returns Thumbnail filename
 */
export function createThumbnailFilename(videoFilename: string, timeOffset: number): string {
  const baseName = videoFilename.substring(0, videoFilename.lastIndexOf("."))
  const timeString = formatTimeOffset(timeOffset).replace(":", "-")
  return `${baseName}-thumbnail-${timeString}.jpg`
}
