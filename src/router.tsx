import { createBrowserRouter, Navigate } from 'react-router-dom'
import { StorefrontLayout } from './components/storefront/StorefrontLayout'
import { AdminLayout } from './components/admin/AdminLayout'
import { ProtectedRoute } from './components/shared/ProtectedRoute'

// Storefront Pages
import { HomePage } from './pages/storefront/HomePage'
import { ProductsPage } from './pages/storefront/ProductsPage'
import { ProductDetailPage } from './pages/storefront/ProductDetailPage'
import { CartPage } from './pages/storefront/CartPage'
import { CheckoutPage } from './pages/storefront/CheckoutPage'
import { ThankYouPage } from './pages/storefront/ThankYouPage'

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminProductsPage } from './pages/admin/AdminProductsPage'
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage'
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage'
import { AdminPixelsPage } from './pages/admin/AdminPixelsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <StorefrontLayout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'products',
        element: <ProductsPage />
      },
      {
        path: 'products/:id',
        element: <ProductDetailPage />
      },
      {
        path: 'cart',
        element: <CartPage />
      },
      {
        path: 'checkout',
        element: <CheckoutPage />
      },
      {
        path: 'thank-you',
        element: <ThankYouPage />
      }
    ]
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <AdminDashboardPage />
      },
      {
        path: 'products',
        element: <AdminProductsPage />
      },
      {
        path: 'orders',
        element: <AdminOrdersPage />
      },
      {
        path: 'analytics',
        element: <AdminAnalyticsPage />
      },
      {
        path: 'pixels',
        element: <AdminPixelsPage />
      }
    ]
  }
])