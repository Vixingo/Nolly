export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
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
          is_featured: boolean
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          image_url?: string | null
          category?: string | null
          stock_quantity?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          is_featured?: boolean
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          image_url?: string | null
          category?: string | null
          stock_quantity?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
          is_featured?: boolean
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          customer_name: string
          customer_phone: string
          customer_address: string
          total_amount: number
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_name: string
          customer_phone: string
          customer_address: string
          total_amount: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_name?: string
          customer_phone?: string
          customer_address?: string
          total_amount?: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_items_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          }
        ]
      }
      admin_users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      store_settings: {
        Row: {
          id: string
          store_name: string
          store_description: string | null
          store_logo_url: string | null
          store_email: string
          store_phone: string
          store_address: string
          store_city: string
          store_state: string
          store_zip: string
          store_country: string
          currency: string
          timezone: string
          facebook_url: string | null
          instagram_url: string | null
          twitter_url: string | null
          linkedin_url: string | null
          terms_of_service: string | null
          privacy_policy: string | null
          return_policy: string | null
          shipping_policy: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          store_name: string
          store_description?: string | null
          store_logo_url?: string | null
          store_email: string
          store_phone: string
          store_address: string
          store_city: string
          store_state: string
          store_zip: string
          store_country: string
          currency: string
          timezone: string
          facebook_url?: string | null
          instagram_url?: string | null
          twitter_url?: string | null
          linkedin_url?: string | null
          terms_of_service?: string | null
          privacy_policy?: string | null
          return_policy?: string | null
          shipping_policy?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          store_name?: string
          store_description?: string | null
          store_logo_url?: string | null
          store_email?: string
          store_phone?: string
          store_address?: string
          store_city?: string
          store_state?: string
          store_zip?: string
          store_country?: string
          currency?: string
          timezone?: string
          facebook_url?: string | null
          instagram_url?: string | null
          twitter_url?: string | null
          linkedin_url?: string | null
          terms_of_service?: string | null
          privacy_policy?: string | null
          return_policy?: string | null
          shipping_policy?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}