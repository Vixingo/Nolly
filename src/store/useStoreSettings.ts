import { create } from 'zustand'
import { supabase } from '../lib/supabase/client'
import type { Database } from '../types/database'

type StoreSettings = Database['public']['Tables']['store_settings']['Row']

interface StoreSettingsState {
  settings: StoreSettings | null
  isLoading: boolean
  error: string | null
  fetchSettings: () => Promise<void>
}

export const useStoreSettings = create<StoreSettingsState>()((set) => ({
  settings: null,
  isLoading: false,
  error: null,

  fetchSettings: async () => {
    try {
      set({ isLoading: true, error: null })

      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .single()

      if (error) throw error

      set({ settings: data, isLoading: false })
    } catch (err) {
      console.error('Error fetching store settings:', err)
      set({ 
        error: 'Failed to load store settings', 
        isLoading: false 
      })
    }
  },
}))