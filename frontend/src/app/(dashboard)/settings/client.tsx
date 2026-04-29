'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { updateSettingsAction } from '@/actions/settings'
import { toast } from 'sonner'
import { Save, Store, Bell, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function SettingsClient({ initialSettings }: { initialSettings: Record<string, string> }) {
  const [settings, setSettings] = useState(initialSettings)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const res = await updateSettingsAction(settings)
      if (res.success) {
        toast.success('Settings updated successfully')
        router.refresh()
      } else {
        toast.error(res.error || 'Failed to update settings')
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h2>
        <p className="text-muted-foreground">Manage your store preferences and system configuration.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              <CardTitle>Store Information</CardTitle>
            </div>
            <CardDescription>Public details about your business.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input 
                id="storeName" 
                placeholder="Smart ERP Store" 
                value={settings.storeName || ''} 
                onChange={e => handleChange('storeName', e.target.value)} 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storePhone">Phone Number</Label>
                <Input 
                  id="storePhone" 
                  placeholder="+62 812 3456 7890" 
                  value={settings.storePhone || ''} 
                  onChange={e => handleChange('storePhone', e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeEmail">Email Address</Label>
                <Input 
                  id="storeEmail" 
                  type="email"
                  placeholder="contact@store.com" 
                  value={settings.storeEmail || ''} 
                  onChange={e => handleChange('storeEmail', e.target.value)} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="storeAddress">Store Address</Label>
              <Input 
                id="storeAddress" 
                placeholder="Jl. Jendral Sudirman No. 1, Jakarta" 
                value={settings.storeAddress || ''} 
                onChange={e => handleChange('storeAddress', e.target.value)} 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-amber-500" />
              <CardTitle>Inventory Alerts</CardTitle>
            </div>
            <CardDescription>Configure when the system should warn you about low stock.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-w-sm">
              <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
              <div className="flex items-center gap-3">
                <Input 
                  id="lowStockThreshold" 
                  type="number"
                  min="1"
                  className="w-24"
                  value={settings.lowStockThreshold || '10'} 
                  onChange={e => handleChange('lowStockThreshold', e.target.value)} 
                />
                <span className="text-sm text-slate-500">items remaining</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} size="lg">
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
