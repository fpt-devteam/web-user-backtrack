import { ChevronRight } from 'lucide-react'
import type { ClaimRequest } from '../claim.types'
import { ClaimCardImage } from './claim-card-image'
import { ClaimCardHeader } from './claim-card-header'
import { ClaimCardMeta } from './claim-card-meta'
import { ClaimCardOrg } from './claim-card-org'
import { useGetSubcategories } from '@/hooks/use-subcategory'
import { getSubcategoryIcon } from '@/utils/subcategory-icon'
import type { ItemCategory } from '@/types/inventory.type'

interface ClaimCardProps {
  claim: ClaimRequest
  onView?: (claim: ClaimRequest) => void
}

/** A single claim request card — mirrors the console claim card, user-facing. */
export function ClaimCard({ claim, onView }: ClaimCardProps) {
  const imageUrl = claim.imageUrls[0]

  const { data: subcategories } = useGetSubcategories(claim.category ?? undefined)
  const subcategoryCode = subcategories?.find((s) => s.id === claim.subCategoryId)?.code
  const subcategoryIcon =
    claim.category && subcategoryCode
      ? getSubcategoryIcon(claim.category as ItemCategory, subcategoryCode)
      : null

  return (
    <div
      onClick={() => onView?.(claim)}
      className="group relative bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_2px_12px_rgba(0,0,0,0.04)]
                 transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] cursor-pointer
                 flex flex-col select-none"
    >
      <div className="flex gap-4 p-4">
        <ClaimCardImage src={imageUrl} alt={claim.itemName} category={claim.category} subcategoryIcon={subcategoryIcon} />

        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <ClaimCardHeader id={claim.id} itemName={claim.itemName} status={claim.status} />

          <p className="text-[13px] text-[#6B7280] leading-relaxed line-clamp-2">
            {claim.description}
          </p>

          <ClaimCardMeta category={claim.category} updatedAt={claim.updatedAt ?? claim.createdAt} />
        </div>

        <div className="shrink-0 self-center pl-1">
          <ChevronRight className="w-5 h-5 text-[#C4C9D4] transition-transform group-hover:translate-x-0.5" strokeWidth={1.8} />
        </div>
      </div>

      <div className="border-t border-[#F0F1F3] px-4 py-2.5">
        <ClaimCardOrg name={claim.orgName} logoUrl={claim.orgLogoUrl} />
      </div>
    </div>
  )
}
