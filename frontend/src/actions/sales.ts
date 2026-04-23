'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

export async function createOrder(data: {
  customerName?: string;
  paymentMethod?: string;
  items: { productId: string; quantity: number }[];
}) {
  const token = (await cookies()).get('token')?.value;

  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.message || 'Failed to create order' };
    }

    revalidatePath('/inventory');
    revalidatePath('/sales');
    revalidatePath('/dashboard');
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || 'Network error' };
  }
}

export async function getOrders(page = 1, limit = 10, search = '') {
  const token = (await cookies()).get('token')?.value;

  try {
    const url = new URL(`${API_URL}/orders`);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('limit', limit.toString());
    if (search) {
      url.searchParams.append('search', search);
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      return { data: [], meta: { total: 0, page: 1, lastPage: 1 } };
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { data: [], meta: { total: 0, page: 1, lastPage: 1 } };
  }
}
