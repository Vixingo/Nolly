import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings,
  Store,
  LogOut
} from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'
import { Button } from '../ui/button'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Pixels', href: '/admin/pixels', icon: Settings },
  { name: 'Store Settings', href: '/admin/store-settings', icon: Store },
]

export function AdminSidebar() {
  const location = useLocation()
  const signOut = useAuthStore((state) => state.signOut)

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-4 border-b">
        <h1 className="text-xl font-bold text-gray-900">Nolly Admin</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}