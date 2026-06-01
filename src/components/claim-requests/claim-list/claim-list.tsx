import { Search } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import type { ClaimRequest } from '../claim.types'
import { ClaimCard } from '../claim-card/claim-card'

interface ClaimListProps {
  claims: Array<ClaimRequest>
  isLoading: boolean
  isError?: boolean
  emptyTitle: string
  emptyHint?: string
  onView: (claim: ClaimRequest) => void
}

function ClaimCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex gap-4 items-center">
      <Skeleton className="w-20 h-20 rounded-xl shrink-0" />
      <div className="flex-1 py-1 flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <Skeleton className="h-5 w-1/3 rounded" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-3/4 rounded" />
        <div className="flex justify-between mt-2">
          <Skeleton className="h-3 w-20 rounded" />
          <Skeleton className="h-3 w-28 rounded" />
        </div>
      </div>
    </div>
  )
}

/** A vertical list of claim cards with loading / error / empty states. */
export function ClaimList({
  claims,
  isLoading,
  isError,
  emptyTitle,
  emptyHint,
  onView,
}: ClaimListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <ClaimCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex-1 flex items-center justify-center py-16">
        <p className="text-sm font-bold text-[#9CA3AF]">Failed to load claim requests. Please try again.</p>
      </div>
    )
  }

  if (claims.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Search className="w-14 h-14 text-[#E5E7EB] mb-4" strokeWidth={1} />
        <p className="text-sm font-bold text-[#9CA3AF]">{emptyTitle}</p>
        {emptyHint && <p className="text-[12px] text-[#C4C9D4] mt-1">{emptyHint}</p>}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {claims.map((claim) => (
        <ClaimCard key={claim.id} claim={claim} onView={onView} />
      ))}
    </div>
  )
}
