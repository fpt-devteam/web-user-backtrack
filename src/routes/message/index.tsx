import { createFileRoute } from '@tanstack/react-router'
import { MessagerPage } from '@/components/message/messager-page'

export const Route = createFileRoute('/message/')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    selectedId: typeof search.selectedId === 'string' ? search.selectedId : undefined,
    isSupport: search.isSupport === true,
    fallbackName: typeof search.fallbackName === 'string' ? search.fallbackName : undefined,
    fallbackAvatarUrl:
      typeof search.fallbackAvatarUrl === 'string' ? search.fallbackAvatarUrl : undefined,
  }),
})

function RouteComponent() {
  const { selectedId, isSupport, fallbackName, fallbackAvatarUrl } = Route.useSearch()
  return (
    <MessagerPage
      initialSelectedId={selectedId}
      initialIsSupport={isSupport}
      fallbackName={fallbackName}
      fallbackAvatarUrl={fallbackAvatarUrl}
    />
  )
}
