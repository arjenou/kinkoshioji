'use client'

import { useState } from 'react'
import { uploadImage } from '../lib/api'

interface ImageUploadProps {
  onUploadComplete: (url: string) => void
  currentImageUrl?: string
}

export default function ImageUpload({ onUploadComplete, currentImageUrl }: ImageUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>(currentImageUrl || '')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    try {
      setUploading(true)
      setError(null)
      const result = await uploadImage(file)
      onUploadComplete(result.url)
      setFile(null)
    } catch (err) {
      setError('画像のアップロードに失敗しました')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ marginBottom: '10px' }}
      />
      {preview && (
        <img src={preview} alt="Preview" className="image-preview" />
      )}
      {file && (
        <div>
          <button
            type="button"
            className="btn btn-secondary btn-small"
            onClick={handleUpload}
            disabled={uploading}
            style={{ marginTop: '10px' }}
          >
            {uploading ? 'アップロード中...' : '画像をアップロード'}
          </button>
          {error && <div className="error" style={{ marginTop: '10px' }}>{error}</div>}
        </div>
      )}
    </div>
  )
}
