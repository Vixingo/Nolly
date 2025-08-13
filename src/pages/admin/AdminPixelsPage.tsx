import { useState, useEffect } from 'react'
import { Eye, EyeOff, Save, RefreshCw } from 'lucide-react'
import { Button } from '../../components/ui/button'

// Type declarations for global tracking scripts
interface FbqFunction {
  (...args: any[]): void
  q?: any[]
}

declare global {
  interface Window {
    fbq?: FbqFunction
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}

interface PixelSettings {
  facebookPixelId: string
  facebookPixelEnabled: boolean
  googleAnalyticsId: string
  googleAnalyticsEnabled: boolean
  googleTagManagerId: string
  googleTagManagerEnabled: boolean
}

export function AdminPixelsPage() {
  const [settings, setSettings] = useState<PixelSettings>({
    facebookPixelId: '',
    facebookPixelEnabled: false,
    googleAnalyticsId: '',
    googleAnalyticsEnabled: false,
    googleTagManagerId: '',
    googleTagManagerEnabled: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showIds, setShowIds] = useState({
    facebook: false,
    analytics: false,
    tagManager: false
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    setIsLoading(true)
    // Load from localStorage (in a real app, this would be from your backend)
    const savedSettings = localStorage.getItem('pixelSettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
    setIsLoading(false)
  }

  const saveSettings = async () => {
    setIsSaving(true)
    try {
      // Save to localStorage (in a real app, this would be to your backend)
      localStorage.setItem('pixelSettings', JSON.stringify(settings))
      
      // Update environment variables or global state here
      if (typeof window !== 'undefined') {
        // Update Facebook Pixel
        if (settings.facebookPixelEnabled && settings.facebookPixelId) {
          if (!window.fbq) {
            const fbqFunc = function(...args: any[]) {
              (fbqFunc.q = fbqFunc.q || []).push(args)
            } as any
            fbqFunc.q = []
            window.fbq = fbqFunc
          }
          window.fbq!('init', settings.facebookPixelId)
        }
        
        // Update Google Analytics
        if (settings.googleAnalyticsEnabled && settings.googleAnalyticsId) {
          if (!window.gtag) {
            window.dataLayer = window.dataLayer || []
            window.gtag = function(...args: any[]) {
              window.dataLayer!.push(args)
            }
          }
          window.gtag('config', settings.googleAnalyticsId)
        }
      }
      
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const testPixel = (type: 'facebook' | 'google') => {
    if (type === 'facebook' && settings.facebookPixelEnabled && settings.facebookPixelId) {
      // Test Facebook Pixel
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'PageView')
        alert('Facebook Pixel test event sent!')
      } else {
        alert('Facebook Pixel not loaded. Please save settings first.')
      }
    } else if (type === 'google' && settings.googleAnalyticsEnabled && settings.googleAnalyticsId) {
      // Test Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'test_event', {
          event_category: 'admin_test',
          event_label: 'pixel_test'
        })
        alert('Google Analytics test event sent!')
      } else {
        alert('Google Analytics not loaded. Please save settings first.')
      }
    } else {
      alert('Please enable and configure the pixel first.')
    }
  }

  const maskId = (id: string, show: boolean) => {
    if (!id || show) return id
    if (id.length <= 8) return '*'.repeat(id.length)
    return id.substring(0, 4) + '*'.repeat(id.length - 8) + id.substring(id.length - 4)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Tracking Pixels</h1>
        <div className="flex space-x-3">
          <Button
            onClick={loadSettings}
            variant="outline"
            className="flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={saveSettings}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Important Notice</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>These tracking pixels will be automatically loaded on your storefront when enabled. Make sure to comply with privacy regulations (GDPR, CCPA) and have proper consent mechanisms in place.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Facebook Pixel */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Facebook Pixel</h2>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="facebookEnabled"
                checked={settings.facebookPixelEnabled}
                onChange={(e) => setSettings({ ...settings, facebookPixelEnabled: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="facebookEnabled" className="ml-2 text-sm text-gray-700">
                Enable
              </label>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facebook Pixel ID
              </label>
              <div className="relative">
                <input
                  type={showIds.facebook ? 'text' : 'password'}
                  value={showIds.facebook ? settings.facebookPixelId : maskId(settings.facebookPixelId, showIds.facebook)}
                  onChange={(e) => setSettings({ ...settings, facebookPixelId: e.target.value })}
                  placeholder="Enter your Facebook Pixel ID"
                  className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowIds({ ...showIds, facebook: !showIds.facebook })}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showIds.facebook ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">What this tracks:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Page views</li>
                <li>• Add to cart events</li>
                <li>• Purchase events</li>
                <li>• Custom conversions</li>
              </ul>
            </div>
            
            <Button
              onClick={() => testPixel('facebook')}
              variant="outline"
              className="w-full"
              disabled={!settings.facebookPixelEnabled || !settings.facebookPixelId}
            >
              Test Facebook Pixel
            </Button>
          </div>
        </div>

        {/* Google Analytics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Google Analytics</h2>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="analyticsEnabled"
                checked={settings.googleAnalyticsEnabled}
                onChange={(e) => setSettings({ ...settings, googleAnalyticsEnabled: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="analyticsEnabled" className="ml-2 text-sm text-gray-700">
                Enable
              </label>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Analytics ID (GA4)
              </label>
              <div className="relative">
                <input
                  type={showIds.analytics ? 'text' : 'password'}
                  value={showIds.analytics ? settings.googleAnalyticsId : maskId(settings.googleAnalyticsId, showIds.analytics)}
                  onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                  className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowIds({ ...showIds, analytics: !showIds.analytics })}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showIds.analytics ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">What this tracks:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Page views and sessions</li>
                <li>• E-commerce events</li>
                <li>• User behavior</li>
                <li>• Conversion tracking</li>
              </ul>
            </div>
            
            <Button
              onClick={() => testPixel('google')}
              variant="outline"
              className="w-full"
              disabled={!settings.googleAnalyticsEnabled || !settings.googleAnalyticsId}
            >
              Test Google Analytics
            </Button>
          </div>
        </div>
      </div>

      {/* Google Tag Manager */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Google Tag Manager</h2>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="tagManagerEnabled"
              checked={settings.googleTagManagerEnabled}
              onChange={(e) => setSettings({ ...settings, googleTagManagerEnabled: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="tagManagerEnabled" className="ml-2 text-sm text-gray-700">
              Enable
            </label>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Tag Manager ID
            </label>
            <div className="relative">
              <input
                type={showIds.tagManager ? 'text' : 'password'}
                value={showIds.tagManager ? settings.googleTagManagerId : maskId(settings.googleTagManagerId, showIds.tagManager)}
                onChange={(e) => setSettings({ ...settings, googleTagManagerId: e.target.value })}
                placeholder="GTM-XXXXXXX"
                className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowIds({ ...showIds, tagManager: !showIds.tagManager })}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showIds.tagManager ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Benefits:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Centralized tag management</li>
              <li>• Easy integration with multiple tools</li>
              <li>• Advanced tracking capabilities</li>
              <li>• Better performance</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Implementation Status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Implementation Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Facebook Pixel</div>
              <div className="text-sm text-gray-500">
                {settings.facebookPixelEnabled && settings.facebookPixelId ? 'Active' : 'Inactive'}
              </div>
            </div>
            <div className={`w-3 h-3 rounded-full ${
              settings.facebookPixelEnabled && settings.facebookPixelId ? 'bg-green-500' : 'bg-gray-300'
            }`}></div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Google Analytics</div>
              <div className="text-sm text-gray-500">
                {settings.googleAnalyticsEnabled && settings.googleAnalyticsId ? 'Active' : 'Inactive'}
              </div>
            </div>
            <div className={`w-3 h-3 rounded-full ${
              settings.googleAnalyticsEnabled && settings.googleAnalyticsId ? 'bg-green-500' : 'bg-gray-300'
            }`}></div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Tag Manager</div>
              <div className="text-sm text-gray-500">
                {settings.googleTagManagerEnabled && settings.googleTagManagerId ? 'Active' : 'Inactive'}
              </div>
            </div>
            <div className={`w-3 h-3 rounded-full ${
              settings.googleTagManagerEnabled && settings.googleTagManagerId ? 'bg-green-500' : 'bg-gray-300'
            }`}></div>
          </div>
        </div>
      </div>
    </div>
  )
}