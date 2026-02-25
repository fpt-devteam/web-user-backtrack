import { useState } from 'react'
import { CheckCircle2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PLANS, type Plan } from './plans'

interface PremiumPricingProps {
  onSubscribe?: (plan: Plan) => void
  isPending?: boolean
}

export function PremiumPricing({ onSubscribe, isPending }: Readonly<PremiumPricingProps>) {
  const [selected, setSelected] = useState<'monthly' | 'yearly'>('yearly')

  const selectedPlan = PLANS.find((p) => p.id === selected)!

  return (
    <div className="bg-blue-50 rounded-3xl px-5 py-6 flex flex-col gap-5">
      {/* Plan cards */}
      <div className="grid grid-cols-2 gap-3">
        {PLANS.map((plan) => {
          const isSelected = plan.id === selected
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => setSelected(plan.id)}
              className={cn(
                'relative text-left rounded-2xl px-4 py-4 transition-all duration-200',
                isSelected
                  ? 'bg-blue-100 border-2 border-blue-500 shadow-sm'
                  : 'bg-white border-2 border-transparent shadow-sm hover:border-gray-200',
              )}
            >
              {/* Selected checkmark */}
              {isSelected && (
                <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-blue-500 fill-blue-100" />
              )}

              {/* Label + badge */}
              <div className="flex items-center gap-1.5 flex-wrap mb-2">
                <span className={cn(
                  'text-sm font-semibold',
                  isSelected ? 'text-blue-700' : 'text-gray-500',
                )}>
                  {plan.label}
                </span>
                {plan.badge && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                    {plan.badge}
                  </span>
                )}
              </div>

              {/* Price */}
              <p className="text-2xl font-extrabold text-gray-900 mb-2">{plan.price}</p>

              {/* Description */}
              <p className={cn(
                'text-xs leading-relaxed',
                isSelected ? 'text-blue-600' : 'text-gray-400',
              )}>
                {plan.description}
              </p>
            </button>
          )
        })}
      </div>

      {/* Terms */}
      <p className="text-center text-xs text-gray-400 leading-relaxed px-2">
        By tapping Subscribe button you agree to the{' '}
        <button type="button" className="underline hover:text-gray-600 transition-colors">
          Terms and Conditions
        </button>
        .
      </p>

      {/* Subscribe button */}
      <Button
        onClick={() => onSubscribe?.(selectedPlan)}
        disabled={isPending}
        className="w-full h-14 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-base shadow-lg shadow-blue-200 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        {isPending ? 'Processing…' : 'Subscribe'}
      </Button>
    </div>
  )
}
