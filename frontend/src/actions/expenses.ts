'use server'

import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

async function getAuthHeader() {
  const token = (await cookies()).get('token')?.value
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

export async function getExpenses(page = 1, limit = 10, startDate?: string, endDate?: string) {
  try {
    let url = `${API_URL}/expenses?page=${page}&limit=${limit}`
    if (startDate) url += `&startDate=${startDate}`
    if (endDate) url += `&endDate=${endDate}`

    const res = await fetch(url, {
      headers: await getAuthHeader(),
      cache: 'no-store'
    })
    if (!res.ok) throw new Error('Failed to fetch expenses')
    return await res.json()
  } catch (error: any) {
    return { data: [], meta: { total: 0 } }
  }
}

export async function createExpenseAction(data: any) {
  try {
    const res = await fetch(`${API_URL}/expenses`, {
      method: 'POST',
      headers: await getAuthHeader(),
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Failed to create expense')
    }
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteExpenseAction(id: string) {
  try {
    const res = await fetch(`${API_URL}/expenses/${id}`, {
      method: 'DELETE',
      headers: await getAuthHeader(),
    })
    if (!res.ok) throw new Error('Failed to delete expense')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Categories
export async function getExpenseCategories() {
  try {
    const res = await fetch(`${API_URL}/expenses/categories`, {
      headers: await getAuthHeader(),
      cache: 'no-store'
    })
    if (!res.ok) throw new Error('Failed to fetch categories')
    return await res.json()
  } catch (error: any) {
    return []
  }
}

export async function createExpenseCategoryAction(name: string) {
  try {
    const res = await fetch(`${API_URL}/expenses/categories`, {
      method: 'POST',
      headers: await getAuthHeader(),
      body: JSON.stringify({ name }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Failed to create category')
    }
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteExpenseCategoryAction(id: string) {
  try {
    const res = await fetch(`${API_URL}/expenses/categories/${id}`, {
      method: 'DELETE',
      headers: await getAuthHeader(),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Failed to delete category')
    }
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
