'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Package, ShoppingCart, AlertTriangle, DollarSign } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function DashboardClient({ stats }: { stats: any }) {
  if (!stats) {
    return <div className="p-6 text-center text-slate-500">Failed to load dashboard data. Please make sure the backend is running.</div>
  }

  const {
    totalRevenue,
    salesCount,
    productsInStock,
    lowStockCount,
    recentOrders,
    revenueData
  } = stats

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
      <p className="text-muted-foreground">
        Overview of your business operations.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-primary/10 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">Rp {totalRevenue.toLocaleString('id-ID')}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total lifetime revenue
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-primary/10 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales Count</CardTitle>
            <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
              <ShoppingCart className="h-4 w-4 text-sky-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{salesCount.toLocaleString('id-ID')}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Completed transactions
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-primary/10 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products in Stock</CardTitle>
            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
              <Package className="h-4 w-4 text-violet-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{productsInStock.toLocaleString('id-ID')}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total items in warehouse
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-primary/10 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${lowStockCount > 0 ? 'bg-amber-100' : 'bg-slate-100'}`}>
              <AlertTriangle className={`h-4 w-4 ${lowStockCount > 0 ? 'text-amber-600' : 'text-slate-400'}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${lowStockCount > 0 ? 'text-amber-600' : 'text-slate-800'}`}>{lowStockCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Products with stock &lt; 10
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Daily revenue for the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tickMargin={10}
                    fontSize={12}
                    className="text-slate-500"
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tickMargin={10}
                    fontSize={12}
                    tickFormatter={(value) => `Rp ${value / 1000}k`}
                    className="text-slate-500"
                  />
                  <Tooltip 
                    formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Revenue']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#10b981' }}
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>
              You made {recentOrders.length} sales recently.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 mt-2">
              {recentOrders.length === 0 ? (
                <div className="text-sm text-slate-500 text-center py-8">No recent transactions.</div>
              ) : (
                recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mr-4">
                      <ShoppingCart className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold leading-none text-slate-800">{order.customerName || 'Walk-in Customer'}</p>
                      <p className="text-xs text-slate-500 font-medium">
                        {order.orderNumber}
                      </p>
                    </div>
                    <div className="ml-auto font-bold text-emerald-600">
                      +Rp {order.totalAmount.toLocaleString('id-ID')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
