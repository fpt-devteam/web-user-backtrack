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
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Header */}
      <header className="bg-white sticky top-0 z-20 border-b border-[#F0F0F0]">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center">
          <button
            onClick={() => navigate({ to: '/account' })}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F5F5F5]
                       transition-colors duration-150 cursor-pointer -ml-1
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
            aria-label="Back to account"
          >
            <ChevronLeft className="w-5 h-5 text-[#222]" />
          </button>
          <h1 className="flex-1 text-center text-sm font-bold text-[#111] -ml-9">
            Billing
          </h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-3">
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
