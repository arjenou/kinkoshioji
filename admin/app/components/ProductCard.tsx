'use client'

import { Product } from '../lib/api'
import Image from 'next/image'

interface ProductCardProps {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
}

export default function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const imageUrl = product.imageUrl.startsWith('http') 
    ? product.imageUrl 
    : `${process.env.NEXT_PUBLIC_API_URL || ''}${product.imageUrl}`

  return (
    <div className="product-card">
      <img 
        src={imageUrl} 
        alt={product.nameJa || product.name}
        className="product-image"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/placeholder.jpg'
        }}
      />
      <div className="product-name">{product.nameJa || product.name}</div>
      <div className={`product-price ${product.isNewPrice ? 'new-price' : ''}`}>
        {product.isNewPrice && (
          <span className="new-price-badge">New Price</span>
        )}
        <div>
          <span className="price-value">
            {product.price.toLocaleString('ja-JP')}
          </span>
          <span className="price-unit">円/{product.unit}</span>
        </div>
      </div>
      <div className="actions" style={{ marginTop: '15px' }}>
        <button 
          className="btn btn-secondary btn-small" 
          onClick={() => onEdit(product)}
        >
          編集
        </button>
        <button 
          className="btn btn-danger btn-small" 
          onClick={() => onDelete(product.id)}
        >
          削除
        </button>
      </div>
    </div>
  )
}
