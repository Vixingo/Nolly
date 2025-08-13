import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}