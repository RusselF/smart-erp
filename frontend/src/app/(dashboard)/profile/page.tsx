import { getMeAction } from '@/actions/auth'
import { ProfileClient } from './client'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'My Profile - Smart ERP',
}

export default async function ProfilePage() {
  const user = await getMeAction()

  if (!user) {
    redirect('/login')
  }

  return <ProfileClient user={user} />
}
