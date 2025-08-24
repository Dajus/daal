import { v2 as cloudinary } from 'cloudinary'
import { randomUUID } from 'crypto'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export class ObjectStorageService {
  constructor() {
    this.validateConfiguration()
  }

  validateConfiguration() {
    const requiredEnvVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        throw new Error(`${envVar} environment variable is required for Cloudinary`)
      }
    }
  }

  async uploadToPublicStorage(
    fileBuffer: Buffer,
    fileName: string,
    contentType: string,
    options: any = {},
  ): Promise<string> {
    try {
      const folder = process.env.CLOUDINARY_PUBLIC_FOLDER || 'public'

      // Generate unique filename
      const timestamp = Date.now()
      const uuid = randomUUID().slice(0, 8)
      const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '')
      const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9-_]/g, '_')
      const uniqueFileName = `${timestamp}_${uuid}_${sanitizedName}`

      // Determine resource type
      const resourceType = this.getResourceType(contentType)

      // Upload to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: resourceType,
              public_id: `${folder}/${uniqueFileName}`,
              folder: folder,
              use_filename: false,
              unique_filename: false,
              overwrite: false,
              ...options,
            },
            (error, result) => {
              if (error) {
                reject(error)
              } else {
                resolve(result)
              }
            },
          )
          .end(fileBuffer)
      })

      // Return the public URL
      return uploadResult.secure_url
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error)
      throw new Error(`Failed to upload file: ${error.message}`)
    }
  }

  // Get optimized URL for existing file
  getPublicUrl(publicId: string, options: any = {}): string {
    return cloudinary.url(publicId, {
      fetch_format: 'auto',
      quality: 'auto',
      ...options,
    })
  }

  private getResourceType(contentType: string): 'image' | 'video' | 'raw' {
    if (contentType.startsWith('image/')) {
      return 'image'
    } else if (contentType.startsWith('video/')) {
      return 'video'
    } else {
      return 'raw'
    }
  }
}
