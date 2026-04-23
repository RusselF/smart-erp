import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'
import { getMeAction } from '@/actions/auth'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getMeAction()

  return (
    <div className="min-h-screen relative bg-slate-50">
      <div className="hidden min-h-screen md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-white">
        <Sidebar userRole={user?.role} />
      </div>
      <main className="md:pl-72 flex flex-col min-h-screen">
        <Topbar user={user} />
        <div className="p-8 flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
