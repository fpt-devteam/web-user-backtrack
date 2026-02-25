import { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, Clock, XCircle, ArrowRight } from 'lucide-react'
import { BacktrackHeader } from '@/components/shared/backtrack-header'

export const Route = createFileRoute('/premium/success/')({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect_status: (search.redirect_status as string) ?? '',
    payment_intent: (search.payment_intent as string) ?? '',
  }),
  component: PremiumSuccessPage,
})

type Status = 'succeeded' | 'processing' | 'failed'

const STATUS_CONFIG: Record<
  Status,
  {
    icon: React.ElementType
    iconBg: string
    iconColor: string
    title: string
    description: string
  }
> = {
  succeeded: {
    icon: CheckCircle2,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-500',
    title: 'Payment successful!',
    description: 'Welcome to Premium. Your subscription is now active and all features are unlocked.',
  },
  processing: {
    icon: Clock,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-500',
    title: 'Payment processing',
    description: "We're confirming your payment. This usually takes a few moments — your subscription will activate shortly.",
  },
  failed: {
    icon: XCircle,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-500',
    title: 'Payment failed',
    description: 'Something went wrong with your payment. Please try again or use a different payment method.',
  },
}

function PremiumSuccessPage() {
  const navigate = useNavigate()
  const { redirect_status } = Route.useSearch()
  const queryClient = useQueryClient()

  const status: Status =
    redirect_status === 'succeeded'
      ? 'succeeded'
      : redirect_status === 'processing'
        ? 'processing'
        : 'failed'

  useEffect(() => {
    sessionStorage.removeItem('checkout')
    if (status === 'succeeded' || status === 'processing') {
      queryClient.invalidateQueries({ queryKey: ['subscription', 'me'] })
    }
  }, [status, queryClient])

  const config = STATUS_CONFIG[status]
  const Icon = config.icon

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <BacktrackHeader />
      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm flex flex-col items-center text-center gap-6">
          {/* Icon */}
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${config.iconBg}`}>
            <Icon className={`w-10 h-10 ${config.iconColor}`} />
          </div>

          {/* Text */}
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-gray-900">{config.title}</h1>
            <p className="text-sm text-gray-500 leading-relaxed">{config.description}</p>
          </div>

          {/* Actions */}
          <div className="w-full flex flex-col gap-3 pt-2">
            {status === 'failed' ? (
              <>
                <button
                  onClick={() => navigate({ to: '/premium/checkout' })}
                  className="w-full h-13 rounded-2xl bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all text-white font-bold text-base flex items-center justify-center gap-2 shadow-sm shadow-blue-200"
                >
                  Try Again <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate({ to: '/' })}
                  className="w-full h-13 rounded-2xl border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600 font-semibold text-base"
                >
                  Back to Home
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate({ to: '/account' })}
                  className="w-full h-13 rounded-2xl bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all text-white font-bold text-base flex items-center justify-center gap-2 shadow-sm shadow-blue-200"
                >
                  Go to Account <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate({ to: '/' })}
                  className="w-full h-13 rounded-2xl border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600 font-semibold text-base"
                >
                  Back to Home
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
