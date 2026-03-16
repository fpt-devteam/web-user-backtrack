import { Link } from '@tanstack/react-router'
import { useGetOrgs } from '@/hooks/use-org'
import { Skeleton } from '@/components/ui/skeleton'
import { Building2, ChevronRight, MapPin } from 'lucide-react'

export function OrgListSection() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetOrgs()

  const orgs = data?.pages.flatMap((p) => p.items) ?? []

  return (
    <section className="bg-gray-50 py-14">
      <div className="max-w-2xl mx-auto px-4">
        {/* Heading */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">SafeDrop Centres</h2>
          <p className="text-sm text-gray-500 mt-1">
            Drop off or pick up found items at an organisation near you
          </p>
        </div>

        {/* List */}
        <div className="space-y-3">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <OrgSkeleton key={i} />)
            : orgs.map((org) => (
                <Link
                  key={org.id}
                  to="/chat/new/$orgId"
                  params={{ orgId: org.id }}
                  className="block group"
                >
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 group-hover:shadow-md transition-shadow">
                    {/* Icon */}
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {org.name}
                      </p>
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
        </div>

        {/* Load more */}
        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="mt-4 w-full py-3 text-sm font-medium text-blue-600 bg-white rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {isFetchingNextPage ? 'Loading…' : 'Load more'}
          </button>
        )}
      </div>
    </section>
  )
}

function OrgSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>
    </div>
  )
}
