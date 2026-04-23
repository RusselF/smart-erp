'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

async function getHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export async function getUsersAction() {
  const res = await fetch(`${API_URL}/users`, {
    headers: await getHeaders(),
    cache: 'no-store',
  });
  if (!res.ok) {
    if (res.status === 403) throw new Error('Forbidden: Only ADMIN can view users.');
    throw new Error('Failed to fetch users');
  }
  return res.json();
}

export async function createUserAction(data: any) {
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create user');
  }
  return res.json();
}

export async function updateUserAction(id: string, data: any) {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'PATCH',
    headers: await getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to update user');
  }
  return res.json();
}

export async function deleteUserAction(id: string) {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
    headers: await getHeaders(),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to delete user');
  }
  return res.json();
}
