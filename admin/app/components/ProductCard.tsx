'use client'

import { Product } from '../lib/api'
import Image from 'next/image'

interface ProductCardProps {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
  dragHandleProps?: any
}

export default function ProductCard({ product, onEdit, onDelete, dragHandleProps }: ProductCardProps) {
  // 处理图片 URL
  let imageUrl = product.imageUrl;
  
  if (!imageUrl) {
    // 如果没有图片 URL，使用默认占位图
    imageUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ4IiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQ4IiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7lm77niYfliqDovb3lpLHotKU8L3RleHQ+PC9zdmc+';
  } else if (!imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
    // 如果是相对路径，转换为绝对路径
    if (imageUrl.startsWith('/')) {
      // 绝对路径，从网站根目录开始
      imageUrl = `https://www.kinkoshioji.co.jp${imageUrl}`;
    } else {
      // 相对路径
      imageUrl = `https://www.kinkoshioji.co.jp/img/goods/${imageUrl}`;
    }
  }

  return (
    <div className="product-card">
      {/* 拖拽手柄 */}
      {dragHandleProps && (
        <div
          {...dragHandleProps}
          className="drag-handle"
          style={{
            position: 'absolute',
            top: '5px',
            right: '5px',
            cursor: 'grab',
            padding: '5px',
            fontSize: '18px',
            color: '#999',
            userSelect: 'none',
          }}
          title="拖拽排序"
        >
          ⋮⋮
        </div>
      )}
      <img 
        src={imageUrl} 
        alt={product.nameJa || product.name}
        className="product-image"
        onError={(e) => {
          // 图片加载失败时，使用 SVG 占位图
          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQ4IiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQ4IiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7lm77niYfliqDovb3lpLHotKU8L3RleHQ+PC9zdmc+';
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
