import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787'
const ADMIN_TOKEN = process.env.NEXT_PUBLIC_ADMIN_TOKEN || ''

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface Product {
  id: string
  name: string
  nameJa: string
  imageUrl: string
  price: number
  unit: string
  isNewPrice: boolean
  order?: number
  createdAt: string
  updatedAt: string
}

export interface ProductsResponse {
  products: Product[]
  updatedAt: string
}

export async function getProducts(): Promise<ProductsResponse> {
  const response = await api.get<ProductsResponse>('/api/products')
  return response.data
}

export async function createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  const response = await api.post<{ product: Product }>(
    '/api/products',
    product,
    {
      headers: {
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
    }
  )
  return response.data.product
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  const response = await api.put<{ product: Product }>(
    `/api/products/${id}`,
    product,
    {
      headers: {
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
    }
  )
  return response.data.product
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/api/products/${id}`, {
    headers: {
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    },
  })
}

export async function uploadImage(file: File): Promise<{ url: string; filename: string }> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post<{ url: string; filename: string }>(
    '/api/upload',
    formData,
    {
      headers: {
        Authorization: `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'multipart/form-data',
      },
    }
  )
  return response.data
}

export async function reorderProducts(productIds: string[]): Promise<Product[]> {
  const response = await api.put<{ products: Product[] }>(
    '/api/products/reorder',
    { productIds },
    {
      headers: {
        Authorization: `Bearer ${ADMIN_TOKEN}`,
      },
    }
  )
  return response.data.products
}
