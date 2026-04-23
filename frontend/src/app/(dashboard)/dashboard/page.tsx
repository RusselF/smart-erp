import { getDashboardStats } from '@/actions/dashboard'
import { DashboardClient } from './client'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const stats = await getDashboardStats()
  
  if (!stats) {
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 rounded-md border border-red-200 mt-8 max-w-xl mx-auto">
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p>You do not have permission to view the Dashboard Analytics.</p>
      </div>
    )
  }

  return <DashboardClient stats={stats} />
}
