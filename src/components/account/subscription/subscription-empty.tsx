import { Sparkles } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

export function SubscriptionEmpty() {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-3xl p-8 flex flex-col items-center gap-3 text-center">
      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
        <Sparkles className="w-6 h-6 text-gray-400" />
      </div>
      <p className="font-semibold text-gray-900">No active subscription</p>
      <p className="text-sm text-gray-400">You don't have an active subscription to manage.</p>
      <button
        onClick={() => navigate({ to: '/premium' })}
        className="mt-1 px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors text-white text-sm font-semibold"
      >
        Explore Premium Plans
      </button>
    </div>
  )
}
