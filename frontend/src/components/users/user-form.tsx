'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createUserAction, updateUserAction } from '@/actions/users'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().optional().or(z.literal('')),
  role: z.enum(['ADMIN', 'OWNER', 'STAFF']),
})

interface UserFormProps {
  initialData?: any
  onSuccess: () => void
}

export function UserForm({ initialData, onSuccess }: UserFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      password: '',
      role: initialData?.role || 'STAFF',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      if (initialData) {
        const updateData: any = {
          name: values.name,
          email: values.email,
          role: values.role
        }
        if (values.password && values.password.length >= 6) {
          updateData.password = values.password
        } else if (values.password && values.password.length > 0 && values.password.length < 6) {
            toast.error('Password must be at least 6 characters')
            setIsLoading(false)
            return
        }
        await updateUserAction(initialData.id, updateData)
        toast.success('User updated successfully')
      } else {
        if (!values.password || values.password.length < 6) {
          toast.error('Password is required and must be at least 6 characters')
          setIsLoading(false)
          return
        }
        await createUserAction(values)
        toast.success('User created successfully')
      }
      onSuccess()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{initialData ? 'New Password (Leave blank to keep current)' : 'Password'}</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" disabled={isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select disabled={isLoading} onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="STAFF">STAFF (Kasir)</SelectItem>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                  <SelectItem value="OWNER">OWNER</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : initialData ? (
            'Update User'
          ) : (
            'Create User'
          )}
        </Button>
      </form>
    </Form>
  )
}
