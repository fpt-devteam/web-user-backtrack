import { useMemo, useState } from 'react'
import type { ClaimRequest } from '../claim.types'
import { CLAIM_TABS } from '../claim.constants'
import { ClaimList } from './claim-list'
import { ClaimListTabs   } from './claim-list-tabs'
import type {ClaimStatusCounts, ClaimStatusFilter} from './claim-list-tabs';
import { ClaimListSort  } from './claim-list-sort'
import type {ClaimSort} from './claim-list-sort';

interface ClaimListPanelProps {
  claims: Array<ClaimRequest>
  isLoading: boolean
  isError?: boolean
  emptyTitle?: string
  emptyHint?: string
  onView: (claim: ClaimRequest) => void
}

/** Claim list with a status filter bar (counts) and a newest/oldest sort. */
export function ClaimListPanel({
  claims,
  isLoading,
  isError,
  emptyTitle = 'No claim requests found',
  emptyHint,
  onView,
}: ClaimListPanelProps) {
  const [status, setStatus] = useState<ClaimStatusFilter>('all')
  const [sort, setSort] = useState<ClaimSort>('newest')

  const counts = useMemo<ClaimStatusCounts>(() => {
    const result = { all: claims.length } as ClaimStatusCounts
    for (const tab of CLAIM_TABS) {
      result[tab.key] = claims.filter((c) => tab.statuses.includes(c.status)).length
    }
    return result
  }, [claims])

  const visible = useMemo(() => {
    const tab = CLAIM_TABS.find((t) => t.key === status)
    const filtered =
      status === 'all' || !tab ? claims : claims.filter((c) => tab.statuses.includes(c.status))
    const time = (c: ClaimRequest) => new Date(c.updatedAt ?? c.createdAt).getTime()
    return [...filtered].sort((a, b) => (sort === 'newest' ? time(b) - time(a) : time(a) - time(b)))
  }, [claims, status, sort])

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ClaimListTabs active={status} counts={counts} onChange={setStatus} />
        <ClaimListSort value={sort} onChange={setSort} />
      </div>
      <ClaimList
        claims={visible}
        isLoading={isLoading}
        isError={isError}
        emptyTitle={emptyTitle}
        emptyHint={emptyHint}
        onView={onView}
      />
    </div>
  )
}
