import { getSettings } from '@/actions/settings'
import { SettingsClient } from './client'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const settings = await getSettings()
  
  return <SettingsClient initialSettings={settings} />
}
