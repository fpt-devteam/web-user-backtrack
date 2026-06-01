import type { ClaimStatus } from '../claim.constants'
import { STATUS_BADGE, STATUS_DOT, STATUS_LABEL, STATUS_PULSE } from '../claim.constants'

interface ClaimCardBadgeProps {
  status: ClaimStatus
}

export function ClaimCardBadge({ status }: ClaimCardBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${STATUS_BADGE[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status]} ${STATUS_PULSE[status] ? 'animate-pulse' : ''}`} />
      {STATUS_LABEL[status]}
    </span>
  )
}
