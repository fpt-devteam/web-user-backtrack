import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import { useMySubscription, useCancelSubscription } from '@/hooks/use-subscription'
import { SubscriptionPlanCard } from '@/components/account/subscription/subscription-plan-card'
import { SubscriptionCancelDialog } from '@/components/account/subscription/subscription-cancel-dialog'
import { SubscriptionBillingRow } from '@/components/account/subscription/subscription-billing-row'
import { SubscriptionActions } from '@/components/account/subscription/subscription-actions'
import { SubscriptionEmpty } from '@/components/account/subscription/subscription-empty'
import { SubscriptionSkeleton } from '@/components/account/subscription/subscription-skeleton'

export const Route = createFileRoute('/account/subscription/')({
  component: SubscriptionPage,
})

function SubscriptionPage() {
  const navigate = useNavigate()
  const { data: subscription, isLoading } = useMySubscription()
  const cancelMutation = useCancelSubscription()
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const handleCancelConfirm = async () => {
    await cancelMutation.mutateAsync()
    setShowCancelDialog(false)
    navigate({ to: '/account' })
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white sticky top-0 z-20 border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center">
          <h1 className="flex-1 text-center text-base font-bold text-gray-900 -ml-5">
            Subscription
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
            <SubscriptionActions
              onCancelClick={() => setShowCancelDialog(true)}
              cancelAtPeriodEnd={subscription.cancelAtPeriodEnd}
            />
          </>
        ) : (
          <SubscriptionEmpty />
        )}
      </main>

      {subscription && (
        <SubscriptionCancelDialog
          open={showCancelDialog}
          onOpenChange={setShowCancelDialog}
          endDate={subscription.currentPeriodEnd}
          onConfirm={handleCancelConfirm}
          isLoading={cancelMutation.isPending}
        />
      )}
    </div>
  )
}
