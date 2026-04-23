'use server'

import { cookies } from 'next/headers'

export async function loginAction(formData: FormData) {
  const email = formData.get('email')
  const password = formData.get('password')

  try {
    const res = await fetch('http://127.0.0.1:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    
    if (!res.ok) {
      return { error: 'Invalid credentials' }
    }

    const data = await res.json()
    
    if (data.access_token) {
      const cookieStore = await cookies()
      cookieStore.set('token', data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 // 1 day
      })
      
      return { success: true }
    }
  } catch (error) {
    return { error: 'Internal server error. Ensure Backend is running on port 3001.' }
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('token')
  return { success: true }
}

export async function getMeAction() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) return null

  try {
    const res = await fetch('http://127.0.0.1:3001/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!res.ok) {
      return null
    }

    return await res.json()
  } catch (error) {
    return null
  }
}

