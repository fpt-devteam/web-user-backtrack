import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import { useMySubscription } from '@/hooks/use-subscription'
import { SubscriptionPlanCard } from '@/components/account/subscription/subscription-plan-card'
import { SubscriptionBillingRow } from '@/components/account/subscription/subscription-billing-row'
import { SubscriptionActions } from '@/components/account/subscription/subscription-actions'
import { SubscriptionEmpty } from '@/components/account/subscription/subscription-empty'
import { SubscriptionSkeleton } from '@/components/account/subscription/subscription-skeleton'

export const Route = createFileRoute('/account/billing/')({
  component: BillingPage,
})

function BillingPage() {
  const navigate = useNavigate()
  const { data: subscription, isLoading } = useMySubscription()

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white sticky top-0 z-20 border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate({ to: '/account' })}
            className="p-1 -ml-1 text-blue-500 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="flex-1 text-center text-base font-bold text-gray-900 -ml-5">
            Billing
          </h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 py-6 flex flex-col gap-3">
        {isLoading ? (
          <SubscriptionSkeleton />
        ) : subscription ? (
          <>
            <SubscriptionPlanCard sub={subscription} />
            <SubscriptionBillingRow />
            <SubscriptionActions />
          </>
        ) : (
          <SubscriptionEmpty />
        )}
      </main>
    </div>
  )
}
