import { useState, useRef, useCallback } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  height?: number
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Enter content...',
  height = 200,
}: RichTextEditorProps) {
  const { toast } = useToast()
  const quillRef = useRef<ReactQuill>(null)
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = useCallback(async () => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: 'Error',
          description: 'Image size must be less than 5MB',
          variant: 'destructive',
        })
        return
      }

      setUploading(true)
      try {
        // Create form data for upload
        const formData = new FormData()
        formData.append('image', file)

        // Upload to our server endpoint using auth helper
        const authHeaders = { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }

        const response = await fetch('/api/admin/upload-image', {
          method: 'POST',
          body: formData,
          headers: authHeaders,
        })

        if (!response.ok) {
          throw new Error('Failed to upload image')
        }

        const { imageUrl } = await response.json()

        // Insert image into editor
        const quill = quillRef.current?.getEditor()
        if (quill) {
          const range = quill.getSelection()
          const index = range ? range.index : quill.getLength()
          quill.insertEmbed(index, 'image', imageUrl)
          quill.setSelection(index + 1, 0)
        }

        toast({
          title: 'Success',
          description: 'Image uploaded successfully',
        })
      } catch (error) {
        console.error('Upload error:', error)
        toast({
          title: 'Error',
          description: 'Failed to upload image',
          variant: 'destructive',
        })
      } finally {
        setUploading(false)
      }
    }
  }, [toast])

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ['link'],
        ['clean'],
      ],
      handlers: {
        image: handleImageUpload,
      },
    },
  }

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'color',
    'background',
    'align',
    'link',
    'image',
  ]

  return (
    <div className="relative">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
        style={{ height: `${height}px` }}
        className="mb-12"
      />
      {uploading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span className="text-sm text-gray-600">Uploading image...</span>
          </div>
        </div>
      )}

      {/* Custom image upload button */}
      <div className="absolute bottom-14 right-4 z-20">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleImageUpload}
          disabled={uploading}
          className="bg-white shadow-sm hover:shadow-md"
        >
          📷 Upload Image
        </Button>
      </div>
    </div>
  )
}
