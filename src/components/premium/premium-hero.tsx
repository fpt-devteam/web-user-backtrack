import { Check } from 'lucide-react'

const FEATURES = [
  'Custom QR Design Materials',
  'Unlimited High-Res Downloads',
  'Advanced Privacy Controls',
] as const

export function PremiumHero() {
  return (
    <div className="bg-white rounded-3xl px-7 py-8 lg:py-10">
      <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-3">
        Unlock Backtrack Premium
      </h1>
      <p className="text-gray-400 text-base mb-8 lg:mb-10">
        Subscribe today to enjoy Premium Access
      </p>

      <div className="flex flex-col gap-5">
        {FEATURES.map((feature) => (
          <div key={feature} className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4 text-blue-500 stroke-[2.5]" />
            </div>
            <span className="font-bold text-gray-900 text-base">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
