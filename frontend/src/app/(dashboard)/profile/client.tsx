'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, User, Lock, Mail, ShieldAlert } from 'lucide-react'
import { updateProfileAction } from '@/actions/auth'

export function ProfileClient({ user }: { user: any }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password && password !== confirmPassword) {
      return toast.error('Passwords do not match')
    }

    setIsLoading(true)
    try {
      const data: any = { name }
      if (password) {
        data.password = password
      }

      const res = await updateProfileAction(data)
      if (res.success) {
        toast.success('Profile updated successfully')
        setPassword('')
        setConfirmPassword('')
        router.refresh()
      } else {
        toast.error(res.error || 'Failed to update profile')
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
        <p className="text-muted-foreground">Manage your account settings and change your password.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your personal details and system role.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                  <Input value={user?.email || ''} disabled className="pl-9 bg-slate-50 text-slate-500" />
                </div>
                <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
              </div>
              <div className="space-y-2">
                <Label>System Role</Label>
                <div className="relative">
                  <ShieldAlert className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                  <Input value={user?.role || ''} disabled className="pl-9 bg-slate-50 text-slate-500 font-semibold" />
                </div>
                <p className="text-xs text-muted-foreground">Your access level in the system.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Update Profile</CardTitle>
            <CardDescription>Change your display name or update your password.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2 max-w-md">
                <Label>Display Name</Label>
                <div className="relative">
                  <User className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                  <Input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="pl-9" 
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t mt-6">
                <h4 className="text-sm font-medium mb-4 flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input 
                      type="password" 
                      placeholder="Leave blank to keep current" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm New Password</Label>
                    <Input 
                      type="password" 
                      placeholder="Confirm new password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
