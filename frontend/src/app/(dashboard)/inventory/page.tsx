import { InventoryClient } from "./client"
import { getProductsAction, getCategoriesAction } from '@/actions/inventory'

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; categoryId?: string }>
}) {
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page) : 1
  const search = resolvedSearchParams.search || ''
  const categoryId = resolvedSearchParams.categoryId || ''

  // Fetch initial data on the server
  const productsResponse = await getProductsAction({ page, search, categoryId })
  const categories = await getCategoriesAction()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Inventory</h2>
        <p className="text-muted-foreground">Manage your products, categories, and stock levels.</p>
      </div>
      <InventoryClient 
        initialProducts={productsResponse}
        categories={categories}
        currentPage={page}
        search={search}
        categoryId={categoryId}
      />
    </div>
  )
}
