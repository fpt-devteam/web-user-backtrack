import { createFileRoute } from '@tanstack/react-router'
import { MessagerPage } from '@/components/message/messager-page'

export const Route = createFileRoute('/message/')({
  validateSearch: (search: Record<string, unknown>) => ({
    selectedId: (search.selectedId as string) || undefined,
    isSupport: search.isSupport === true || search.isSupport === 'true',
    fallbackName: (search.fallbackName as string) || undefined,
    fallbackAvatarUrl: (search.fallbackAvatarUrl as string) || undefined,
  }),
  component: QrChatPage,
})

function QrChatPage() {
  const { selectedId, isSupport, fallbackName, fallbackAvatarUrl } = Route.useSearch()

  return (
    <div className="h-full">
      <MessagerPage
        initialSelectedId={selectedId}
        initialIsSupport={isSupport}
        fallbackName={fallbackName}
        fallbackAvatarUrl={fallbackAvatarUrl}
        conversationType="direct"
      />
    </div>
  )
}
