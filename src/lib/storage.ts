/**
 * Compress an image file to reduce its size
 * Returns a compressed base64 data URL
 */
export async function compressImage(file: File, maxWidth: number = 1920, maxHeight: number = 1080, quality: number = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width
        let height = img.height
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = width * ratio
          height = height * ratio
        }
        
        // Create canvas and compress
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Failed to get canvas context'))
          return
        }
        
        ctx.drawImage(img, 0, 0, width, height)
        
        // Convert to base64 with compression
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
        resolve(compressedDataUrl)
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = e.target?.result as string
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

/**
 * Upload an image file - COMPRESSED VERSION (no Firebase Storage needed)
 * Returns compressed base64 data URL
 */
export async function uploadImage(file: File, _folder?: string): Promise<string> {
  try {
    // Compress image before returning base64
    const compressedDataUrl = await compressImage(file)
    return compressedDataUrl
  } catch (error) {
    console.error('Error processing image:', error)
    throw new Error('Failed to process image: ' + (error instanceof Error ? error.message : 'Unknown error'))
  }
}

/**
 * Convert base64 data URL to File object
 */
export function dataURLtoFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg'
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

/**
 * Process images in HTML content - compress large base64 images
 * This ensures images stay within Firestore size limits
 */
export async function processImagesInContent(html: string): Promise<string> {
  // Find all base64 image sources in the HTML
  const base64ImageRegex = /<img[^>]+src="(data:image\/[^;]+;base64,[^"]+)"/g
  const matches = Array.from(html.matchAll(base64ImageRegex))
  
  if (matches.length === 0) {
    return html // No base64 images found
  }
  
  let processedHtml = html
  
  // Process each base64 image - compress if too large
  for (const match of matches) {
    const base64DataUrl = match[1]
    
    // Check if image is too large (over 500KB base64 = ~375KB actual)
    const base64Size = base64DataUrl.length
    const estimatedSizeKB = (base64Size * 3) / 4 / 1024
    
    if (estimatedSizeKB > 300) {
      // Image is large, compress it
      try {
        const file = dataURLtoFile(base64DataUrl, `image-${Date.now()}.jpg`)
        const compressedDataUrl = await compressImage(file, 1600, 1200, 0.75)
        
        // Replace with compressed version
        processedHtml = processedHtml.replace(base64DataUrl, compressedDataUrl)
        console.log(`Compressed image from ${Math.round(estimatedSizeKB)}KB`)
      } catch (error) {
        console.error('Failed to compress image:', error)
        // Keep original if compression fails
      }
    }
  }
  
  return processedHtml
}
