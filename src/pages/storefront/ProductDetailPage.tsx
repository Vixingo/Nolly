import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-react'
import { supabase } from '../../lib/supabase/client'
import type { Product } from '../../types'
import { useCartStore } from '../../store/useCartStore'
import { Button } from '../../components/ui/button'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    if (id) {
      fetchProduct(id)
    }
  }, [id])

  const fetchProduct = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .eq('is_active', true)
        .single()

      if (error) throw error
      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity)
      // Reset quantity after adding to cart
      setQuantity(1)
    }
  }

  const incrementQuantity = () => {
    if (product && quantity < product.stock_quantity) {
      setQuantity(prev => prev + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
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

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link to="/products">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link to="/products" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-w-1 aspect-h-1">
          <img
            src={product.image_url || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            {product.category && (
              <p className="text-sm text-gray-500 uppercase tracking-wide">{product.category}</p>
            )}
          </div>

          <div className="text-3xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </div>

          {product.description && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Stock Status */}
          <div>
            {product.stock_quantity > 0 ? (
              <p className="text-green-600 font-medium">
                In Stock ({product.stock_quantity} available)
              </p>
            ) : (
              <p className="text-red-600 font-medium">Out of Stock</p>
            )}
          </div>

          {/* Quantity Selector */}
          {product.stock_quantity > 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock_quantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}