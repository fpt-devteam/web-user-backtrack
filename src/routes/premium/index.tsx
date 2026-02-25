import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { PremiumHero } from '@/components/premium/premium-hero'
import { PremiumPricing } from '@/components/premium/premium-pricing'
import { BacktrackHeader } from '@/components/shared/backtrack-header'
import { useCreateSubscription } from '@/hooks/use-subscription'
import type { Plan } from '@/components/premium/plans'

export const Route = createFileRoute('/premium/')({
  component: PremiumPage,
})

function PremiumPage() {
  const navigate = useNavigate()
  const createSubscription = useCreateSubscription()

  const handleSubscribe = async (plan: Plan) => {
    const result = await createSubscription.mutateAsync({ priceId: plan.priceId })
    sessionStorage.setItem(
      'checkout',
      JSON.stringify({
        clientSecret: result.clientSecret,
        planId: plan.id,
        planLabel: plan.label,
        planPrice: plan.price,
        planPeriod: plan.period,
      }),
    )
    await navigate({ to: '/premium/checkout' })
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <BacktrackHeader />

      {/* Content */}
      <main className="max-w-4xl mx-auto p-5 pb-12 lg:px-10 lg:pb-16">
        {/* Mobile: stacked | Desktop: side-by-side */}
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
          <PremiumHero />
          <PremiumPricing
            onSubscribe={handleSubscribe}
            isPending={createSubscription.isPending}
          />
        </div>
      </main>
    </div>
  )
}
