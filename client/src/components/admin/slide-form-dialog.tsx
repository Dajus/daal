import { useState, useEffect } from 'react'
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import RichTextEditor from './rich-text-editor'
import type { TheorySlide } from '@/types'
import { t } from '@/lib/translations'
import { useToast } from '@/hooks/use-toast'

interface SlideFormDialogProps {
  slide?: TheorySlide | null
  onSave: (data: any) => void
  isLoading: boolean
}

export default function SlideFormDialog({ slide, onSave, isLoading }: SlideFormDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    slideOrder: 1,
    estimatedReadTime: 2,
  })
  const [videoUrl, setVideoUrl] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (slide) {
      setFormData({
        title: slide.title || '',
        content: slide.content || '',
        slideOrder: slide.slideOrder || 1,
        estimatedReadTime: slide.estimatedReadTime || 2,
      })
      // Check if slide content contains video and extract URL
      const videoMatch = slide.content?.match(/<video[^>]*>.*?<source src="([^"]*)"[^>]*>/)
      if (videoMatch) {
        setVideoUrl(videoMatch[1])
      } else {
        setVideoUrl('')
      }
    } else {
      setFormData({
        title: '',
        content: '',
        slideOrder: 1,
        estimatedReadTime: 2,
      })
      setVideoUrl('')
    }
  }, [slide])

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      toast({
        title: 'Chyba',
        description: 'Velikost videa musí být menší než 50MB',
        variant: 'destructive',
      })
      return
    }

    setUploading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('media', file)

      const authHeaders = { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }

      const response = await fetch('/api/admin/upload-media', {
        method: 'POST',
        body: uploadFormData,
        headers: authHeaders,
      })

      if (!response.ok) {
        throw new Error('Failed to upload video')
      }

      const { mediaUrl } = await response.json()

      // Set video URL and create video HTML content
      setVideoUrl(mediaUrl)
      const videoHtml = `<div style="margin: 10px 0;">
        <video controls style="max-width: 100%; height: auto;" preload="metadata">
          <source src="${mediaUrl}" type="video/mp4">
          <p>Váš prohlížeč nepodporuje video přehrávání. <a href="${mediaUrl}" target="_blank">Stáhnout video</a></p>
        </video>
      </div>`

      setFormData((prev) => ({ ...prev, content: videoHtml }))

      toast({
        title: 'Úspěch',
        description: 'Video bylo úspěšně nahráno',
      })
    } catch (error) {
      console.error('Video upload error:', error)
      toast({
        title: 'Chyba',
        description: 'Nepodařilo se nahrát video',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
      // Clear the input
      e.target.value = ''
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // When editing existing slide, exclude slideOrder to prevent reordering
    if (slide) {
      const { slideOrder, ...dataWithoutOrder } = formData
      onSave(dataWithoutOrder)
    } else {
      // For new slides, include slideOrder
      onSave(formData)
    }
  }

  return (
    <DialogContent
      className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      aria-describedby="slide-form-description"
    >
      <DialogHeader>
        <DialogTitle className="text-gray-900 dark:text-white">{slide ? t('editSlide') : t('addSlide')}</DialogTitle>
        <div id="slide-form-description" className="text-sm text-gray-600 dark:text-gray-400">
          {t('richTextEditorDescription')}
        </div>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="title">{t('slideTitle')}</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={t('slideTitle')}
              required
            />
          </div>

          <div>
            <Label htmlFor="estimatedReadTime">{t('estimatedReadTime')}</Label>
            <Input
              id="estimatedReadTime"
              type="number"
              min="1"
              max="30"
              value={formData.estimatedReadTime}
              onChange={(e) => setFormData({ ...formData, estimatedReadTime: parseInt(e.target.value) })}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="content">Obsah snímku</Label>
          {videoUrl ? (
            <div className="mt-2 space-y-4">
              <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Nahranné video:</p>
                <video controls className="w-full max-w-md h-auto rounded">
                  <source src={videoUrl} type="video/mp4" />
                  Váš prohlížeč nepodporuje video přehrávání.
                </video>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    setVideoUrl('')
                    setFormData({ ...formData, content: '' })
                  }}
                >
                  Odebrat video
                </Button>
              </div>
            </div>
          ) : (
            // Show rich text editor and video upload when no video
            <div className="mt-2 space-y-4">
              <RichTextEditor
                value={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                placeholder="Zadejte obsah snímku. Můžete přidat obrázky, formátování a další..."
                height={300}
              />

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Nebo nahrajte video (nahrazí textový obsah):
                </p>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/ogg"
                  onChange={handleVideoUpload}
                  disabled={uploading}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                />
                {uploading && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span className="text-sm text-gray-600">Nahrávání videa...</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary-dark">
            {isLoading ? 'Saving...' : slide ? 'Update Slide' : 'Create Slide'}
          </Button>
        </div>
      </form>
    </DialogContent>
  )
}
