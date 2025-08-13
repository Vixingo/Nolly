import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '../../lib/supabase/client'
import { useCartStore } from '../../store/useCartStore'
import { Button } from '../../components/ui/button'
import type { CheckoutForm } from '../../types'

const checkoutSchema = z.object({
  customer_name: z.string().min(2, 'Name must be at least 2 characters'),
  customer_phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  customer_address: z.string().min(10, 'Address must be at least 10 characters')
})

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const totalPrice = getTotalPrice()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema)
  })

  const onSubmit = async (data: CheckoutForm) => {
    if (items.length === 0) {
      alert('Your cart is empty')
      return
    }

    setIsSubmitting(true)

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: data.customer_name,
          customer_phone: data.customer_phone,
          customer_address: data.customer_address,
          total_amount: totalPrice,
          status: 'pending'
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      // Update product stock
      for (const item of items) {
        const { error: stockError } = await supabase
          .from('products')
          .update({
            stock_quantity: item.product.stock_quantity - item.quantity
          })
          .eq('id', item.product.id)

        if (stockError) throw stockError
      }

      // Clear cart and redirect
      clearCart()
      navigate('/thank-you', { state: { orderId: order.id } })
    } catch (error) {
      console.error('Error creating order:', error)
      alert('There was an error processing your order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some items to your cart before checking out</p>
          <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Information</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="customer_name"
                {...register('customer_name')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
              {errors.customer_name && (
                <p className="text-red-500 text-sm mt-1">{errors.customer_name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="customer_phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="customer_phone"
                {...register('customer_phone')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your phone number"
              />
              {errors.customer_phone && (
                <p className="text-red-500 text-sm mt-1">{errors.customer_phone.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="customer_address" className="block text-sm font-medium text-gray-700 mb-2">
                Shipping Address *
              </label>
              <textarea
                id="customer_address"
                {...register('customer_address')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your complete shipping address"
              />
              {errors.customer_address && (
                <p className="text-red-500 text-sm mt-1">{errors.customer_address.message}</p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : `Place Order - $${totalPrice.toFixed(2)}`}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.product.id} className="flex items-center space-x-4">
                <img
                  src={item.product.image_url || '/placeholder-product.jpg'}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}