import { useStoreSettings } from '../../store/useStoreSettings'

export function TermsPage() {
  const { settings } = useStoreSettings()

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
      <div className="prose prose-lg">
        {settings?.terms_of_service ? (
          <div dangerouslySetInnerHTML={{ __html: settings.terms_of_service }} />
        ) : (
          <p>Terms of service content is not available.</p>
        )}
      </div>
    </div>
  )
}