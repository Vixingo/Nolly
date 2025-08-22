import { useStoreSettings } from '../../store/useStoreSettings'
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react'

export function StorefrontFooter() {
  const { settings } = useStoreSettings()

  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {settings?.store_name || 'Nolly'}
            </h3>
            <p className="text-gray-600 mb-4">
              {settings?.store_description || 'Your trusted online store for quality products at great prices.'}
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4 mb-4">
              {settings?.facebook_url && (
                <a 
                  href={settings.facebook_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-500"
                >
                  <Facebook className="h-6 w-6" />
                </a>
              )}
              {settings?.instagram_url && (
                <a 
                  href={settings.instagram_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-500"
                >
                  <Instagram className="h-6 w-6" />
                </a>
              )}
              {settings?.twitter_url && (
                <a 
                  href={settings.twitter_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-500"
                >
                  <Twitter className="h-6 w-6" />
                </a>
              )}
              {settings?.linkedin_url && (
                <a 
                  href={settings.linkedin_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-500"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
              )}
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} {settings?.store_name || 'Nolly'}. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-600 hover:text-gray-900">
                  Home
                </a>
              </li>
              <li>
                <a href="/products" className="text-gray-600 hover:text-gray-900">
                  Products
                </a>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Policies
            </h4>
            <ul className="space-y-2">
              {settings?.terms_of_service && (
                <li>
                  <a href="/terms" className="text-gray-600 hover:text-gray-900">
                    Terms of Service
                  </a>
                </li>
              )}
              {settings?.privacy_policy && (
                <li>
                  <a href="/privacy" className="text-gray-600 hover:text-gray-900">
                    Privacy Policy
                  </a>
                </li>
              )}
              {settings?.return_policy && (
                <li>
                  <a href="/returns" className="text-gray-600 hover:text-gray-900">
                    Return Policy
                  </a>
                </li>
              )}
              {settings?.shipping_policy && (
                <li>
                  <a href="/shipping" className="text-gray-600 hover:text-gray-900">
                    Shipping Policy
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-2">
              <li className="text-gray-600">
                Email: {settings?.store_email || 'support@nolly.com'}
              </li>
              <li className="text-gray-600">
                Phone: {settings?.store_phone || '+1 (555) 123-4567'}
              </li>
              <li className="text-gray-600">
                {settings?.store_address}, {settings?.store_city}, {settings?.store_state} {settings?.store_zip}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}