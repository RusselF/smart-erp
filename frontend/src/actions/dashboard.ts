'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

export async function getDashboardStats() {
  const token = (await cookies()).get('token')?.value;

  try {
    const response = await fetch(`${API_URL}/dashboard/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store' // Always fetch fresh stats
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return null;
  }
}
