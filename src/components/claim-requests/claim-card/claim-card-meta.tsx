import { Clock } from 'lucide-react'
import { categoryColor } from '../claim.constants'
import { formatClaimDate } from '../claim.utils'

interface ClaimCardMetaProps {
  category?: string | null
  updatedAt?: string | null
}

export function ClaimCardMeta({ category, updatedAt }: ClaimCardMetaProps) {
  const { bg, text } = categoryColor(category)

  return (
    <div className="flex items-center justify-between gap-2">
      {category ? (
        <span className={`px-2 py-0.5 text-[11px] rounded-md font-medium ${bg} ${text}`}>
          {category}
        </span>
      ) : (
        <span />
      )}
      <span className="flex items-center gap-1.5 text-[12px] text-[#9CA3AF] shrink-0">
        <Clock className="w-3.5 h-3.5" />
        {formatClaimDate(updatedAt)}
      </span>
    </div>
  )
}
