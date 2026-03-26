import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error: any) => {
          // Don't retry on 503 (Railway cold start / service down) — avoid doubling wait time
          if (error?.response?.status === 503) return false
          return failureCount < 1
        },
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5 minutes — prevents refetch on every navigation
      },
    },
  })
  return {
    queryClient,
  }
}

export function Provider({
  children,
  queryClient,
}: {
  readonly children: React.ReactNode
  readonly queryClient: QueryClient
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
