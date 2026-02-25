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
  const { profile } = useAuth()
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
  } = state

  const avatarSrc = profile?.avatarUrl
  const avatarInitial = (profile?.displayName ?? profile?.email ?? 'U')[0].toUpperCase()

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Checkout header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-5 lg:px-10 py-4">
          {/* Row 1: logo + avatar */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => navigate({ to: '/' })}
              className="bg-transparent border-0 p-0 cursor-pointer shrink-0"
            >
              <BacktrackLogo width={120} height={28} />
            </button>
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="Account"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                {avatarInitial}
              </div>
            )}
          </div>
          {/* Row 2: title + change plan */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-extrabold text-gray-900">Checkout</h1>
            <button
              onClick={() => navigate({ to: '/premium' })}
              className="text-sm text-blue-500 underline underline-offset-2 hover:text-blue-700 transition-colors"
            >
              Change plan
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5 pb-12 lg:px-10 lg:pb-16 pt-6">

        {/* Layout: stacked mobile | side-by-side desktop */}
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
          {/* Plan summary — right on desktop */}
          <div className="lg:order-2">
            <PlanSummary
              planLabel={planLabel}
              planPrice={planPrice}
              planPeriod={planPeriod}
            />
          </div>

          {/* Payment form — left on desktop */}
          <div className="lg:order-1 bg-white rounded-3xl px-6 py-7">
            <h2 className="text-base font-bold text-gray-900 mb-5">Payment details</h2>
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
