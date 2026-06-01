import type { ClaimStatus } from '../claim.constants'
import { formatClaimId } from '../claim.utils'
import { ClaimCardBadge } from './claim-card-badge'

interface ClaimCardHeaderProps {
  id: string
  itemName: string
  status: ClaimStatus
}

export function ClaimCardHeader({ id, itemName, status }: ClaimCardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="flex flex-col min-w-0">
        <span className="text-[11px] font-mono text-[#9CA3AF] leading-none mb-1">
          {formatClaimId(id)}
        </span>
        <p className="text-[15px] font-bold text-[#111] leading-snug line-clamp-1">
          {itemName}
        </p>
      </div>
      <ClaimCardBadge status={status} />
    </div>
  )
}
