import { CalendarDays, ChevronRight } from 'lucide-react'
import { OngoingSubscriptionStatus } from '@/types/subscription.type'
import type { SubscriptionInfo, OngoingSubscriptionStatusType } from '@/types/subscription.type'

export function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export const PLAN_META: Record<string, { name: string; price: string; period: string }> = {
  Monthly: { name: 'Monthly Premium', price: '$1.99', period: '/month' },
  Yearly: { name: 'Annual Premium', price: '$19.99', period: '/year' },
}

const STATUS_BADGE: Record<
  OngoingSubscriptionStatusType,
  { bg: string; text: string; dot: string; label: string }
> = {
  [OngoingSubscriptionStatus.Active]: {
    bg: 'bg-green-100',
    text: 'text-green-600',
    dot: 'bg-green-500',
    label: 'Active',
  },
  [OngoingSubscriptionStatus.PastDue]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-600',
    dot: 'bg-yellow-500',
    label: 'Past Due',
  },
  [OngoingSubscriptionStatus.Unpaid]: {
    bg: 'bg-red-100',
    text: 'text-red-600',
    dot: 'bg-red-500',
    label: 'Unpaid',
  },
}

export function SubscriptionPlanCard({ sub }: { sub: SubscriptionInfo }) {
  const meta = PLAN_META[sub.planType] ?? { name: `${sub.planType} Premium`, price: '—', period: '' }
  const badge = STATUS_BADGE[sub.status]
  const renewLabel = sub.cancelAtPeriodEnd
    ? `Cancels on ${formatDate(sub.currentPeriodEnd)}`
    : `Renews on ${formatDate(sub.currentPeriodEnd)}`

  return (
    <div className="bg-white rounded-3xl p-5 border border-[#EBEBEB] shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
      {/* Plan name + status */}
      <div className="flex items-center gap-2 mb-3">
        <span className="font-bold text-lg text-[#222]">{meta.name}</span>
        {badge && (
          <span
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.bg} ${badge.text}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
            {badge.label}
          </span>
        )}
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-4xl font-extrabold text-[#111]">{meta.price}</span>
        <span className="text-base text-[#999]">{meta.period}</span>
      </div>

      {/* Renewal / cancel date */}
      <div className="flex items-center gap-2 text-sm text-[#666] mb-5">
        <CalendarDays className="w-4 h-4 shrink-0 text-[#999]" />
        <span>{renewLabel}</span>
      </div>

      {/* Payment method */}
      <div className="border-t border-[#F0F0F0] pt-4">
        <p className="text-xs font-semibold text-[#999] uppercase tracking-wide mb-3">
          Payment Method
        </p>
        <button className="w-full flex items-center gap-3 group">
          <div className="px-2 py-1 rounded-md border border-[#EBEBEB] bg-[#F9F9F9]">
            <span className="text-xs font-bold text-brand-600">VISA</span>
          </div>
          <span className="flex-1 text-sm text-[#444] text-left">Manage payment method</span>
          <ChevronRight className="w-4 h-4 text-[#999] group-hover:text-[#444] transition-colors" />
        </button>
      </div>
    </div>
  )
}
