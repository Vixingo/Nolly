import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '../../lib/supabase/client'
import { Button } from '../../components/ui/button'
import { Store, Save, Upload, AlertCircle } from 'lucide-react'

const storeSettingsSchema = z.object({
  store_name: z.string().min(1, 'Store name is required'),
  store_description: z.string().optional(),
  store_logo_url: z.string().url().optional().or(z.literal('')),
  store_email: z.string().email('Invalid email address'),
  store_phone: z.string().min(1, 'Phone number is required'),
  store_address: z.string().min(1, 'Address is required'),
  store_city: z.string().min(1, 'City is required'),
  store_state: z.string().min(1, 'State is required'),
  store_zip: z.string().min(1, 'ZIP code is required'),
  store_country: z.string().min(1, 'Country is required'),
  currency: z.string().min(1, 'Currency is required'),
  timezone: z.string().min(1, 'Timezone is required'),
  facebook_url: z.string().url().optional().or(z.literal('')),
  instagram_url: z.string().url().optional().or(z.literal('')),
  twitter_url: z.string().url().optional().or(z.literal('')),
  linkedin_url: z.string().url().optional().or(z.literal('')),
  terms_of_service: z.string().optional(),
  privacy_policy: z.string().optional(),
  return_policy: z.string().optional(),
  shipping_policy: z.string().optional(),
})

type StoreSettingsForm = z.infer<typeof storeSettingsSchema>

interface StoreSettings extends StoreSettingsForm {
  id: string
  created_at: string
  updated_at: string
}

export function AdminStoreSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<StoreSettingsForm>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: {
      store_name: '',
      store_description: '',
      store_logo_url: '',
      store_email: '',
      store_phone: '',
      store_address: '',
      store_city: '',
      store_state: '',
      store_zip: '',
      store_country: 'United States',
      currency: 'USD',
      timezone: 'America/New_York',
      facebook_url: '',
      instagram_url: '',
      twitter_url: '',
      linkedin_url: '',
      terms_of_service: '',
      privacy_policy: '',
      return_policy: '',
      shipping_policy: '',
    }
  })

  useEffect(() => {
    fetchStoreSettings()
  }, [])

  const fetchStoreSettings = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setStoreSettings(data)
        reset(data)
      }
    } catch (err) {
      console.error('Error fetching store settings:', err)
      setError('Failed to load store settings')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: StoreSettingsForm) => {
    try {
      setSaving(true)
      setError(null)
      setSuccess(false)

      if (storeSettings) {
        // Update existing settings
        const { error } = await supabase
          .from('store_settings')
          .update({
            ...data,
            updated_at: new Date().toISOString()
          })
          .eq('id', storeSettings.id)

        if (error) throw error
      } else {
        // Create new settings
        const { error } = await supabase
          .from('store_settings')
          .insert({
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (error) throw error
      }

      setSuccess(true)
      await fetchStoreSettings()
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Error saving store settings:', err)
      setError('Failed to save store settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Store className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Store Settings</h1>
        </div>
        <p className="text-gray-600">
          Manage your store information, contact details, and policies
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <span className="text-green-700">Store settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Store Name *
              </label>
              <input
                {...register('store_name')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your Store Name"
              />
              {errors.store_name && (
                <p className="text-red-600 text-sm mt-1">{errors.store_name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Store Logo URL
              </label>
              <input
                {...register('store_logo_url')}
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/logo.png"
              />
              {errors.store_logo_url && (
                <p className="text-red-600 text-sm mt-1">{errors.store_logo_url.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Store Description
              </label>
              <textarea
                {...register('store_description')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief description of your store..."
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                {...register('store_email')}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="store@example.com"
              />
              {errors.store_email && (
                <p className="text-red-600 text-sm mt-1">{errors.store_email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                {...register('store_phone')}
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+1 (555) 123-4567"
              />
              {errors.store_phone && (
                <p className="text-red-600 text-sm mt-1">{errors.store_phone.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address *
              </label>
              <input
                {...register('store_address')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="123 Main Street"
              />
              {errors.store_address && (
                <p className="text-red-600 text-sm mt-1">{errors.store_address.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                {...register('store_city')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="New York"
              />
              {errors.store_city && (
                <p className="text-red-600 text-sm mt-1">{errors.store_city.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State/Province *
              </label>
              <input
                {...register('store_state')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="NY"
              />
              {errors.store_state && (
                <p className="text-red-600 text-sm mt-1">{errors.store_state.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP/Postal Code *
              </label>
              <input
                {...register('store_zip')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="10001"
              />
              {errors.store_zip && (
                <p className="text-red-600 text-sm mt-1">{errors.store_zip.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country *
              </label>
              <select
                {...register('store_country')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Other">Other</option>
              </select>
              {errors.store_country && (
                <p className="text-red-600 text-sm mt-1">{errors.store_country.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Business Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency *
              </label>
              <select
                {...register('currency')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="AUD">AUD - Australian Dollar</option>
              </select>
              {errors.currency && (
                <p className="text-red-600 text-sm mt-1">{errors.currency.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timezone *
              </label>
              <select
                {...register('timezone')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Paris">Paris (CET)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
                <option value="Australia/Sydney">Sydney (AEST)</option>
              </select>
              {errors.timezone && (
                <p className="text-red-600 text-sm mt-1">{errors.timezone.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Social Media Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facebook URL
              </label>
              <input
                {...register('facebook_url')}
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://facebook.com/yourstore"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram URL
              </label>
              <input
                {...register('instagram_url')}
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://instagram.com/yourstore"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Twitter URL
              </label>
              <input
                {...register('twitter_url')}
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://twitter.com/yourstore"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn URL
              </label>
              <input
                {...register('linkedin_url')}
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://linkedin.com/company/yourstore"
              />
            </div>
          </div>
        </div>

        {/* Policies */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Store Policies</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Terms of Service
              </label>
              <textarea
                {...register('terms_of_service')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your terms of service..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Privacy Policy
              </label>
              <textarea
                {...register('privacy_policy')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your privacy policy..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Return Policy
              </label>
              <textarea
                {...register('return_policy')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your return policy..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shipping Policy
              </label>
              <textarea
                {...register('shipping_policy')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your shipping policy..."
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={saving}
            className="px-6 py-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}