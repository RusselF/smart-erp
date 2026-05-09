'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, Store, LogOut, Truck, ClipboardList, Wallet, BarChart3 } from 'lucide-react'
import { logoutAction } from '@/actions/auth'

const routeGroups = [
  {
    title: 'Main Menu',
    routes: [
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
    ]
  },
  {
    title: 'Operations',
    routes: [
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
        label: 'Purchasing',
        icon: ClipboardList,
        href: '/purchasing',
        color: 'text-cyan-600',
        restricted: true,
      },
      {
        label: 'Suppliers',
        icon: Truck,
        href: '/suppliers',
        color: 'text-teal-500',
        restricted: true,
      },
    ]
  },
  {
    title: 'Finance & Analytics',
    routes: [
      {
        label: 'Expenses',
        icon: Wallet,
        href: '/expenses',
        color: 'text-rose-500',
        restricted: true,
      },
      {
        label: 'Reports',
        icon: BarChart3,
        href: '/reports',
        color: 'text-indigo-500',
        restricted: true,
      },
    ]
  },
  {
    title: 'Administration',
    routes: [
      {
        label: 'Users',
        icon: Users,
        href: '/users',
        color: 'text-emerald-500',
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
  }
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
      <div className="px-3 py-2 flex-1 overflow-y-auto">
        <Link href="/dashboard" className="flex items-center pl-3 mb-10">
          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center mr-3 shrink-0">
            <LayoutDashboard className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Smart ERP
          </h1>
        </Link>
        
        <div className="space-y-6">
          {routeGroups.map((group) => {
            // Filter restricted routes for STAFF
            const visibleRoutes = group.routes.filter(
              (route) => !(route.restricted && userRole === 'STAFF')
            )

            if (visibleRoutes.length === 0) return null

            return (
              <div key={group.title} className="space-y-1">
                <h4 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  {group.title}
                </h4>
                {visibleRoutes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      'text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/5 rounded-lg transition-colors',
                      pathname === route.href ? 'text-primary bg-primary/10' : 'text-slate-600'
                    )}
                  >
                    <div className="flex items-center flex-1">
                      <route.icon className={cn('h-5 w-5 mr-3 shrink-0', route.color)} />
                      {route.label}
                    </div>
                  </Link>
                ))}
              </div>
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
