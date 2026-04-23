'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, Plus, Minus, Trash2, ShoppingCart, CreditCard, Package } from 'lucide-react'
import { toast } from 'sonner'
import { getProductsAction } from '@/actions/inventory'
import { createOrder } from '@/actions/sales'

export default function PosClient({ initialProducts, categories }: any) {
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<any[]>([])
  const [customerName, setCustomerName] = useState('')
  const [isCheckout, setIsCheckout] = useState(false)

  const handleSearch = async (e: any) => {
    e.preventDefault()
    const res = await getProductsAction({ search })
    setProducts(res.data)
  }

  const addToCart = (product: any) => {
    if (product.stock <= 0) {
      toast.error('Out of stock!')
      return
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        if (existing.quantity >= product.stock) {
          toast.error('Cannot exceed available stock')
          return prev
        }
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta
        if (newQty > item.stock) {
          toast.error('Cannot exceed available stock')
          return item
        }
        return { ...item, quantity: Math.max(0, newQty) }
      }
      return item
    }).filter(item => item.quantity > 0))
  }

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const handleCheckout = async () => {
    if (cart.length === 0) return

    setIsCheckout(true)
    const orderData = {
      customerName: customerName || undefined,
      paymentMethod: 'CASH',
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }))
    }

    const res = await createOrder(orderData)
    if (res.success) {
      toast.success('Transaction successful!')
      setCart([])
      setCustomerName('')
      // Refresh products to get updated stock
      const updatedProducts = await getProductsAction({ search })
      setProducts(updatedProducts.data)
    } else {
      toast.error(res.error || 'Checkout failed')
    }
    setIsCheckout(false)
  }

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Left: Product List */}
      <div className="flex-1 flex flex-col p-6 border-r bg-white/50">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Point of Sales</h1>
            <p className="text-sm text-slate-500">Add products to cart to create transaction</p>
          </div>
          <form onSubmit={handleSearch} className="flex relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <Input 
              placeholder="Search product..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white"
            />
          </form>
        </div>

        <ScrollArea className="flex-1 -mx-2 px-2">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20">
            {products?.map((product: any) => (
              <Card 
                key={product.id} 
                className={`p-4 cursor-pointer transition-all hover:shadow-md border-transparent hover:border-primary/20 ${product.stock <= 0 ? 'opacity-50 grayscale' : ''}`}
                onClick={() => addToCart(product)}
              >
                <div className="aspect-square bg-slate-100 rounded-lg mb-3 flex items-center justify-center">
                  <Package className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="font-semibold text-sm line-clamp-2 min-h-[40px]">{product.name}</h3>
                <div className="mt-2 flex flex-col gap-1.5 items-start">
                  <span className="font-bold text-primary text-sm">Rp {product.price.toLocaleString('id-ID')}</span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${product.stock > 10 ? 'bg-emerald-100 text-emerald-700' : product.stock > 0 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                    Stock: {product.stock}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right: Cart */}
      <div className="w-[400px] bg-white flex flex-col shadow-xl z-10">
        <div className="p-6 border-b bg-slate-50/50">
          <h2 className="text-lg font-bold flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2 text-primary" /> Current Order
          </h2>
        </div>

        <ScrollArea className="flex-1 p-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 py-20">
              <ShoppingCart className="w-12 h-12 opacity-20" />
              <p>Cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex gap-3 pb-4 border-b">
                  <div className="w-12 h-12 bg-slate-100 rounded flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold leading-tight">{item.name}</h4>
                    <div className="text-sm text-primary font-medium mt-1">Rp {item.price.toLocaleString('id-ID')}</div>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, -1)}>
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-sm w-8 text-center font-medium">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.id, 1)}>
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 ml-auto text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => removeFromCart(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="p-6 bg-slate-50 border-t space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">Customer Name (Optional)</label>
            <Input 
              placeholder="Walk-in Customer" 
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="bg-white"
            />
          </div>

          <div className="flex justify-between items-center py-2 border-y">
            <span className="text-slate-500 font-medium">Total Amount</span>
            <span className="text-3xl font-black text-primary">Rp {total.toLocaleString('id-ID')}</span>
          </div>

          <Button 
            className="w-full h-14 text-lg font-bold" 
            size="lg"
            disabled={cart.length === 0 || isCheckout}
            onClick={handleCheckout}
          >
            <CreditCard className="w-5 h-5 mr-2" />
            {isCheckout ? 'Processing...' : 'Pay Now'}
          </Button>
        </div>
      </div>
    </div>
  )
}
