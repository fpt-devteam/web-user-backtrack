import { useState } from 'react'
import { Sparkles, CalendarDays, AlertCircle, Crown, ArrowRight } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useMySubscription, useCancelSubscription } from '@/hooks/use-subscription'
import { SubscriptionCancelDialog } from './subscription-cancel-dialog'
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
    bg: 'bg-emerald-400/15',
    text: 'text-emerald-300',
    border: 'border-emerald-400/25',
    dot: 'bg-emerald-400',
    label: 'Active',
  },
  [OngoingSubscriptionStatus.PastDue]: {
    bg: 'bg-amber-400/15',
    text: 'text-amber-300',
    border: 'border-amber-400/25',
    dot: 'bg-amber-400',
    label: 'Past Due',
  },
  [OngoingSubscriptionStatus.Unpaid]: {
    bg: 'bg-red-400/15',
    text: 'text-red-300',
    border: 'border-red-400/25',
    dot: 'bg-red-400',
    label: 'Unpaid',
  },
}

function FooterNote({ sub }: { sub: SubscriptionInfo }) {
  if (sub.status === OngoingSubscriptionStatus.PastDue) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-amber-300/80">
        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
        <span>Payment past due · Update billing</span>
      </div>
    )
  }

  if (sub.status === OngoingSubscriptionStatus.Unpaid) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-red-300/80">
        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
        <span>Payment required to restore access</span>
      </div>
    )
  }

  if (sub.cancelAtPeriodEnd) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-amber-300/80">
        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
        <span>Cancels on {formatDate(sub.currentPeriodEnd)}</span>
      </div>
    )
  }

  return <p className="text-xs text-white/35">Renews automatically</p>
}

function ActiveCard({ sub, onCancelClick }: { sub: SubscriptionInfo; onCancelClick: () => void }) {
  const status = statusConfig[sub.status] ?? statusConfig[OngoingSubscriptionStatus.Active]

  return (
    <div className="relative overflow-hidden rounded-3xl p-5 text-white"
      style={{
        background: 'linear-gradient(135deg, #2d1f6e 0%, #3b1fa8 45%, #2a1b6e 100%)',
        boxShadow: '0 20px 60px -10px rgba(109, 40, 217, 0.35), 0 8px 24px -4px rgba(0,0,0,0.3)',
      }}
    >
      {/* Glow blobs */}
      <div className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }}
      />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }}
      />
      <div className="pointer-events-none absolute top-1/2 left-1/3 h-32 w-32 rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)' }}
      />

      {/* Top row: crown + label + status */}
      <div className="relative flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 4px 12px rgba(245,158,11,0.4)' }}
          >
            <Crown className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40">Premium</p>
            <p className="text-sm font-bold text-white leading-tight">{sub.planType} Plan</p>
          </div>
        </div>

        <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ${status.bg} ${status.text} ${status.border}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      {/* Date range */}
      <div className="relative flex items-center gap-2 mb-4 px-3 py-2.5 rounded-2xl"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <CalendarDays className="h-4 w-4 shrink-0 text-white/40" />
        <span className="text-xs text-white/60">
          {formatDate(sub.currentPeriodStart)}
        </span>
        <span className="text-white/20 text-xs">→</span>
        <span className="text-xs text-white/60">
          {formatDate(sub.currentPeriodEnd)}
        </span>
      </div>

      {/* Divider */}
      <div className="relative h-px mb-3" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }} />

      {/* Footer */}
      <div className="relative flex items-center justify-between">
        <FooterNote sub={sub} />

        {!sub.cancelAtPeriodEnd && (
          <button
            onClick={onCancelClick}
            className="text-xs text-white/30 hover:text-white/60 transition-colors underline underline-offset-2 decoration-white/20 hover:decoration-white/50 ml-3 shrink-0"
          >
            Cancel subscription
          </button>
        )}
      </div>
    </div>
  )
}

function EmptyCard() {
  const navigate = useNavigate()

  return (
    <div className="relative overflow-hidden rounded-3xl p-5"
      style={{ background: 'linear-gradient(135deg, #f8faff 0%, #eef2ff 100%)', border: '1.5px dashed #c7d2fe' }}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-100">
          <Sparkles className="h-5 w-5 text-indigo-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-gray-900">No active subscription</p>
          <p className="text-xs text-gray-400 mt-0.5">Unlock all Premium features</p>
        </div>
        <button
          onClick={() => navigate({ to: '/premium' })}
          className="flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-white transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 12px rgba(99,102,241,0.35)' }}
        >
          Upgrade <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}

function SubscriptionCardSkeleton() {
  return (
    <div className="rounded-3xl p-5 animate-pulse"
      style={{ background: 'linear-gradient(135deg, #2d1f6e 0%, #3b1fa8 45%, #2a1b6e 100%)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-white/10" />
          <div className="space-y-1.5">
            <div className="h-2 w-12 rounded-full bg-white/10" />
            <div className="h-3.5 w-20 rounded-full bg-white/10" />
          </div>
        </div>
        <div className="h-6 w-14 rounded-full bg-white/10" />
      </div>
      <div className="h-10 w-full rounded-2xl bg-white/5 mb-4" />
      <div className="h-px w-full bg-white/10 mb-3" />
      <div className="flex items-center justify-between">
        <div className="h-3 w-28 rounded-full bg-white/10" />
        <div className="h-3 w-24 rounded-full bg-white/10" />
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
