'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Search, Edit2, Trash2 } from 'lucide-react'
import { ProductForm } from '@/components/inventory/product-form'
import { deleteProductAction } from '@/actions/inventory'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function InventoryClient({ initialProducts, categories, currentPage, search, categoryId }: any) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)

  const [searchTerm, setSearchTerm] = useState(search)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateUrl({ search: searchTerm, page: 1 })
  }

  const handleCategoryChange = (val: string) => {
    updateUrl({ categoryId: val, page: 1 })
  }

  const updateUrl = (updates: any) => {
    const params = new URLSearchParams()
    if (updates.search !== undefined ? updates.search : search) params.set('search', updates.search ?? search)
    if (updates.categoryId !== undefined ? updates.categoryId : categoryId) {
      if (updates.categoryId !== 'all') params.set('categoryId', updates.categoryId ?? categoryId)
    }
    params.set('page', (updates.page || currentPage).toString())
    router.push(`/inventory?${params.toString()}`)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProductAction(id)
        toast.success('Product deleted')
        router.refresh()
      } catch (error: any) {
        toast.error(error.message)
      }
    }
  }

  const handleOpenDialog = (product = null) => {
    setEditingProduct(product)
    setIsDialogOpen(true)
  }

  const handleSuccess = () => {
    setIsDialogOpen(false)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2 max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="submit" variant="secondary">Search</Button>
        </form>

        <div className="flex items-center gap-2">
          <Select value={categoryId || 'all'} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat: any) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2" onClick={() => handleOpenDialog(null)}>
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              </DialogHeader>
              <ProductForm
                initialData={editingProduct}
                categories={categories}
                onSuccess={handleSuccess}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-sm border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialProducts.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              initialProducts.data.map((product: any) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.sku}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category?.name || '-'}</TableCell>
                  <TableCell className="text-right">
                    Rp {product.price.toLocaleString('id-ID')}
                  </TableCell>
                  <TableCell className={cn(
                    "text-right font-medium",
                    product.stock < 10 ? "text-red-600" : "text-emerald-600"
                  )}>
                    {product.stock}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(product)}>
                        <Edit2 className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {initialProducts.meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing page {currentPage} of {initialProducts.meta.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => updateUrl({ page: currentPage - 1 })}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= initialProducts.meta.totalPages}
              onClick={() => updateUrl({ page: currentPage + 1 })}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
