import { Outlet, createRootRouteWithContext, useRouterState } from '@tanstack/react-router'

import type { QueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/use-auth'
import { Splash } from '@/components/ui/splash'
import { BacktrackHeader } from '@/components/shared/backtrack-header'
import { BacktrackFooter } from '@/components/shared/backtrack-footer'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
})

/* Pages without header */
const NO_HEADER_ROUTES = ['/sign-in', '/sign-up', '/chat', '/premium/success']
/* Pages without footer (message is a full-height chat UI) */
const NO_FOOTER_ROUTES = ['/sign-in', '/sign-up', '/chat', '/message', '/premium/checkout', '/premium/success']

function Root() {
  const { loading: authLoading } = useAuth()
  const { location } = useRouterState()

  if (authLoading) return <Splash />

  const showHeader = !NO_HEADER_ROUTES.some(r => location.pathname.startsWith(r))
  const showFooter = !NO_FOOTER_ROUTES.some(r => location.pathname.startsWith(r))

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      {showHeader && <BacktrackHeader />}
      {/* Outlet fills remaining height; non-chat pages scroll inside this container */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <Outlet />
        {showFooter && <BacktrackFooter />}
      </div>
    </div>
  )
}
