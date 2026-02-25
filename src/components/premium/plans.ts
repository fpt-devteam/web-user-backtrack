export interface Plan {
  id: 'monthly' | 'yearly'
  label: string
  price: string
  period: string
  description: string
  priceId: string
  badge?: string
}

export const PLANS: Plan[] = [
  {
    id: 'monthly',
    label: 'Monthly',
    price: '$4.99',
    period: 'per month',
    description: 'Month-to-month subscription. Cancel anytime!',
    priceId: import.meta.env.VITE_STRIPE_MONTHLY_PRICE_ID ?? '',
  },
  {
    id: 'yearly',
    label: 'Yearly',
    price: '$49.00',
    period: 'per year',
    description: 'Save more with an annual subscription.',
    priceId: import.meta.env.VITE_STRIPE_YEARLY_PRICE_ID ?? '',
    badge: '-20%',
  },
]

export const PREMIUM_FEATURES = [
  'Custom QR Design Materials',
  'Unlimited High-Res Downloads',
  'Advanced Privacy Controls',
] as const
