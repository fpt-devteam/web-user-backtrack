import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { usePlans, useCreateSubscription } from '@/hooks/use-subscription'

import { Skeleton } from '@/components/ui/skeleton'
import { Check, Sparkles, ShieldCheck, RefreshCw, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from '@/lib/toast'
import { classifyApiError, getApiErrorMessage } from '@/lib/api-error'
import { auth } from '@/lib/firebase'
import type { SubscriptionPlan } from '@/types/subscription.type'

export const Route = createFileRoute('/premium/')({
  component: PricingPage,
})

// ── Plan icon SVGs ────────────────────────────────────────────────────────────

function MonthlyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <rect x="7" y="7" width="10" height="10" rx="1.5" fill="currentColor" opacity="0.35" />
      <rect x="28" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <rect x="31" y="7" width="10" height="10" rx="1.5" fill="currentColor" opacity="0.35" />
      <rect x="4" y="28" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <rect x="7" y="31" width="10" height="10" rx="1.5" fill="currentColor" opacity="0.35" />
      <rect x="28" y="28" width="4" height="4" rx="1" fill="currentColor" opacity="0.5" />
      <rect x="34" y="28" width="10" height="4" rx="1" fill="currentColor" opacity="0.3" />
      <rect x="28" y="34" width="6" height="4" rx="1" fill="currentColor" opacity="0.3" />
      <rect x="36" y="34" width="8" height="4" rx="1" fill="currentColor" opacity="0.3" />
      <rect x="28" y="40" width="16" height="4" rx="1" fill="currentColor" opacity="0.3" />
    </svg>
  )
}

function YearlyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <circle cx="24" cy="10" r="6" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="24" cy="10" r="3" fill="currentColor" opacity="0.4" />
      <line x1="24" y1="16" x2="24" y2="26" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="24" y1="26" x2="10" y2="36" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="24" y1="26" x2="38" y2="36" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="10" cy="38" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="10" cy="38" r="2" fill="currentColor" opacity="0.4" />
      <circle cx="38" cy="38" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="38" cy="38" r="2" fill="currentColor" opacity="0.4" />
      <line x1="24" y1="22" x2="14" y2="30" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.4" />
      <line x1="24" y1="22" x2="34" y2="30" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeOpacity="0.4" />
    </svg>
  )
}

// ── Plan card ─────────────────────────────────────────────────────────────────

function PlanCard({
  plan,
  isYearly,
  onSubscribe,
  isPending,
}: {
  plan: SubscriptionPlan
  isYearly: boolean
  onSubscribe: (plan: SubscriptionPlan) => void
  isPending: boolean
}) {
  const monthlyEquiv = isYearly ? (plan.price / 12).toFixed(2) : null
  const savings = isYearly ? (1.99 * 12 - plan.price).toFixed(2) : null

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-3xl border bg-white p-7 lg:p-8 transition-all duration-200',
        isYearly
          ? 'border-brand-300 shadow-[0_0_0_3px_color-mix(in_oklch,var(--brand-300)_30%,transparent),0_20px_40px_-12px_color-mix(in_oklch,var(--brand-500)_18%,transparent)]'
          : 'border-[#EBEBEB] shadow-sm',
      )}
    >
      {/* Best value badge */}
      {isYearly && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-500 to-brand-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md whitespace-nowrap">
          Best Value · 2 months free
        </div>
      )}

      {/* Icon */}
      <div className="mb-5">
        {isYearly ? (
          <YearlyIcon className="w-12 h-12 text-brand-500" />
        ) : (
          <MonthlyIcon className="w-12 h-12 text-[#888]" />
        )}
      </div>

      {/* Plan name + tagline */}
      <h2 className="text-xl font-bold text-[#222] mb-1">{plan.name}</h2>
      <p className="text-sm text-[#999] mb-6">
        {isYearly ? 'Best value — save more every year' : 'Flexible billing, cancel anytime'}
      </p>

      {/* Price */}
      <div className="flex items-end gap-2 mb-8">
        <span className="text-5xl font-extrabold text-[#111] leading-none">
          ${plan.price}
        </span>
        <div className="pb-1 text-[#999] text-sm leading-tight">
          {plan.currency.toUpperCase()} /{' '}
          {plan.billingInterval.toLowerCase()}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => onSubscribe(plan)}
        disabled={isPending}
        className={cn(
          'w-full py-4 rounded-2xl font-bold text-sm transition-all duration-200 active:scale-95 mb-7',
          isYearly
            ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-200'
            : 'bg-[#111] hover:bg-[#222] text-white',
        )}
      >
        {isPending ? 'Processing…' : `Get ${plan.name} Plan`}
      </button>

      {/* Divider */}
      <div className="border-t border-[#F0F0F0] mb-6" />

      {/* Features */}
      <p className="text-xs font-semibold text-[#999] uppercase tracking-widest mb-4">
        {isYearly ? 'Everything in Monthly, plus:' : 'Included in this plan:'}
      </p>
      <ul className="space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <Check className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" strokeWidth={2.5} />
            <span className="text-sm text-[#555] leading-snug">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function PlanSkeleton() {
  return (
    <div className="bg-white border border-[#EBEBEB] rounded-3xl p-7 lg:p-8 flex flex-col gap-4 shadow-sm">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <Skeleton className="w-24 h-6" />
      <Skeleton className="w-40 h-4" />
      <Skeleton className="w-32 h-12" />
      <Skeleton className="w-full h-14 rounded-2xl" />
      <div className="space-y-3 mt-2">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="w-full h-4" />)}
      </div>
    </div>
  )
}

