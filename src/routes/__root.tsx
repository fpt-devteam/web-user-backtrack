import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

import type { QueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/use-auth'
import { Splash } from '@/components/ui/splash';

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
});

function Root() {
  const { loading: authLoading } = useAuth();
  if (authLoading) return <Splash />;
  return <Outlet />;
};
