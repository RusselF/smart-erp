import { getPurchasesAction, getSuppliersAction } from '@/actions/purchasing'
import { getProductsAction } from '@/actions/inventory'
import { PurchasingClient } from './client'

export const dynamic = 'force-dynamic'

export default async function PurchasingPage() {
  try {
    const [purchases, suppliers, products] = await Promise.all([
      getPurchasesAction(),
      getSuppliersAction(),
      getProductsAction({ page: 1 }),
    ])

    return (
      <PurchasingClient
        initialPurchases={purchases}
        suppliers={suppliers}
        products={products.data}
      />
    )
  } catch (error: any) {
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 rounded-md border border-red-200 mt-8 max-w-xl mx-auto">
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p>{error.message}</p>
      </div>
    )
  }
}
