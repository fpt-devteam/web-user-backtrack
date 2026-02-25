import { Sparkles, CalendarDays, AlertCircle, ArrowRight } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useMySubscription } from '@/hooks/use-subscription'
import { OngoingSubscriptionStatus } from '@/types/subscription.type'
import type { SubscriptionInfo, OngoingSubscriptionStatusType } from '@/types/subscription.type'

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const statusConfig: Record<
  OngoingSubscriptionStatusType,
  { bg: string; text: string; border: string; dot: string; label: string }
> = {
  [OngoingSubscriptionStatus.Active]: {
    bg: 'bg-green-400/20',
    text: 'text-green-300',
    border: 'border-green-400/30',
    dot: 'bg-green-400',
    label: 'Active',
  },
  [OngoingSubscriptionStatus.PastDue]: {
    bg: 'bg-yellow-400/20',
    text: 'text-yellow-300',
    border: 'border-yellow-400/30',
    dot: 'bg-yellow-400',
    label: 'Past Due',
  },
  [OngoingSubscriptionStatus.Unpaid]: {
    bg: 'bg-red-400/20',
    text: 'text-red-300',
    border: 'border-red-400/30',
    dot: 'bg-red-400',
    label: 'Unpaid',
  },
}

function FooterNote({ sub }: { sub: SubscriptionInfo }) {
  if (sub.status === OngoingSubscriptionStatus.PastDue) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-yellow-300">
        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
        <span>Payment past due &middot; Please update your billing</span>
      </div>
    )
  }

  if (sub.status === OngoingSubscriptionStatus.Unpaid) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-red-300">
        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
        <span>Payment required to restore access</span>
      </div>
    )
  }

  if (sub.cancelAtPeriodEnd) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-yellow-300">
        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
        <span>Cancels on {formatDate(sub.currentPeriodEnd)}</span>
      </div>
    )
  }

  return <p className="text-xs text-blue-200">Renews automatically</p>
}

function ActiveCard({ sub }: { sub: SubscriptionInfo }) {
  const navigate = useNavigate()
  const status = statusConfig[sub.status] ?? statusConfig[OngoingSubscriptionStatus.Active]

  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-600 to-indigo-700 p-5 text-white shadow-lg shadow-blue-200">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-6 -right-2 h-24 w-24 rounded-full bg-white/5" />

      {/* Header row */}
      <div className="relative flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-base">{sub.planType} Plan</span>
        </div>

        <span
          className={`flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold border ${status.bg} ${status.text} ${status.border}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      {/* Period row */}
      <div className="relative flex items-center gap-1.5 text-sm text-blue-100 mb-4">
        <CalendarDays className="h-4 w-4 shrink-0" />
        <span>
          {formatDate(sub.currentPeriodStart)} &rarr; {formatDate(sub.currentPeriodEnd)}
        </span>
      </div>

      {/* Footer row */}
      <div className="relative flex items-center justify-between">
        <FooterNote sub={sub} />

        <button
          onClick={() => navigate({ to: '/account/subscription' })}
          className="flex shrink-0 items-center gap-1 rounded-xl bg-white/15 hover:bg-white/25 transition-colors px-3 py-1.5 text-xs font-semibold text-white ml-3"
        >
          Manage <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}

function EmptyCard() {
  const navigate = useNavigate()

  return (
    <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
          <Sparkles className="h-5 w-5 text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-900">No active subscription</p>
          <p className="text-xs text-gray-400 mt-0.5">Upgrade to Premium to unlock all features</p>
        </div>
        <button
          onClick={() => navigate({ to: '/premium' })}
          className="flex shrink-0 items-center gap-1 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors px-3 py-1.5 text-xs font-semibold text-white shadow-sm shadow-blue-200"
        >
          Upgrade <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}

function SubscriptionCardSkeleton() {
  return (
    <div className="rounded-3xl bg-white p-5 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gray-200" />
          <div className="h-4 w-28 rounded-full bg-gray-200" />
        </div>
        <div className="h-5 w-16 rounded-full bg-gray-200" />
      </div>
      <div className="flex items-center gap-1.5 mb-4">
        <div className="h-4 w-4 rounded bg-gray-200" />
        <div className="h-4 w-52 rounded-full bg-gray-200" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-4 w-32 rounded-full bg-gray-200" />
        <div className="h-7 w-20 rounded-xl bg-gray-200" />
      </div>
    </div>
  )
}

export function SubscriptionCard() {
  const { data: subscription, isLoading } = useMySubscription()

  if (isLoading) return <SubscriptionCardSkeleton />
  if (subscription) return <ActiveCard sub={subscription} />
  return <EmptyCard />
}
