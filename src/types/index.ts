export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  category: string | null
  stock_quantity: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  customer_name: string
  customer_phone: string
  customer_address: string
  total_amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product?: Product
  quantity: number
  price: number
  created_at: string
}

export interface CheckoutForm {
  customer_name: string
  customer_phone: string
  customer_address: string
}

export interface AdminUser {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  totalProducts: number
  pendingOrders: number
}