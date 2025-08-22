import { useStoreSettings } from '../../store/useStoreSettings'

export function ReturnsPage() {
  const { settings } = useStoreSettings()

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Return Policy</h1>
      <div className="prose prose-lg">
        {settings?.return_policy ? (
          <div dangerouslySetInnerHTML={{ __html: settings.return_policy }} />
        ) : (
          <p>Return policy content is not available.</p>
        )}
      </div>
    </div>
  )
}