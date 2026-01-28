'use client'

import { useState, useRef } from 'react'
import { uploadImage } from '../lib/api'

interface ImageUploadProps {
  onUploadComplete: (url: string) => void
  currentImageUrl?: string
}

// 标准图片尺寸
const TARGET_WIDTH = 248
const TARGET_HEIGHT = 120

export default function ImageUpload({ onUploadComplete, currentImageUrl }: ImageUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>(currentImageUrl || '')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 裁剪图片到指定尺寸（高度120px，宽度248px，居中裁剪）
  const cropImageToSize = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const aspectRatio = img.width / img.height
          const targetAspectRatio = TARGET_WIDTH / TARGET_HEIGHT
          
          let sourceX = 0
          let sourceY = 0
          let sourceWidth = img.width
          let sourceHeight = img.height
          
          // 计算裁剪区域（居中裁剪）
          if (aspectRatio > targetAspectRatio) {
            // 原图更宽，需要裁剪左右
            sourceHeight = img.height
            sourceWidth = sourceHeight * targetAspectRatio
            sourceX = (img.width - sourceWidth) / 2
          } else {
            // 原图更高，需要裁剪上下
            sourceWidth = img.width
            sourceHeight = sourceWidth / targetAspectRatio
            sourceY = (img.height - sourceHeight) / 2
          }
          
          // 创建 canvas 进行裁剪和缩放
          const canvas = document.createElement('canvas')
          canvas.width = TARGET_WIDTH
          canvas.height = TARGET_HEIGHT
          const ctx = canvas.getContext('2d')
          
          if (!ctx) {
            reject(new Error('无法创建 canvas 上下文'))
            return
          }
          
          // 绘制裁剪后的图片（居中填充）
          ctx.drawImage(
            img,
            sourceX, sourceY, sourceWidth, sourceHeight,
            0, 0, TARGET_WIDTH, TARGET_HEIGHT
          )
          
          // 转换为 Blob
          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('图片转换失败'))
              return
            }
            
            // 创建新的 File 对象
            const croppedFile = new File([blob], file.name, {
              type: file.type || 'image/jpeg',
              lastModified: Date.now(),
            })
            
            // 更新预览
            const previewUrl = canvas.toDataURL(file.type || 'image/jpeg', 0.9)
            setPreview(previewUrl)
            
            resolve(croppedFile)
          }, file.type || 'image/jpeg', 0.9)
        }
        img.onerror = reject
        img.src = e.target?.result as string
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      
      try {
        // 裁剪图片
        const croppedFile = await cropImageToSize(selectedFile)
        setFile(croppedFile)
      } catch (err) {
        setError('画像の処理に失敗しました')
        console.error(err)
        // 如果裁剪失败，使用原图
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(selectedFile)
      }
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
      // 清理预览 URL
      if (preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview)
      }
      setPreview('')
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
