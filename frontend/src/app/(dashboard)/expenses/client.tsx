'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, Loader2, Wallet, Tags } from 'lucide-react'
import { toast } from 'sonner'
import { createExpenseAction, deleteExpenseAction, createExpenseCategoryAction, deleteExpenseCategoryAction } from '@/actions/expenses'

export function ExpensesClient({ initialExpenses, initialCategories }: any) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [expenses, setExpenses] = useState(initialExpenses.data || [])
  const [categories, setCategories] = useState(initialCategories || [])
  
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Expense Form
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  // Category Form
  const [categoryName, setCategoryName] = useState('')

  // Date Filters
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '')
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '')

  const handleFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (startDate) params.set('startDate', startDate)
    else params.delete('startDate')
    if (endDate) params.set('endDate', endDate)
    else params.delete('endDate')
    params.set('page', '1')
    router.push(`/expenses?${params.toString()}`)
  }

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !description || !categoryId) return toast.error('Please fill all required fields')
    
    setIsSubmitting(true)
    try {
      const res = await createExpenseAction({
        amount: Number(amount.replace(/[^0-9]/g, '')),
        description,
        categoryId,
        date
      })
      if (res.success) {
        toast.success('Expense recorded')
        setIsExpenseDialogOpen(false)
        setAmount('')
        setDescription('')
        setCategoryId('')
        router.refresh()
      } else {
        toast.error(res.error)
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteExpense = async (id: string) => {
    if (!confirm('Delete this expense record?')) return
    try {
      const res = await deleteExpenseAction(id)
      if (res.success) {
        toast.success('Expense deleted')
        router.refresh()
      } else {
        toast.error(res.error)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryName) return toast.error('Category name is required')
    
    setIsSubmitting(true)
    try {
      const res = await createExpenseCategoryAction(categoryName)
      if (res.success) {
        toast.success('Category created')
        setCategoryName('')
        router.refresh()
      } else {
        toast.error(res.error)
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Delete this category? Ensure no expenses are attached to it.')) return
    try {
      const res = await deleteExpenseCategoryAction(id)
      if (res.success) {
        toast.success('Category deleted')
        router.refresh()
      } else {
        toast.error(res.error)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Expenses</h2>
          <p className="text-muted-foreground">Record and track operational costs.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsCategoryDialogOpen(true)}>
            <Tags className="mr-2 h-4 w-4" /> Categories
          </Button>
          <Button onClick={() => setIsExpenseDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Record Expense
          </Button>
        </div>
      </div>

      <Card className="border-slate-200">
        <CardHeader className="pb-3 border-b bg-slate-50">
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-slate-500">Start Date</Label>
              <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="h-9 w-[150px]" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-500">End Date</Label>
              <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="h-9 w-[150px]" />
            </div>
            <Button variant="secondary" className="h-9" onClick={handleFilter}>Apply Filter</Button>
            {(startDate || endDate) && (
              <Button variant="ghost" className="h-9" onClick={() => { setStartDate(''); setEndDate(''); router.push('/expenses'); }}>Clear</Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Recorded By</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
                    <Wallet className="mx-auto h-8 w-8 mb-2 text-slate-300" />
                    No expenses recorded.
                  </TableCell>
                </TableRow>
              ) : (
                expenses.map((expense: any) => (
                  <TableRow key={expense.id}>
                    <TableCell>{new Date(expense.date).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md font-medium">
                        {expense.category?.name || 'Uncategorized'}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate" title={expense.description}>{expense.description}</TableCell>
                    <TableCell>{expense.user?.name || '-'}</TableCell>
                    <TableCell className="text-right font-bold text-red-600">
                      -Rp {expense.amount.toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-red-600" onClick={() => handleDeleteExpense(expense.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Record Expense Dialog */}
      <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Record Expense</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateExpense} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c: any) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                  {categories.length === 0 && <div className="p-2 text-sm text-muted-foreground">No categories found. Create one first.</div>}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Amount (Rp)</Label>
              <Input 
                type="text" 
                inputMode="numeric" 
                placeholder="e.g. 150000"
                value={amount} 
                onChange={e => setAmount(e.target.value.replace(/[^0-9]/g, ''))} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input placeholder="e.g. Listrik bulan ini..." value={description} onChange={e => setDescription(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Record
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Manage Categories Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Expense Categories</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <form onSubmit={handleCreateCategory} className="flex gap-2">
              <Input placeholder="New category name (e.g. Utility)" value={categoryName} onChange={e => setCategoryName(e.target.value)} />
              <Button type="submit" disabled={isSubmitting}>Add</Button>
            </form>
            
            <div className="border rounded-md">
              <Table>
                <TableBody>
                  {categories.map((c: any) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 text-red-500" onClick={() => handleDeleteCategory(c.id)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {categories.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-muted-foreground">No categories yet</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
