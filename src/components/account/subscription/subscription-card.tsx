import { useState } from 'react'
import { Sparkles, CalendarDays, AlertCircle, Crown, ArrowRight } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useMySubscription, useCancelSubscription } from '@/hooks/use-subscription'
import { SubscriptionCancelDialog } from './subscription-cancel-dialog'
import { OngoingSubscriptionStatus } from '@/types/subscription.type'
import type { SubscriptionInfo, OngoingSubscriptionStatusType } from '@/types/subscription.type'
import { Skeleton } from '@/components/ui/skeleton'

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const statusConfig: Record<
  OngoingSubscriptionStatusType,
  { bg: string; text: string; dot: string; label: string }
> = {
  [OngoingSubscriptionStatus.Active]: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    dot: 'bg-emerald-500',
    label: 'Active',
  },
  [OngoingSubscriptionStatus.PastDue]: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    dot: 'bg-amber-500',
    label: 'Past Due',
  },
  [OngoingSubscriptionStatus.Unpaid]: {
    bg: 'bg-red-50',
    text: 'text-red-600',
    dot: 'bg-red-500',
    label: 'Unpaid',
  },
}

function FooterNote({ sub }: { sub: SubscriptionInfo }) {
  if (sub.status === OngoingSubscriptionStatus.PastDue) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-amber-500">
        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
        <span>Payment past due · Update billing</span>
      </div>
    )
  }
  if (sub.status === OngoingSubscriptionStatus.Unpaid) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-red-500">
        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
        <span>Payment required to restore access</span>
      </div>
    )
  }
  if (sub.cancelAtPeriodEnd) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-amber-500">
        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
        <span>Cancels on {formatDate(sub.currentPeriodEnd)}</span>
      </div>
    )
  }
  return <p className="text-xs text-[#999]">Renews automatically</p>
}

function ActiveCard({ sub, onCancelClick }: { sub: SubscriptionInfo; onCancelClick: () => void }) {
  const status = statusConfig[sub.status] ?? statusConfig[OngoingSubscriptionStatus.Active]

  return (
    <div className="bg-white rounded-3xl border border-[#EBEBEB] shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden">
      {/* Brand accent strip */}
      <div className="h-1 w-full bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600" />

      <div className="p-5">
        {/* Top row */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            {/* Crown icon */}
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 shrink-0">
              <Crown className="h-5 w-5 text-brand-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-500 mb-0.5">
                Premium
              </p>
              <p className="text-base font-extrabold text-[#111] leading-tight">
                {sub.planType} Plan
              </p>
            </div>
          </div>

          {/* Status badge */}
          <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${status.bg} ${status.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>

        {/* Date range */}
        <div className="flex items-center gap-2.5 bg-[#F7F7F7] rounded-2xl px-4 py-3 mb-5">
          <CalendarDays className="h-4 w-4 shrink-0 text-[#999]" />
          <span className="text-sm text-[#555]">{formatDate(sub.currentPeriodStart)}</span>
          <span className="text-[#CCC] text-sm">→</span>
          <span className="text-sm text-[#555]">{formatDate(sub.currentPeriodEnd)}</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <FooterNote sub={sub} />
          {!sub.cancelAtPeriodEnd && (
            <button
              onClick={onCancelClick}
              className="text-xs text-[#BBB] hover:text-red-400 transition-colors ml-3 shrink-0"
            >
              Cancel subscription
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function EmptyCard() {
  const navigate = useNavigate()

  return (
    <div className="bg-brand-50 rounded-3xl p-5" style={{ border: '1.5px dashed var(--brand-200)' }}>
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-100">
          <Sparkles className="h-5 w-5 text-brand-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-[#222]">No active subscription</p>
          <p className="text-xs text-[#999] mt-0.5">Unlock all Premium features</p>
        </div>
        <button
          onClick={() => navigate({ to: '/premium' })}
          className="flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-white transition-all active:scale-95 bg-brand-500 hover:bg-brand-600 shadow-sm shadow-brand-200"
        >
          Upgrade <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}

function SubscriptionCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-[#EBEBEB] overflow-hidden">
      <div className="h-1 w-full bg-[#F0F0F0]" />
      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-2xl" />
            <div className="space-y-1.5">
              <Skeleton className="h-2.5 w-12 rounded-full" />
              <Skeleton className="h-4 w-24 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="h-11 w-full rounded-2xl" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-28 rounded-full" />
          <Skeleton className="h-3 w-24 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function SubscriptionCard() {
  const { data: subscription, isLoading } = useMySubscription()
  const cancelMutation = useCancelSubscription()
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const handleCancelConfirm = async () => {
    await cancelMutation.mutateAsync()
    setShowCancelDialog(false)
  }

  if (isLoading) return <SubscriptionCardSkeleton />

  if (subscription) {
    return (
      <>
        <ActiveCard sub={subscription} onCancelClick={() => setShowCancelDialog(true)} />
        <SubscriptionCancelDialog
          open={showCancelDialog}
          onOpenChange={setShowCancelDialog}
          endDate={subscription.currentPeriodEnd}
          onConfirm={handleCancelConfirm}
          isLoading={cancelMutation.isPending}
        />
      </>
    )
  }

  return <EmptyCard />
}
