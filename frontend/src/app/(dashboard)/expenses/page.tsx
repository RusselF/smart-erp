import { getExpenses, getExpenseCategories } from '@/actions/expenses'
import { ExpensesClient } from './client'

export const dynamic = 'force-dynamic'

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: { page?: string; limit?: string; startDate?: string; endDate?: string }
}) {
  const [expenses, categories] = await Promise.all([
    getExpenses(
      searchParams.page ? Number(searchParams.page) : 1,
      searchParams.limit ? Number(searchParams.limit) : 10,
      searchParams.startDate,
      searchParams.endDate
    ),
    getExpenseCategories()
  ])

  return <ExpensesClient initialExpenses={expenses} initialCategories={categories} />
}
