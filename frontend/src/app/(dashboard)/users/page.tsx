import { getUsersAction } from '@/actions/users'
import { UsersClient } from './client'

export const dynamic = 'force-dynamic'

export default async function UsersPage() {
  try {
    const users = await getUsersAction()
    return <UsersClient initialUsers={users} />
  } catch (error: any) {
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 rounded-md border border-red-200 mt-8 max-w-xl mx-auto">
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p>{error.message}</p>
      </div>
    )
  }
}
