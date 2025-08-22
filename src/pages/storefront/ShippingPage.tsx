import { useStoreSettings } from '../../store/useStoreSettings'

export function ShippingPage() {
  const { settings } = useStoreSettings()

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shipping Policy</h1>
      <div className="prose prose-lg">
        {settings?.shipping_policy ? (
          <div dangerouslySetInnerHTML={{ __html: settings.shipping_policy }} />
        ) : (
          <p>Shipping policy content is not available.</p>
        )}
      </div>
    </div>
  )
}