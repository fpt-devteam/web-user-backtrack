import { ChevronRight } from 'lucide-react'
import type React from 'react'

export interface SectionItem {
  icon: React.ElementType
  label: string
  description?: string
  onClick?: () => void
}

export function SectionCard({ items }: { items: Array<SectionItem> }) {
  return (
    <div className="bg-white rounded-2xl border border-[#DDDDDD] divide-y divide-[#F3F4F6]
                    shadow-[0_2px_8px_rgba(0,0,0,0.05)] overflow-hidden">
      {items.map(({ icon: Icon, label, description, onClick }) => (
        <button
          key={label}
          onClick={onClick}
          className="group w-full flex items-center gap-4 px-5 py-4 text-left
                     hover:bg-[#F9F9F9] transition-colors duration-150 cursor-pointer"
        >
          <span className="w-10 h-10 rounded-xl bg-[#F3F4F6] group-hover:bg-[#E9EAEC]
                           flex items-center justify-center shrink-0 transition-colors duration-150">
            <Icon className="w-5 h-5 text-[#555]" strokeWidth={1.8} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-semibold text-[#111] leading-tight">{label}</p>
            {description && <p className="text-xs text-[#aaa] mt-0.5 truncate">{description}</p>}
          </div>
          <ChevronRight className="w-4 h-4 text-[#ccc] shrink-0 group-hover:text-[#888] transition-colors" />
        </button>
      ))}
    </div>
  )
}
