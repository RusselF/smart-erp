'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Menu, LogOut } from 'lucide-react'
import { logoutAction } from '@/actions/auth'
import { useRouter } from 'next/navigation'

interface TopbarProps {
  user: {
    name: string
    email: string
    role: string
  } | null
}

export function Topbar({ user }: TopbarProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await logoutAction()
    router.push('/login')
  }

  return (
    <header className="h-16 border-b bg-white shadow-sm flex items-center px-6 justify-between lg:justify-end">
      {/* Mobile Menu Trigger Placeholder (Normally hidden on Desktop) */}
      <Button variant="ghost" size="icon" className="lg:hidden">
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="relative h-10 w-10 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer">
            <Avatar className="h-10 w-10 border border-slate-200">
              <AvatarFallback className="bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || 'user@example.com'}
                </p>
                <div className="mt-2 text-[10px] uppercase font-bold tracking-wider text-primary">
                  {user?.role || 'Role'}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}