// ── Trust signals ─────────────────────────────────────────────────────────────

const TRUST = [
  { icon: ShieldCheck, label: 'Secure payment via Stripe' },
  { icon: RefreshCw, label: 'Cancel anytime, no lock-in' },
  { icon: Sparkles, label: 'Instant access after payment' },
]

// ── Page ──────────────────────────────────────────────────────────────────────

function PricingPage() {
  const navigate = useNavigate()
  const { data: plans, isLoading } = usePlans()
  const createSubscription = useCreateSubscription()

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    // ── Pre-flight auth check ──────────────────────────────────────────────
    const currentUser = auth.currentUser
    if (!currentUser || currentUser.isAnonymous) {
      toast.info('Please sign in to subscribe to a plan.')
      navigate({ to: '/sign-in' })
      return
    }

    // ── Call API ───────────────────────────────────────────────────────────
    try {
      const response = await createSubscription.mutateAsync({ planId: plan.id })

      // Save checkout state to session storage
      sessionStorage.setItem(
        'checkout',
        JSON.stringify({
          clientSecret: response.clientSecret,
          planId: plan.id,
          planLabel: plan.name,
          planPrice: `$${plan.price}`,
          planPeriod: `/ ${plan.billingInterval.toLowerCase()}`,
          features: plan.features,
        }),
      )

      await navigate({ to: '/premium/checkout' })
    } catch (error) {
      const code = classifyApiError(error)
      const msg = getApiErrorMessage(error)

      switch (code) {
        case 'unauthenticated':
          toast.error('Your session has expired. Please sign in again.')
          navigate({ to: '/sign-in' })
          break

        case 'forbidden':
          toast.error('You don\'t have permission to perform this action.')
          break

        case 'conflict':
          toast.info('You already have an active subscription.')
          navigate({ to: '/account' })
          break

        case 'validation':
          toast.error(msg || 'Invalid request. Please try again.')
          break

        case 'rate_limited':
          toast.warning('Too many requests. Please wait a moment and try again.')
          break

        case 'server_error':
          toast.error('Server error. Please try again later.')
          break

        case 'network_error':
          toast.error('Network error. Please check your connection and try again.')
          break

        default:
          toast.error(msg || 'Something went wrong. Please try again.')
      }
    }
  }

  const sortedPlans = plans
    ? [...plans].sort((a) => a.billingInterval === 'Monthly' ? -1 : 1)
    : []

  return (
    <div className="min-h-screen">
      <main className="px-5 lg:px-10 py-14 lg:py-20 w-full max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12 lg:mb-14">
          <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 text-brand-600 text-xs font-semibold px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            Upgrade your Backtrack
          </div>
          <h1 className="text-3xl lg:text-5xl font-extrabold text-[#111] mb-4 leading-tight tracking-tight">
            Plans that grow with you
          </h1>
          <p className="text-[#999] text-base lg:text-lg max-w-md mx-auto">
            Start protecting what matters. Upgrade or cancel anytime.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 mb-12">
          {isLoading ? (
            <>
              <PlanSkeleton />
              <PlanSkeleton />
            </>
          ) : (
            sortedPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isYearly={plan.billingInterval === 'Yearly'}
                onSubscribe={handleSubscribe}
                isPending={createSubscription.isPending}
              />
            ))
          )}
        </div>

        {/* Trust signals */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8">
          {TRUST.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-[#999] text-xs">
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Terms */}
        <p className="text-center text-xs text-[#999] mt-6">
          By subscribing you agree to our{' '}
          <button className="underline underline-offset-2 hover:text-[#555] transition-colors">
            Terms and Conditions
          </button>
          .
        </p>

      </main>
    </div>
  )
}
