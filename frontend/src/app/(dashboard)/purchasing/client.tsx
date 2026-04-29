'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, PackageCheck, XCircle, FileText, Loader2 } from 'lucide-react'
import { createPurchaseAction, receivePurchaseAction, cancelPurchaseAction } from '@/actions/purchasing'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface CartItem {
  productId: string
  productName: string
  quantity: number
  unitCost: number
}

export function PurchasingClient({ initialPurchases, suppliers, products }: any) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state — use strings for number inputs so user can freely type
  const [selectedSupplier, setSelectedSupplier] = useState('')
  const [notes, setNotes] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState('')
  const [qtyStr, setQtyStr] = useState('1')
  const [costStr, setCostStr] = useState('')

  const addToCart = () => {
    if (!selectedProduct) return toast.error('Please select a product')
    const qty = Number(qtyStr)
    const cost = Number(costStr)
    if (!qty || qty < 1) return toast.error('Quantity must be at least 1')
    if (!cost || cost <= 0) return toast.error('Unit cost must be greater than 0')

    const product = products.find((p: any) => p.id === selectedProduct)
    if (!product) return

    const existing = cart.find(i => i.productId === selectedProduct)
    if (existing) {
      setCart(cart.map(i => i.productId === selectedProduct ? { ...i, quantity: i.quantity + qty, unitCost: cost } : i))
    } else {
      setCart([...cart, { productId: selectedProduct, productName: product.name, quantity: qty, unitCost: cost }])
    }
    setSelectedProduct('')
    setQtyStr('1')
    setCostStr('')
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(i => i.productId !== productId))
  }

  const total = cart.reduce((sum, i) => sum + i.quantity * i.unitCost, 0)

  const handleSubmit = async () => {
    if (!selectedSupplier) return toast.error('Please select a supplier')
    if (cart.length === 0) return toast.error('Please add at least one product')

    setIsSubmitting(true)
    try {
      await createPurchaseAction({
        supplierId: selectedSupplier,
        notes: notes || undefined,
        items: cart.map(i => ({
          productId: i.productId,
          quantity: i.quantity,
          unitCost: i.unitCost,
        })),
      })
      toast.success('Purchase Order created as DRAFT')
      setIsDialogOpen(false)
      setCart([])
      setSelectedSupplier('')
      setNotes('')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReceive = async (id: string) => {
    if (confirm('Mark this PO as RECEIVED? This will add stock to the inventory.')) {
      try {
        await receivePurchaseAction(id)
        toast.success('PO received! Stock has been updated.')
        router.refresh()
      } catch (error: any) {
        toast.error(error.message)
      }
    }
  }

  const handleCancel = async (id: string) => {
    if (confirm('Cancel this Purchase Order?')) {
      try {
        await cancelPurchaseAction(id)
        toast.success('PO cancelled')
        router.refresh()
      } catch (error: any) {
        toast.error(error.message)
      }
    }
  }

  const supplierName = selectedSupplier
    ? suppliers.find((s: any) => s.id === selectedSupplier)?.name
    : undefined

  const productName = selectedProduct
    ? products.find((p: any) => p.id === selectedProduct)?.name
    : undefined

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Purchasing</h2>
          <p className="text-muted-foreground">Create purchase orders to restock your inventory.</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Purchase Order
        </Button>
      </div>

      {/* ==================== CREATE PO DIALOG ==================== */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Create Purchase Order</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Supplier */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Supplier <span className="text-red-500">*</span></label>
              <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a supplier">
                    {supplierName || 'Select a supplier'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((s: any) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Notes <span className="text-slate-400">(optional)</span></label>
              <Input placeholder="e.g. Restock bulanan April..." value={notes} onChange={e => setNotes(e.target.value)} />
            </div>

            {/* Add Products Card */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Add Products to Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Product selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500">Product</label>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a product">
                        {productName || 'Select a product'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((p: any) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name} — Stock: {p.stock}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Qty & Unit Cost side by side */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-500">Quantity</label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="e.g. 10"
                      value={qtyStr}
                      onChange={e => {
                        const val = e.target.value.replace(/[^0-9]/g, '')
                        setQtyStr(val)
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-500">Unit Cost (Rp)</label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder="e.g. 500000"
                      value={costStr}
                      onChange={e => {
                        const val = e.target.value.replace(/[^0-9]/g, '')
                        setCostStr(val)
                      }}
                    />
                  </div>
                </div>

                {/* Add button */}
                <Button type="button" variant="outline" className="w-full" onClick={addToCart}>
                  <Plus className="h-4 w-4 mr-2" /> Add to List
                </Button>

                {/* Cart table */}
                {cart.length > 0 && (
                  <div className="border rounded-lg overflow-hidden mt-2">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50">
                          <TableHead>Product</TableHead>
                          <TableHead className="text-right w-[60px]">Qty</TableHead>
                          <TableHead className="text-right">Unit Cost</TableHead>
                          <TableHead className="text-right">Subtotal</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cart.map(item => (
                          <TableRow key={item.productId}>
                            <TableCell className="font-medium">{item.productName}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">Rp {item.unitCost.toLocaleString('id-ID')}</TableCell>
                            <TableCell className="text-right font-semibold">Rp {(item.quantity * item.unitCost).toLocaleString('id-ID')}</TableCell>
                            <TableCell className="text-center">
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeFromCart(item.productId)}>
                                <Trash2 className="h-3.5 w-3.5 text-red-500" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Total */}
            <div className="flex justify-between items-center py-4 px-1 border-t border-b">
              <span className="text-slate-600 font-medium text-base">Total Amount</span>
              <span className="text-2xl font-black text-primary">Rp {total.toLocaleString('id-ID')}</span>
            </div>

            {/* Submit */}
            <Button className="w-full h-11 text-base" disabled={isSubmitting || cart.length === 0} onClick={handleSubmit}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <FileText className="h-4 w-4 mr-2" />}
              Create as DRAFT
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ==================== PO HISTORY TABLE ==================== */}
      <div className="bg-white rounded-md shadow-sm border mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PO Number</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialPurchases.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-32 text-muted-foreground">
                  <FileText className="mx-auto h-8 w-8 mb-2 text-slate-300" />
                  No purchase orders yet.
                </TableCell>
              </TableRow>
            ) : (
              initialPurchases.data.map((po: any) => (
                <TableRow key={po.id}>
                  <TableCell className="font-medium font-mono">{po.poNumber}</TableCell>
                  <TableCell>{new Date(po.createdAt).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell>{po.supplier?.name}</TableCell>
                  <TableCell>{po.user?.name || '-'}</TableCell>
                  <TableCell className="text-right font-semibold">Rp {po.totalAmount.toLocaleString('id-ID')}</TableCell>
                  <TableCell className="text-center">
                    <span className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-semibold',
                      po.status === 'DRAFT' ? 'bg-amber-100 text-amber-700' :
                      po.status === 'RECEIVED' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-red-100 text-red-700'
                    )}>
                      {po.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {po.status === 'DRAFT' && (
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleReceive(po.id)} title="Mark as Received">
                          <PackageCheck className="h-4 w-4 text-emerald-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleCancel(po.id)} title="Cancel PO">
                          <XCircle className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
