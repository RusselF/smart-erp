'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, TrendingDown, Package, DollarSign, Wallet, CalendarDays, Download } from 'lucide-react'

export function ReportsClient({ initialProfitLoss, initialStockSummary }: any) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '')
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '')

  const handleFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (startDate) params.set('startDate', startDate)
    else params.delete('startDate')
    if (endDate) params.set('endDate', endDate)
    else params.delete('endDate')
    router.push(`/reports?${params.toString()}`)
  }

  const pl = initialProfitLoss

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Reports</h2>
        <p className="text-muted-foreground">Comprehensive overview of your business performance.</p>
      </div>

      <Tabs defaultValue="profit-loss" className="space-y-6">
        <TabsList className="bg-slate-100 border p-1 rounded-lg">
          <TabsTrigger value="profit-loss" className="rounded-md">Profit & Loss</TabsTrigger>
          <TabsTrigger value="stock-summary" className="rounded-md">Stock Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="profit-loss" className="space-y-6">
          <Card className="border-slate-200">
            <CardHeader className="pb-3 border-b bg-slate-50">
              <div className="flex flex-wrap items-end gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-500 flex items-center"><CalendarDays className="h-3 w-3 mr-1"/> Start Date</Label>
                  <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="h-9 w-[150px]" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-500 flex items-center"><CalendarDays className="h-3 w-3 mr-1"/> End Date</Label>
                  <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="h-9 w-[150px]" />
                </div>
                <Button variant="secondary" className="h-9" onClick={handleFilter}>Apply Filter</Button>
                {(startDate || endDate) && (
                  <Button variant="ghost" className="h-9" onClick={() => { setStartDate(''); setEndDate(''); router.push('/reports'); }}>Clear</Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="border-emerald-100 bg-emerald-50/50 shadow-sm">
                  <CardContent className="p-4 flex flex-col justify-between h-full space-y-2">
                    <span className="text-sm font-medium text-emerald-800 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" /> Revenue
                    </span>
                    <span className="text-2xl font-bold text-emerald-700">Rp {pl.totalRevenue.toLocaleString('id-ID')}</span>
                  </CardContent>
                </Card>
                <Card className="border-blue-100 bg-blue-50/50 shadow-sm">
                  <CardContent className="p-4 flex flex-col justify-between h-full space-y-2">
                    <span className="text-sm font-medium text-blue-800 flex items-center">
                      <Package className="h-4 w-4 mr-2" /> Purchases (Inventory)
                    </span>
                    <span className="text-2xl font-bold text-blue-700">Rp {pl.totalPurchases.toLocaleString('id-ID')}</span>
                  </CardContent>
                </Card>
                <Card className="border-red-100 bg-red-50/50 shadow-sm">
                  <CardContent className="p-4 flex flex-col justify-between h-full space-y-2">
                    <span className="text-sm font-medium text-red-800 flex items-center">
                      <Wallet className="h-4 w-4 mr-2" /> Expenses
                    </span>
                    <span className="text-2xl font-bold text-red-700">Rp {pl.totalExpenses.toLocaleString('id-ID')}</span>
                  </CardContent>
                </Card>
                <Card className="border-slate-200 shadow-sm bg-primary text-primary-foreground">
                  <CardContent className="p-4 flex flex-col justify-between h-full space-y-2">
                    <span className="text-sm font-medium flex items-center opacity-80">
                      <DollarSign className="h-4 w-4 mr-1" /> Net Profit
                    </span>
                    <span className="text-3xl font-black">Rp {pl.netProfit.toLocaleString('id-ID')}</span>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="w-1/2">Item</TableHead>
                      <TableHead className="text-right">Amount (Rp)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium text-emerald-600">Total Sales Revenue</TableCell>
                      <TableCell className="text-right font-bold text-emerald-600">{pl.totalRevenue.toLocaleString('id-ID')}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-slate-600 pl-8">Total Purchases</TableCell>
                      <TableCell className="text-right text-slate-600">({pl.totalPurchases.toLocaleString('id-ID')})</TableCell>
                    </TableRow>
                    <TableRow className="bg-slate-50">
                      <TableCell className="font-bold">Gross Profit</TableCell>
                      <TableCell className="text-right font-bold">{pl.grossProfit.toLocaleString('id-ID')}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-slate-600 pl-8">Total Operational Expenses</TableCell>
                      <TableCell className="text-right text-red-500">({pl.totalExpenses.toLocaleString('id-ID')})</TableCell>
                    </TableRow>
                    <TableRow className="bg-primary/5 border-t-2 border-primary/20">
                      <TableCell className="font-black text-lg">Net Profit</TableCell>
                      <TableCell className="text-right font-black text-lg text-primary">{pl.netProfit.toLocaleString('id-ID')}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stock-summary" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <div>
                <CardTitle>Inventory Valuation</CardTitle>
                <CardDescription>Current stock levels and their potential sales value.</CardDescription>
              </div>
              <div className="flex gap-4 text-right">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Items</p>
                  <p className="text-xl font-bold">{initialStockSummary.totals.totalItems.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Potential Value</p>
                  <p className="text-xl font-bold text-primary">Rp {initialStockSummary.totals.totalStockValue.toLocaleString('id-ID')}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="pl-6">Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Selling Price</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-right pr-6">Potential Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialStockSummary.products.map((p: any) => (
                    <TableRow key={p.id}>
                      <TableCell className="pl-6 font-medium">
                        {p.name}
                        {p.sku && <span className="block text-xs text-slate-400 font-mono mt-0.5">{p.sku}</span>}
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md font-medium">
                          {p.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">Rp {p.price.toLocaleString('id-ID')}</TableCell>
                      <TableCell className="text-right font-bold">
                        <span className={p.stock < 10 ? 'text-amber-600' : 'text-slate-700'}>{p.stock}</span>
                      </TableCell>
                      <TableCell className="text-right pr-6 font-bold text-emerald-600">Rp {p.potentialValue.toLocaleString('id-ID')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
