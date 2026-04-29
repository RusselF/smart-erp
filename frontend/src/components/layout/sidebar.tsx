'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, Store, LogOut, Truck, ClipboardList } from 'lucide-react'
import { logoutAction } from '@/actions/auth'

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: 'text-sky-500',
    restricted: true,
  },
  {
    label: 'Point of Sales',
    icon: Store,
    href: '/pos',
    color: 'text-orange-500',
  },
  {
    label: 'Inventory',
    icon: Package,
    href: '/inventory',
    color: 'text-violet-500',
  },
  {
    label: 'Sales History',
    icon: ShoppingCart,
    href: '/sales',
    color: 'text-pink-700',
  },
  {
    label: 'Users',
    icon: Users,
    href: '/users',
    color: 'text-emerald-500',
    restricted: true,
  },
  {
    label: 'Suppliers',
    icon: Truck,
    href: '/suppliers',
    color: 'text-teal-500',
    restricted: true,
  },
  {
    label: 'Purchasing',
    icon: ClipboardList,
    href: '/purchasing',
    color: 'text-cyan-600',
    restricted: true,
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/settings',
    color: 'text-gray-500',
    restricted: true,
  },
]

export function Sidebar({ userRole }: { userRole?: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await logoutAction()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-white border-r shadow-sm" suppressHydrationWarning>
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center mr-3">
            <LayoutDashboard className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Smart ERP
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => {
            if (route.restricted && userRole === 'STAFF') return null
            
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/5 rounded-lg transition-colors',
                  pathname === route.href ? 'text-primary bg-primary/10' : 'text-slate-600'
                )}
              >
                <div className="flex items-center flex-1">
                  <route.icon className={cn('h-5 w-5 mr-3', route.color)} />
                  {route.label}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
      <div className="px-3 py-2 border-t mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  )
}
