import { createFileRoute, Link } from '@tanstack/react-router'
import { useGetOrgs } from '@/hooks/use-org'
import { Skeleton } from '@/components/ui/skeleton'
import { MapPin, Building2, ChevronRight } from 'lucide-react'

export const Route = createFileRoute('/org/')({
  component: OrgListPage,
})

function OrgListPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetOrgs()

  const orgs = data?.pages.flatMap((p) => p.items) ?? []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-10">
        <h1 className="text-lg font-bold text-gray-900">Organisations</h1>
        <p className="text-sm text-gray-500">SafeDrop & Found Centres near you</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => <OrgSkeleton key={i} />)
          : orgs.map((org) => (
              <Link
                key={org.id}
                to="/org/$id"
                params={{ id: org.id }}
                className="block"
              >
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{org.name}</p>
                    {org.displayAddress && (
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        {org.displayAddress}
                      </p>
                    )}
                    <span className="inline-block mt-1 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      {org.industryType}
                    </span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 shrink-0" />
                </div>
              </Link>
            ))}

        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="w-full py-3 text-sm font-medium text-blue-600 bg-white rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {isFetchingNextPage ? 'Loading…' : 'Load more'}
          </button>
        )}
      </div>
    </div>
  )
}

function OrgSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>
    </div>
  )
}
