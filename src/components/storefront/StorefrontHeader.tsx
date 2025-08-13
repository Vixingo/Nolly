import { Link } from 'react-router-dom'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '../../store/useCartStore'
import { Button } from '../ui/button'

export function StorefrontHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const totalItems = useCartStore((state) => state.getTotalItems())

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">Nolly</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Products
            </Link>
          </nav>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <Button variant="outline" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <Link
                to="/"
                className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-gray-700 hover:text-gray-900 block px-3 py-2 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}