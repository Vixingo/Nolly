import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { StorefrontHeader } from './StorefrontHeader'
import { StorefrontFooter } from './StorefrontFooter'
import { useStoreSettings } from '../../store/useStoreSettings'

export function StorefrontLayout() {
  const { fetchSettings } = useStoreSettings()

  useEffect(() => {
    fetchSettings()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <StorefrontHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <StorefrontFooter />
    </div>
  )
}