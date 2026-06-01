import { cn } from '@/lib/utils'
import type { ClaimStatus } from '../claim.constants'
import { CLAIM_STATUSES, STATUS_LABEL } from '../claim.constants'

/** Status filter for the claim list — any claim status, or "all". */
export type ClaimStatusFilter = ClaimStatus | 'all'

export type ClaimStatusCounts = Record<ClaimStatusFilter, number>

const TABS: Array<{ key: ClaimStatusFilter; label: string }> = [
  { key: 'all', label: 'All' },
  ...CLAIM_STATUSES.map((s) => ({ key: s, label: STATUS_LABEL[s] })),
]

interface ClaimListTabsProps {
  active: ClaimStatusFilter
  counts: ClaimStatusCounts
  onChange: (filter: ClaimStatusFilter) => void
}

/** The status bar: a row of filter pills, each with a live count badge. */
export function ClaimListTabs({ active, counts, onChange }: ClaimListTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {TABS.map((tab) => {
        const isActive = active === tab.key
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={cn(
              'flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[13px] font-bold transition-colors cursor-pointer',
              isActive
                ? 'bg-rose-50 text-rose-600'
                : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111]',
            )}
          >
            {tab.label}
            <span
              className={cn(
                'inline-flex min-w-4 items-center justify-center rounded-full px-1 text-[11px] font-bold',
                isActive ? 'bg-rose-500 text-white' : 'bg-[#E5E7EB] text-[#6B7280]',
              )}
            >
              {counts[tab.key]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
