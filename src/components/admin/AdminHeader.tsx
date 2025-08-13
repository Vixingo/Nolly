import { useAuthStore } from '../../store/useAuthStore'
import { Bell, User } from 'lucide-react'
import { Button } from '../ui/button'

export function AdminHeader() {
  const user = useAuthStore((state) => state.user)

  return (
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Welcome back, Admin
          </h2>
          <p className="text-sm text-gray-600">
            Manage your store from this dashboard
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4" />
          </Button>

          {/* User Info */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">
              {user?.email}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}