import { Check, Sparkles } from 'lucide-react'
import { PREMIUM_FEATURES } from './plans'

interface PlanSummaryProps {
  planLabel: string
  planPrice: string
  planPeriod: string
}

export function PlanSummary({ planLabel, planPrice, planPeriod }: Readonly<PlanSummaryProps>) {
  return (
    <div className="bg-white rounded-3xl px-6 py-7 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Selected Plan</p>
          <p className="text-base font-bold text-gray-900">{planLabel} Premium</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100" />

      {/* Price */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-4xl font-extrabold text-gray-900">{planPrice}</span>
        <span className="text-sm text-gray-400">{planPeriod}</span>
      </div>

      {/* Features */}
      <div className="flex flex-col gap-3">
        {PREMIUM_FEATURES.map((feature) => (
          <div key={feature} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 text-blue-500 stroke-[2.5]" />
            </div>
            <span className="text-sm font-medium text-gray-700">{feature}</span>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p className="text-xs text-gray-400 leading-relaxed">
        You can cancel your subscription at any time from your account settings.
      </p>
    </div>
  )
}
