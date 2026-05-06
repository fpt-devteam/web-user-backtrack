import { useState } from 'react'
import {
  CalendarDays,
  ShieldCheck,
  FileText,
  ExternalLink,
  TriangleAlert,
  CreditCard,
  Loader2,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import {
  useMySubscription,
  usePaymentHistory,
  useCustomerPortal,
  useCancelSubscription,
} from '@/hooks/use-subscription'
import { useAuth } from '@/hooks/use-auth'
import { formatDate } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  Active:  { label: 'Active',   cls: 'bg-[#e8f9f0] text-[#06c167]' },
  PastDue: { label: 'Past Due', cls: 'bg-[#fff8e6] text-[#c97a00]' },
  Unpaid:  { label: 'Unpaid',   cls: 'bg-[#fff0f2] text-[#c13515]' },
}

const PAYMENT_STATUS: Record<string, { label: string; cls: string }> = {
  Succeeded: { label: 'Paid',    cls: 'text-[#06c167] bg-[#e8f9f0]' },
  Pending:   { label: 'Pending', cls: 'text-[#c97a00] bg-[#fff8e6]' },
  Failed:    { label: 'Failed',  cls: 'text-[#c13515] bg-[#fff0f2]' },
}

function BillingTabSkeleton() {
  return (
    <div className="space-y-5">
      <div className="bg-white rounded-[16px] border border-[#dddddd] p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-3.5 w-24" />
          </div>
          <div className="space-y-1.5 text-right">
            <Skeleton className="h-8 w-20 ml-auto" />
            <Skeleton className="h-3.5 w-14 ml-auto" />
          </div>
        </div>
        <Skeleton className="h-px w-full" />
        <div className="space-y-3">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-9 w-64" />
        </div>
      </div>
      <div className="bg-white rounded-[16px] border border-[#dddddd] overflow-hidden">
        <div className="px-6 py-5 border-b border-[#f0f0f0]">
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="px-6 py-4 space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  )
}

export function BillingTab() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { data: subscription, isLoading } = useMySubscription()
  const { data: paymentHistory, isLoading: loadingPayments } = usePaymentHistory()
  const { mutate: openPortal, isPending: openingPortal } = useCustomerPortal()
  const cancelMutation = useCancelSubscription()
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  const plan = subscription?.planSnapshot
  const isFree = (plan?.price ?? 0) === 0

  const handleUpdatePayment = () => {
    if (!profile) return
    openPortal({ userId: profile.id, returnUrl: window.location.href })
  }

  const handleConfirmCancel = async () => {
    await cancelMutation.mutateAsync()
    setShowCancelDialog(false)
  }

  if (isLoading) return <BillingTabSkeleton />

  if (!subscription) {
    return (
      <div className="bg-brand-50 rounded-[16px] p-6" style={{ border: '1.5px dashed var(--brand-200)' }}>
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
            className="flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-white bg-brand-500 hover:bg-brand-600 active:scale-95 transition-all shadow-sm"
          >
            Upgrade <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    )
  }

  const statusBadge = STATUS_BADGE[subscription.status] ?? STATUS_BADGE['Active']

  return (
    <>
      <div className="space-y-5">
        {/* ── Plan card ── */}
        <div className="bg-white rounded-[16px] border border-[#dddddd] overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-[#f0f0f0]">
            <div className="flex items-start justify-between gap-4">
              <div>
                {subscription.cancelAtPeriodEnd ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mb-3 bg-[#f5f5f5] text-[#6a6a6a]">
                    Cancels {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                ) : (
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold mb-3 uppercase tracking-wider ${statusBadge.cls}`}>
                    {statusBadge.label}
                  </span>
                )}
                <h3 className="text-xl font-bold text-[#222222] leading-tight">
                  {plan?.name ?? 'Premium'}
                </h3>
                <p className="text-[#6a6a6a] text-sm mt-0.5">
                  Billed {plan?.billingInterval?.toLowerCase() ?? 'monthly'}
                </p>
              </div>
              {plan && !isFree && (
                <div className="text-right shrink-0">
                  <div className="text-3xl font-bold text-[#222222]">
                    ${plan.price.toFixed(2)}
                  </div>
                  <div className="text-[#6a6a6a] text-sm">
                    /{plan.billingInterval === 'Yearly' ? 'year' : 'month'}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="px-6 py-5 md:flex hidden items-end justify-between gap-6">
            <div className="space-y-4 flex-1 min-w-0">
              {!isFree && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#fff0f2] flex items-center justify-center shrink-0">
                    <CalendarDays className="w-4 h-4 text-[#ff385c]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6a6a6a]">Auto-renews on</p>
                    <p className="text-sm font-medium text-[#222222]">
                      {formatDate(subscription.currentPeriodEnd)}
                    </p>
                  </div>
                </div>
              )}
              {plan && plan.features.length > 0 && (
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#f0f7ff] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-[#0070f3]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6a6a6a] mb-2">Included features</p>
                    <div className="flex flex-wrap gap-2">
                      {plan.features.map(f => (
                        <span key={f} className="px-2.5 py-0.5 bg-[#f7f7f7] text-[#222222] text-xs rounded-full border border-[#ebebeb]">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!isFree && (
              <button
                onClick={handleUpdatePayment}
                disabled={openingPortal}
                className="shrink-0 flex items-center gap-2 px-5 py-2.5 border border-[#dddddd] text-[#222222] rounded-[20px] text-sm font-medium hover:border-[#222222] transition-colors active:scale-[0.92] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {openingPortal
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Opening…</>
                  : <><CreditCard className="w-4 h-4" /> Update payment method</>
                }
              </button>
            )}
          </div>
        </div>

        {/* ── Invoices ── */}
        <div className="bg-white rounded-[16px] border border-[#dddddd] overflow-hidden">
          <div className="px-6 py-5 flex items-center gap-3 border-b border-[#f0f0f0]">
            <div className="w-8 h-8 rounded-full bg-[#fff8e6] flex items-center justify-center">
              <FileText className="w-4 h-4 text-[#c97a00]" />
            </div>
            <h3 className="font-semibold text-[#222222]">Invoices</h3>
          </div>

          {loadingPayments ? (
            <div className="flex items-center justify-center h-24">
              <Loader2 className="w-5 h-5 animate-spin text-[#6a6a6a]" />
            </div>
          ) : !paymentHistory?.items.length ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <div className="w-12 h-12 rounded-full bg-[#f7f7f7] flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#aaa]" />
              </div>
              <p className="text-[#6a6a6a] text-sm">No invoices yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#fafafa] text-[#6a6a6a] text-xs uppercase tracking-wider">
                    <th className="px-6 py-3 text-left font-medium">Date</th>
                    <th className="px-6 py-3 text-left font-medium">Total</th>
                    <th className="px-6 py-3 text-left font-medium">Status</th>
                    <th className="px-6 py-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f5f5]">
                  {paymentHistory.items.map(row => {
                    const ps = PAYMENT_STATUS[row.status] ?? PAYMENT_STATUS['Pending']
                    return (
                      <tr key={row.id} className="hover:bg-[#fafafa] transition-colors">
                        <td className="px-6 py-4 text-[#222222] font-medium whitespace-nowrap">
                          {formatDate(row.paymentDate)}
                        </td>
                        <td className="px-6 py-4 text-[#222222] font-semibold">
                          ${row.amount.toFixed(2)}
                          <span className="text-xs text-[#6a6a6a] font-normal ml-1">
                            {row.currency?.toLowerCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${ps.cls}`}>
                            {ps.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {row.invoiceUrl ? (
                            <a
                              href={row.invoiceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-[#0070f3] hover:text-[#0060d3] text-sm font-medium transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" /> View
                            </a>
                          ) : (
                            <span className="text-[#bbb] text-sm">—</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Cancellation ── */}
        <div className="bg-white rounded-[16px] border border-[#ffd6d6] overflow-hidden">
          <div className="px-6 py-5 flex items-center gap-3 border-b border-[#ffd6d6]">
            <div className="w-8 h-8 rounded-full bg-[#fff0f2] flex items-center justify-center">
              <TriangleAlert className="w-4 h-4 text-[#c13515]" />
            </div>
            <h3 className="font-semibold text-[#c13515]">Cancellation</h3>
          </div>
          <div className="px-6 py-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#222222]">Cancel your plan</p>
              <p className="text-xs text-[#6a6a6a] mt-0.5">
                Your subscription will remain active until the end of the billing period.
              </p>
            </div>
            <button
              onClick={() => setShowCancelDialog(true)}
              disabled={subscription.cancelAtPeriodEnd || isFree}
              title={
                subscription.cancelAtPeriodEnd
                  ? 'Already scheduled for cancellation'
                  : isFree
                  ? 'Not available on a free plan'
                  : undefined
              }
              className="shrink-0 px-5 py-2 bg-[#c13515] text-white rounded-[20px] text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:bg-[#a02a10] enabled:active:scale-[0.92]"
            >
              Cancel plan
            </button>
          </div>
        </div>
      </div>

      {/* ── Cancel dialog ── */}
      {showCancelDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !cancelMutation.isPending && setShowCancelDialog(false)}
          />
          <div className="relative bg-white rounded-[20px] shadow-xl w-full max-w-md p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#fff0f2] flex items-center justify-center shrink-0">
                <TriangleAlert className="w-5 h-5 text-[#c13515]" />
              </div>
              <div>
                <h3 className="font-bold text-[#222222]">Cancel subscription?</h3>
                <p className="text-xs text-[#6a6a6a] mt-0.5">You can re-subscribe at any time.</p>
              </div>
            </div>
            <div className="bg-[#f7f7f7] rounded-[12px] px-4 py-3 text-sm text-[#6a6a6a]">
              Your subscription will remain active until{' '}
              <span className="font-medium text-[#222222]">
                {formatDate(subscription.currentPeriodEnd)}
              </span>. After that, access to paid features will be removed.
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelDialog(false)}
                disabled={cancelMutation.isPending}
                className="flex-1 py-2.5 border border-[#dddddd] text-[#222222] rounded-[20px] text-sm font-medium hover:border-[#222222] transition-colors disabled:opacity-50"
              >
                Keep plan
              </button>
              <button
                onClick={() => void handleConfirmCancel()}
                disabled={cancelMutation.isPending}
                className="flex-1 py-2.5 bg-[#c13515] text-white rounded-[20px] text-sm font-medium hover:bg-[#a02a10] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {cancelMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {cancelMutation.isPending ? 'Cancelling…' : 'Yes, cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
