import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

import * as TanStackQueryProvider from '@/integrations/tanstack-query/root-provider.tsx'
import { AuthProvider } from '@/hooks/use-auth'
import { SocketProvider } from '@/hooks/use-socket'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import './styles.css'
import { NotFoundPage } from '@/components/shared/errors/not-found-page'
import { InternalServerErrorPage } from '@/components/shared/errors/internal-server-error-page'
import { Toaster } from "@/components/ui/sonner"
import { Splash } from '@/components/ui/splash'
import { StripeProvider } from '@/integrations/stripe-provider'
// Create a new router instance

const TanStackQueryProviderContext = TanStackQueryProvider.getContext()
const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  defaultErrorComponent: () => <InternalServerErrorPage />,
  defaultPendingComponent: () => <Splash />,
  defaultNotFoundComponent: () => <NotFoundPage />,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
        <AuthProvider>
          <SocketProvider>
            <StripeProvider>
              <RouterProvider router={router} />
              <Toaster position='top-right' />
            </StripeProvider>
          </SocketProvider>
        </AuthProvider>
      </TanStackQueryProvider.Provider>
    </StrictMode>,
  )
}