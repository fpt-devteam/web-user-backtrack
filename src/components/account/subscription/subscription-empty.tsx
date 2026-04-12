import { Sparkles } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

export function SubscriptionEmpty() {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-3xl p-8 flex flex-col items-center gap-3 text-center border border-[#EBEBEB] shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
      <div className="w-14 h-14 rounded-full bg-brand-50 flex items-center justify-center">
        <Sparkles className="w-6 h-6 text-brand-400" />
      </div>
      <p className="font-semibold text-[#222]">No active subscription</p>
      <p className="text-sm text-[#999]">You don't have an active subscription to manage.</p>
      <button
        onClick={() => navigate({ to: '/premium' })}
        className="mt-1 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 transition-colors text-white text-sm font-semibold"
      >
        Explore Premium Plans
      </button>
    </div>
  )
}
