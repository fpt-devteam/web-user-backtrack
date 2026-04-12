import { Receipt, ExternalLink } from 'lucide-react'
import { usePaymentHistory } from '@/hooks/use-subscription'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import type { PaymentItem } from '@/types/subscription.type'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount)
}

const STATUS_STYLE: Record<string, { bg: string; text: string; dot: string }> = {
  Succeeded: { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' },
  Failed:    { bg: 'bg-red-50',     text: 'text-red-600',     dot: 'bg-red-500'     },
  Pending:   { bg: 'bg-amber-50',   text: 'text-amber-600',   dot: 'bg-amber-500'   },
}

function PaymentRow({ item, isLast }: { item: PaymentItem; isLast: boolean }) {
  const style = STATUS_STYLE[item.status] ?? STATUS_STYLE['Pending']

  return (
    <div className={`flex items-center gap-4 px-5 py-4 ${!isLast ? 'border-b border-[#F0F0F0]' : ''}`}>
      {/* Icon */}
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F7F7F7]">
        <Receipt className="h-4 w-4 text-[#888]" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#222] truncate">
          {formatAmount(item.amount, item.currency)}
        </p>
        <p className="text-xs text-[#999] mt-0.5">{formatDate(item.paymentDate)}</p>
      </div>

      {/* Status & View */}
      <div className="flex items-center gap-3 shrink-0">
        <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${style.bg} ${style.text}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
          {item.status}
        </span>

        {item.invoiceUrl && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-[#999] hover:text-[#222] hover:bg-[#F7F7F7]"
            onClick={() => window.open(item.invoiceUrl, '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

function PaymentHistorySkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-[#EBEBEB] shadow-[0_2px_8px_rgba(0,0,0,0.05)] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#F0F0F0]">
        <Skeleton className="h-4 w-32" />
      </div>
      {[1, 2].map((i) => (
        <div key={i} className={`flex items-center gap-4 px-5 py-4 ${i < 2 ? 'border-b border-[#F0F0F0]' : ''}`}>
          <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      ))}
    </div>
  )
}

export function PaymentHistory() {
  const { data, isLoading } = usePaymentHistory()

  if (isLoading) return <PaymentHistorySkeleton />

  const items = data?.items ?? []

  return (
    <div className="bg-white rounded-3xl border border-[#EBEBEB] shadow-[0_2px_8px_rgba(0,0,0,0.05)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F0F0]">
        <p className="text-sm font-semibold text-[#222]">Payment History</p>
        {data && data.total > 0 && (
          <span className="text-xs text-[#999]">{data.total} {data.total === 1 ? 'payment' : 'payments'}</span>
        )}
      </div>

      {/* Rows */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <div className="w-10 h-10 rounded-full bg-[#F7F7F7] flex items-center justify-center">
            <Receipt className="w-5 h-5 text-[#CCC]" />
          </div>
          <p className="text-sm font-medium text-[#999]">No payments yet</p>
        </div>
      ) : (
        items.map((item, i) => (
          <PaymentRow key={item.id} item={item} isLast={i === items.length - 1} />
        ))
      )}
    </div>
  )
}
