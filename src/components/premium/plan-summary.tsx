import { Check, Sparkles } from 'lucide-react'

interface PlanSummaryProps {
  planLabel: string
  planPrice: string
  planPeriod: string
  features?: string[]
}

export function PlanSummary({ planLabel, planPrice, planPeriod, features = [] }: Readonly<PlanSummaryProps>) {
  return (
    <div className="bg-white rounded-3xl px-6 py-7 flex flex-col gap-6 border border-[#EBEBEB] shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-brand-500" />
        </div>
        <div>
          <p className="text-xs font-medium text-[#999] uppercase tracking-wide">Selected Plan</p>
          <p className="text-base font-bold text-[#222]">{planLabel} Premium</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#F0F0F0]" />

      {/* Price */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-4xl font-extrabold text-[#111]">{planPrice}</span>
        <span className="text-sm text-[#999]">{planPeriod}</span>
      </div>

      {/* Features */}
      <div className="flex flex-col gap-3">
        {features.map((feature) => (
          <div key={feature} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 text-brand-500 stroke-[2.5]" />
            </div>
            <span className="text-sm font-medium text-[#444]">{feature}</span>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p className="text-xs text-[#999] leading-relaxed">
        You can cancel your subscription at any time from your account settings.
      </p>
    </div>
  )
}
