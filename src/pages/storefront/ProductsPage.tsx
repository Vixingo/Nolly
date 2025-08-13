import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Search } from 'lucide-react'
import { supabase } from '../../lib/supabase/client'
import type { Product } from '../../types'
import { useCartStore } from '../../store/useCartStore'
import { Button } from '../../components/ui/button'

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))]

  const handleAddToCart = (product: Product) => {
    addItem(product, 1)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Products</h1>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category || ''}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <Link to={`/products/${product.id}`}>
                <div className="aspect-w-1 aspect-h-1 w-full">
                  <img
                    src={product.image_url || '/placeholder-product.jpg'}
                    alt={product.name}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-200"
                  />
                </div>
              </Link>
              
              <div className="p-4">
                <Link to={`/products/${product.id}`}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                
                {product.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock_quantity === 0}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add to Cart
                  </Button>
                </div>
                
                {product.stock_quantity === 0 && (
                  <p className="text-red-500 text-sm mt-2">Out of Stock</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}