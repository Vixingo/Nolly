import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCartStore } from '../../store/useCartStore'
import { Button } from '../../components/ui/button'

export function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore()
  const totalPrice = getTotalPrice()

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity)
  }

  const handleRemoveItem = (productId: string) => {
    removeItem(productId)
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
          <Link to="/products">
            <Button size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-4">
                {/* Product Image */}
                <img
                  src={item.product.image_url || '/placeholder-product.jpg'}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />

                {/* Product Info */}
                <div className="flex-1">
                  <Link
                    to={`/products/${item.product.id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                  >
                    {item.product.name}
                  </Link>
                  {item.product.category && (
                    <p className="text-sm text-gray-500">{item.product.category}</p>
                  )}
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    ${item.product.price.toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-medium w-12 text-center">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock_quantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Item Total */}
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Remove Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveItem(item.product.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link to="/checkout" className="block">
                <Button size="lg" className="w-full">
                  Proceed to Checkout
                </Button>
              </Link>
              <Link to="/products" className="block">
                <Button variant="outline" size="lg" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}