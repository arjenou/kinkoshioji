'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import ProductCard from './components/ProductCard'
import ProductModal from './components/ProductModal'
import { Product, getProducts, deleteProduct, reorderProducts } from './lib/api'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getProducts()
      setProducts(data.products || [])
    } catch (err) {
      setError('商品データの読み込みに失敗しました')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = () => {
    setEditingProduct(null)
    setIsModalOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setIsModalOpen(true)
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('この商品を削除してもよろしいですか？')) {
      return
    }

    try {
      await deleteProduct(id)
      await loadProducts()
    } catch (err) {
      setError('商品の削除に失敗しました')
      console.error(err)
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
  }

  const handleModalSave = () => {
    loadProducts()
    handleModalClose()
  }

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) {
      return
    }

    const items = Array.from(products)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // 更新本地状态
    setProducts(items)

    // 更新服务器排序
    try {
      const productIds = items.map(item => item.id)
      await reorderProducts(productIds)
    } catch (err) {
      console.error('Failed to reorder products:', err)
      // 如果失败，重新加载
      loadProducts()
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>商品管理システム</h1>
        <p>商品の追加、編集、削除ができます</p>
      </div>

      {error && (
        <div className="error">
          {error}
          <button onClick={() => setError(null)} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
        </div>
      )}

      <div className="add-product-btn">
        <button className="btn btn-primary" onClick={handleAddProduct}>
          + 新しい商品を追加
        </button>
      </div>

      {loading ? (
        <div className="loading">読み込み中...</div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="products">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="products-grid"
              >
                {products.map((product, index) => (
                  <Draggable key={product.id} draggableId={product.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          ...provided.draggableProps.style,
                          opacity: snapshot.isDragging ? 0.8 : 1,
                          zIndex: snapshot.isDragging ? 1000 : 1,
                        }}
                      >
                        <ProductCard
                          product={product}
                          onEdit={handleEditProduct}
                          onDelete={handleDeleteProduct}
                          dragHandleProps={provided.dragHandleProps}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {isModalOpen && (
        <ProductModal
          product={editingProduct}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  )
}
