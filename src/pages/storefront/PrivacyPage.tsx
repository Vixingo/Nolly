import { useStoreSettings } from '../../store/useStoreSettings'

export function PrivacyPage() {
  const { settings } = useStoreSettings()

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      <div className="prose prose-lg">
        {settings?.privacy_policy ? (
          <div dangerouslySetInnerHTML={{ __html: settings.privacy_policy }} />
        ) : (
          <p>Privacy policy content is not available.</p>
        )}
      </div>
    </div>
  )
}