import { getProfitLoss, getStockSummary } from '@/actions/reports'
import { ReportsClient } from './client'

export const dynamic = 'force-dynamic'

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: { startDate?: string; endDate?: string }
}) {
  const [profitLoss, stockSummary] = await Promise.all([
    getProfitLoss(searchParams.startDate, searchParams.endDate),
    getStockSummary()
  ])

  return <ReportsClient initialProfitLoss={profitLoss} initialStockSummary={stockSummary} />
}
