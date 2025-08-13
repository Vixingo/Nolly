import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AdminUser } from '../types'
import { supabase } from '../lib/supabase/client'

interface AuthStore {
  user: AdminUser | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthStore>()
  (persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      
      signIn: async (email: string, password: string) => {
        set({ isLoading: true })
        
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          })
          
          if (error) {
            set({ isLoading: false })
            return { success: false, error: error.message }
          }
          
          if (data.user) {
            // Check if user is admin
            const { data: adminUser, error: adminError } = await supabase
              .from('admin_users')
              .select('*')
              .eq('email', email)
              .single()
            
            if (adminError || !adminUser) {
              await supabase.auth.signOut()
              set({ isLoading: false })
              return { success: false, error: 'Unauthorized: Admin access required' }
            }
            
            set({ user: adminUser, isLoading: false })
            return { success: true }
          }
          
          set({ isLoading: false })
          return { success: false, error: 'Authentication failed' }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: 'An unexpected error occurred' }
        }
      },
      
      signUp: async (email: string, password: string) => {
        set({ isLoading: true })
        
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password
          })
          
          if (error) {
            set({ isLoading: false })
            return { success: false, error: error.message }
          }
          
          if (data.user) {
            // Create admin user record
            const { error: adminError } = await supabase
              .from('admin_users')
              .insert({
                id: data.user.id,
                email: data.user.email!
              })
            
            if (adminError) {
              set({ isLoading: false })
              return { success: false, error: 'Failed to create admin user' }
            }
            
            set({ isLoading: false })
            return { success: true }
          }
          
          set({ isLoading: false })
          return { success: false, error: 'Registration failed' }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: 'An unexpected error occurred' }
        }
      },
      
      signOut: async () => {
        await supabase.auth.signOut()
        set({ user: null })
      },
      
      checkAuth: async () => {
        set({ isLoading: true })
        
        try {
          const { data: { user } } = await supabase.auth.getUser()
          
          if (user) {
            const { data: adminUser, error } = await supabase
              .from('admin_users')
              .select('*')
              .eq('email', user.email!)
              .single()
            
            if (!error && adminUser) {
              set({ user: adminUser, isLoading: false })
              return
            }
          }
          
          set({ user: null, isLoading: false })
        } catch (error) {
          set({ user: null, isLoading: false })
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state: AuthStore) => ({ user: state.user })
    }
  ))