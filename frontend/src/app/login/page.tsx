'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { loginAction } from '@/actions/auth'
import { Building2, KeyRound } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const result = await loginAction(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else if (result?.success) {
      router.push('/dashboard') 
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
      </div>
      
      <Card className="w-full max-w-md shadow-xl border-primary/10 z-10 mx-4 backdrop-blur-sm bg-white/90 dark:bg-slate-950/90">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-2 mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-center">Smart ERP</CardTitle>
          <CardDescription className="text-center">Authentication Required</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@erp.com"
                required
                className="transition-colors focus-visible:ring-primary/40"
                autoComplete="email"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="transition-colors focus-visible:ring-primary/40"
                autoComplete="current-password"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 mt-2">
            <Button className="w-full text-md h-11" type="submit" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-background border-t-foreground animate-spin"></div>
                  Verifying Identity...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <KeyRound className="w-4 h-4" />
                  Sign In
                </div>
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Secured with JWT and HttpOnly Cookies
            </p>
          </CardFooter>
        </form>
      </Card>
      
       <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
         <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
       </div>
    </div>
  )
}
