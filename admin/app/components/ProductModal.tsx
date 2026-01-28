'use client'

import { useState, useEffect } from 'react'
import { Product, createProduct, updateProduct } from '../lib/api'
import ImageUpload from './ImageUpload'

interface ProductModalProps {
  product: Product | null
  onClose: () => void
  onSave: () => void
}

export default function ProductModal({ product, onClose, onSave }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    nameJa: '',
    imageUrl: '',
    price: 0,
    unit: 'kg',
    isNewPrice: false,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        nameJa: product.nameJa || '',
        imageUrl: product.imageUrl || '',
        price: product.price || 0,
        unit: product.unit || 'kg',
        isNewPrice: product.isNewPrice || false,
      })
    }
  }, [product])

  const handleImageUploadComplete = (url: string) => {
    setFormData(prev => ({ ...prev, imageUrl: url }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nameJa && !formData.name) {
      setError('商品名を入力してください')
      return
    }

    if (formData.price < 0) {
      setError('価格は0以上である必要があります')
      return
    }

    try {
      setSaving(true)
      setError(null)

      const productData = {
        ...formData,
      }

      if (product) {
        await updateProduct(product.id, productData)
      } else {
        await createProduct(productData)
      }

      onSave()
    } catch (err) {
      setError('保存に失敗しました')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{product ? '商品を編集' : '新しい商品を追加'}</h2>
          <span className="close" onClick={onClose}>&times;</span>
        </div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>商品名（日本語）*</label>
            <input
              type="text"
              value={formData.nameJa}
              onChange={(e) => setFormData({ ...formData, nameJa: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>商品名（英語）</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>画像</label>
            <ImageUpload
              onUploadComplete={handleImageUploadComplete}
              currentImageUrl={formData.imageUrl}
            />
            {formData.imageUrl && (
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                現在の画像URL: {formData.imageUrl}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>価格（円）*</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label>単位*</label>
            <select
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              required
            >
              <option value="kg">kg</option>
              <option value="台">台</option>
              <option value="個">個</option>
            </select>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.isNewPrice}
                onChange={(e) => setFormData({ ...formData, isNewPrice: e.target.checked })}
              />
              New Price タグを表示
            </label>
          </div>

          <div className="actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              キャンセル
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
