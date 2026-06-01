import cardIcon from '@/assets/icons/cards/card_icon.png'
import electronicsIcon from '@/assets/icons/electronics/electronics_icon.png'
import othersIcon from '@/assets/icons/others/others_icon.png'
import personalBelongingIcon from '@/assets/icons/personal_belongings/personal_belonging_icon.png'
import type { ItemCategory } from '@/types/inventory.type'
import { categoryColor } from '../claim.constants'

interface ClaimCardImageProps {
  src?: string | null
  alt: string
  category?: string | null
  subcategoryIcon?: string | null
}

const CATEGORY_ICON: Record<ItemCategory, string> = {
  PersonalBelongings: personalBelongingIcon,
  Cards:              cardIcon,
  Accessories:        othersIcon,
  Electronics:        electronicsIcon,
  Others:             othersIcon,
}

function CategoryFallback({ category, subcategoryIcon }: { category?: string | null; subcategoryIcon?: string | null }) {
  const key = (category ?? 'Others') as ItemCategory
  const icon = subcategoryIcon ?? CATEGORY_ICON[key]
  const { bg } = categoryColor(category)

  return (
    <div className={`w-20 h-20 rounded-xl border border-[#E5E7EB] flex items-center justify-center shrink-0 overflow-hidden ${bg}`}>
      <img
        src={icon}
        alt={category ?? 'Others'}
        className="w-12 h-12 object-contain transition-transform duration-200 scale-[1.15] group-hover:scale-[1.3]"
      />
    </div>
  )
}

export function ClaimCardImage({ src, alt, category, subcategoryIcon }: ClaimCardImageProps) {
  if (src) {
    return (
      <div className="w-20 h-20 rounded-xl border border-[#E5E7EB] shrink-0 overflow-hidden">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.08]"
        />
      </div>
    )
  }
  return <CategoryFallback category={category} subcategoryIcon={subcategoryIcon} />
}
