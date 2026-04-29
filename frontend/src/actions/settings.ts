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

export async function getSettings() {
  try {
    const res = await fetch(`${API_URL}/settings`, {
      headers: await getAuthHeader(),
      cache: 'no-store'
    })
    if (!res.ok) throw new Error('Failed to fetch settings')
    return await res.json()
  } catch (error: any) {
    return {}
  }
}

export async function updateSettingsAction(data: Record<string, string>) {
  try {
    const res = await fetch(`${API_URL}/settings`, {
      method: 'PATCH',
      headers: await getAuthHeader(),
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update settings')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
