'use server'

import { cookies } from 'next/headers'

const API_URL = 'http://127.0.0.1:3001'

async function getHeaders() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

export async function getProductsAction(params?: { page?: number; search?: string; categoryId?: string }) {
  const query = new URLSearchParams()
  if (params?.page) query.append('page', params.page.toString())
  if (params?.search) query.append('search', params.search)
  if (params?.categoryId && params.categoryId !== 'all') query.append('categoryId', params.categoryId)

  const res = await fetch(`${API_URL}/products?${query.toString()}`, {
    headers: await getHeaders(),
    cache: 'no-store',
  })
  
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}

export async function getCategoriesAction() {
  const res = await fetch(`${API_URL}/categories`, {
    headers: await getHeaders(),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error('Failed to fetch categories')
  return res.json()
}

export async function createProductAction(data: any) {
  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Failed to create product')
  }
  return res.json()
}

export async function updateProductAction(id: string, data: any) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'PATCH',
    headers: await getHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Failed to update product')
  }
  return res.json()
}

export async function deleteProductAction(id: string) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: await getHeaders(),
  })
  if (!res.ok) throw new Error('Failed to delete product')
  return res.json()
}

export async function createCategoryAction(name: string) {
  const res = await fetch(`${API_URL}/categories`, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify({ name }),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Failed to create category')
  }
  return res.json()
}
