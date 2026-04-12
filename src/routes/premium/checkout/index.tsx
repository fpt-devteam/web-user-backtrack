import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { PlanSummary } from '@/components/premium/plan-summary'
import { PaymentForm } from '@/components/premium/payment-form'
import { BacktrackLogo } from '@/components/shared/backtrack-logo'
import { useAuth } from '@/hooks/use-auth'

interface CheckoutState {
  clientSecret: string
  planId: string
  planLabel: string
  planPrice: string
  planPeriod: string
  features: string[]
}

function readCheckoutState(): CheckoutState | null {
  try {
    const parsed = JSON.parse(sessionStorage.getItem('checkout') ?? '{}') as Partial<CheckoutState>
    return parsed.clientSecret ? (parsed as CheckoutState) : null
  } catch {
    return null
  }
}

export const Route = createFileRoute('/premium/checkout/')({
  component: CheckoutPage,
})

function CheckoutPage() {
  const navigate = useNavigate()
  const state = readCheckoutState()

  if (!state) {
    navigate({ to: '/premium' })
    return null
  }

  const {
    clientSecret,
    planLabel = 'Premium',
    planPrice = '',
    planPeriod = '',
    features = [],
  } = state

  return (
    <div className="min-h-screen pt-8 lg:pt-12">
      <main className="max-w-6xl mx-auto px-5 pb-12 lg:px-10 lg:pb-16 pt-2">

        {/* Layout: stacked mobile | side-by-side desktop */}
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
          {/* Plan summary — right on desktop */}
          <div className="lg:order-2">
            <PlanSummary
              planLabel={planLabel}
              planPrice={planPrice}
              planPeriod={planPeriod}
              features={features}
            />
          </div>

          {/* Payment form — left on desktop */}
          <div className="lg:order-1 bg-white rounded-3xl px-6 py-7">
            <h2 className="text-base font-bold text-[#222] mb-5">Payment details</h2>
            <PaymentForm
              clientSecret={clientSecret}
              planLabel={planLabel}
              planPrice={planPrice}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
