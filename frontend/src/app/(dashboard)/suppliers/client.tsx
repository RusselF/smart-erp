'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Edit2, Trash2, Building2 } from 'lucide-react'
import { SupplierForm } from '@/components/purchasing/supplier-form'
import { deleteSupplierAction } from '@/actions/purchasing'
import { toast } from 'sonner'

export function SuppliersClient({ initialSuppliers }: { initialSuppliers: any[] }) {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<any>(null)

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this supplier?')) {
      try {
        await deleteSupplierAction(id)
        toast.success('Supplier deleted')
        router.refresh()
      } catch (error: any) {
        toast.error(error.message)
      }
    }
  }

  const handleOpenDialog = (supplier = null) => {
    setEditingSupplier(supplier)
    setIsDialogOpen(true)
  }

  const handleSuccess = () => {
    setIsDialogOpen(false)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Suppliers</h2>
          <p className="text-muted-foreground">Manage your product suppliers and vendors.</p>
        </div>
        <Button onClick={() => handleOpenDialog(null)}>
          <Plus className="mr-2 h-4 w-4" /> Add Supplier
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</DialogTitle>
            </DialogHeader>
            <SupplierForm initialData={editingSupplier} onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-md shadow-sm border mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-center">POs</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialSuppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-32 text-muted-foreground">
                  <Building2 className="mx-auto h-8 w-8 mb-2 text-slate-300" />
                  No suppliers yet. Add your first supplier.
                </TableCell>
              </TableRow>
            ) : (
              initialSuppliers.map((supplier: any) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>{supplier.contactPerson || '-'}</TableCell>
                  <TableCell>{supplier.phone || '-'}</TableCell>
                  <TableCell>{supplier.email || '-'}</TableCell>
                  <TableCell className="text-center">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                      {supplier._count?.purchaseOrders || 0}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(supplier)}>
                        <Edit2 className="h-4 w-4 text-slate-600" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(supplier.id)}>
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
    </div>
  )
}
