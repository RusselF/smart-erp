'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

async function getHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// ==================== SUPPLIERS ====================

export async function getSuppliersAction() {
  const res = await fetch(`${API_URL}/suppliers`, {
    headers: await getHeaders(),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch suppliers');
  return res.json();
}

export async function createSupplierAction(data: any) {
  const res = await fetch(`${API_URL}/suppliers`, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create supplier');
  }
  return res.json();
}

export async function updateSupplierAction(id: string, data: any) {
  const res = await fetch(`${API_URL}/suppliers/${id}`, {
    method: 'PATCH',
    headers: await getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to update supplier');
  }
  return res.json();
}

export async function deleteSupplierAction(id: string) {
  const res = await fetch(`${API_URL}/suppliers/${id}`, {
    method: 'DELETE',
    headers: await getHeaders(),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to delete supplier');
  }
  return res.json();
}

// ==================== PURCHASES ====================

export async function getPurchasesAction(params?: { page?: number }) {
  const query = new URLSearchParams();
  if (params?.page) query.append('page', params.page.toString());

  const res = await fetch(`${API_URL}/purchases?${query.toString()}`, {
    headers: await getHeaders(),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch purchases');
  return res.json();
}

export async function getPurchaseDetailAction(id: string) {
  const res = await fetch(`${API_URL}/purchases/${id}`, {
    headers: await getHeaders(),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch purchase detail');
  return res.json();
}

export async function createPurchaseAction(data: any) {
  const res = await fetch(`${API_URL}/purchases`, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create purchase order');
  }
  return res.json();
}

export async function receivePurchaseAction(id: string) {
  const res = await fetch(`${API_URL}/purchases/${id}/receive`, {
    method: 'PATCH',
    headers: await getHeaders(),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to receive purchase order');
  }
  return res.json();
}

export async function cancelPurchaseAction(id: string) {
  const res = await fetch(`${API_URL}/purchases/${id}/cancel`, {
    method: 'PATCH',
    headers: await getHeaders(),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to cancel purchase order');
  }
  return res.json();
}
