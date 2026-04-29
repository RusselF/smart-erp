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

export async function getProfitLoss(startDate?: string, endDate?: string) {
  try {
    let url = `${API_URL}/reports/profit-loss`
    const params = new URLSearchParams()
    if (startDate) params.append('startDate', startDate)
    if (endDate) params.append('endDate', endDate)
    
    if (params.toString()) {
      url += `?${params.toString()}`
    }

    const res = await fetch(url, {
      headers: await getAuthHeader(),
      cache: 'no-store'
    })
    if (!res.ok) throw new Error('Failed to fetch profit loss report')
    return await res.json()
  } catch (error: any) {
    return { totalRevenue: 0, totalPurchases: 0, grossProfit: 0, totalExpenses: 0, netProfit: 0 }
  }
}

export async function getStockSummary() {
  try {
    const res = await fetch(`${API_URL}/reports/stock-summary`, {
      headers: await getAuthHeader(),
      cache: 'no-store'
    })
    if (!res.ok) throw new Error('Failed to fetch stock summary')
    return await res.json()
  } catch (error: any) {
    return { products: [], totals: { totalItems: 0, totalStockValue: 0 } }
  }
}
