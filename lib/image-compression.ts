/**
 * Compresses an image file using canvas and returns a new Blob
 * @param file The image file to compress
 * @param maxWidthOrHeight Maximum width or height of the compressed image
 * @param quality Compression quality (0 to 1)
 * @returns Promise with the compressed file
 */
export async function compressImage(file: File, maxWidthOrHeight = 1920, quality = 0.8): Promise<File> {
  // If it's not an image, return the original file
  if (!file.type.startsWith("image/")) {
    return file
  }

  // Skip compression for small images or GIFs (which can't be reliably compressed this way)
  if (file.size < 150 * 1024 || file.type === "image/gif") {
    return file
  }

  return new Promise((resolve, reject) => {
    const image = new Image()
    image.src = URL.createObjectURL(file)
    image.crossOrigin = "anonymous" // Avoid CORS issues with canvas

    image.onload = () => {
      // Release the object URL
      URL.revokeObjectURL(image.src)

      // Calculate new dimensions while maintaining aspect ratio
      let width = image.width
      let height = image.height

      if (width > height) {
        if (width > maxWidthOrHeight) {
          height = Math.round((height * maxWidthOrHeight) / width)
          width = maxWidthOrHeight
        }
      } else {
        if (height > maxWidthOrHeight) {
          width = Math.round((width * maxWidthOrHeight) / height)
          height = maxWidthOrHeight
        }
      }

      // Create canvas and draw image
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Could not get canvas context"))
        return
      }

      ctx.drawImage(image, 0, 0, width, height)

      // Get the file extension and mime type
      const mimeType = file.type

      // Convert canvas to blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas to Blob conversion failed"))
            return
          }

          // Create a new file from the blob
          const compressedFile = new File([blob], file.name, { type: mimeType, lastModified: Date.now() })

          resolve(compressedFile)
        },
        mimeType,
        quality,
      )
    }

    image.onerror = () => {
      URL.revokeObjectURL(image.src)
      reject(new Error("Error loading image"))
    }
  })
}

/**
 * Batch compress multiple image files
 * @param files Array of files to compress
 * @param maxWidthOrHeight Maximum width or height
 * @param quality Compression quality
 * @returns Promise with array of compressed files
 */
export async function compressImages(files: File[], maxWidthOrHeight = 1920, quality = 0.8): Promise<File[]> {
  const compressPromises = files.map((file) =>
    file.type.startsWith("image/") ? compressImage(file, maxWidthOrHeight, quality) : Promise.resolve(file),
  )

  return Promise.all(compressPromises)
}

/**
 * Format file size in a human-readable format
 * @param bytes File size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

/**
 * Calculate compression percentage
 * @param originalSize Original file size in bytes
 * @param compressedSize Compressed file size in bytes
 * @returns Percentage saved as a string
 */
export function calculateCompressionPercentage(originalSize: number, compressedSize: number): string {
  if (originalSize === 0) return "0%"

  const percentageSaved = ((originalSize - compressedSize) / originalSize) * 100
  return `${Math.round(percentageSaved)}%`
}
