import { Package } from 'lucide-react'

export function InventoryCard({ item, onSelect }: { item: any; onSelect?: (item: any) => void }) {
  const hasImage = !!item.imageUrls?.[0]

  return (
    <div
      className="group cursor-pointer"
      onClick={() => onSelect?.(item)}
    >
      <div className="relative w-full aspect-[4/3] rounded-[12px] overflow-hidden bg-[#F3F4F6]">
        {hasImage ? (
          <img
            src={item.imageUrls[0]}
            alt={item.postTitle}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
            <Package className="w-8 h-8 text-[#C4C9D4]" strokeWidth={1.5} />
            <span className="text-[11px] font-semibold text-[#B0B7C3]">No image</span>
          </div>
        )}
        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500
                           shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
        </div>
      </div>

      <div className="mt-2.5 px-0.5">
        <p className="text-[13px] font-bold text-[#111] line-clamp-1 leading-snug
                       group-hover:text-brand-600 transition-colors">
          {item.postTitle}
        </p>
        <p className="text-[11px] text-[#9CA3AF] font-semibold uppercase tracking-wide mt-0.5">
          {item.category}
        </p>
      </div>
    </div>
  )
}
