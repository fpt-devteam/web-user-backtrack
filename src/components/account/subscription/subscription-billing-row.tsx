import { ChevronRight } from 'lucide-react'

export function SubscriptionBillingRow() {
  return (
    <div className="bg-white rounded-3xl border border-[#EBEBEB] shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
      <button className="w-full flex items-center justify-between px-5 py-4 group">
        <span className="text-sm font-semibold text-[#222]">Billing History</span>
        <ChevronRight className="w-4 h-4 text-[#999] group-hover:text-[#444] transition-colors" />
      </button>
    </div>
  )
}
