import { getProductsAction, getCategoriesAction } from '@/actions/inventory'
import PosClient from './client'

export const dynamic = 'force-dynamic'

export default async function PosPage() {
  const [productsRes, categories] = await Promise.all([
    getProductsAction(),
    getCategoriesAction()
  ])

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50">
      <PosClient initialProducts={productsRes.data} categories={categories} />
    </div>
  )
}
