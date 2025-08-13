export function StorefrontFooter() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nolly</h3>
            <p className="text-gray-600 mb-4">
              Your trusted online store for quality products at great prices.
            </p>
            <p className="text-sm text-gray-500">
              © 2024 Nolly. All rights reserved.
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

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-2">
              <li className="text-gray-600">
                Email: support@nolly.com
              </li>
              <li className="text-gray-600">
                Phone: +1 (555) 123-4567
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}