import { ChevronRight } from 'lucide-react'

export function SubscriptionBillingRow() {
  return (
    <div className="bg-white rounded-3xl">
      <button className="w-full flex items-center justify-between px-5 py-4 group">
        <span className="text-sm font-semibold text-gray-900">Billing History</span>
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
      </button>
    </div>
  )
}
