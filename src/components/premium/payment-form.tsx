import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? '')

interface PaymentFormInnerProps {
  planLabel: string
  planPrice: string
}

function PaymentFormInner({ planLabel, planPrice }: Readonly<PaymentFormInnerProps>) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsProcessing(true)
    setErrorMessage(null)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${globalThis.location.origin}/premium/success`,
      },
    })

    if (error) {
      setErrorMessage(error.message ?? 'An unexpected error occurred.')
      setIsProcessing(false)
    }
    // On success, Stripe redirects to return_url — no local handling needed
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <PaymentElement
        options={{
          layout: 'tabs',
        }}
      />

      {errorMessage && (
        <p className="text-sm text-red-500 text-center">{errorMessage}</p>
      )}

      <Button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        className="w-full h-14 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-base shadow-lg shadow-blue-200 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        {isProcessing ? 'Processing…' : `Pay ${planPrice}`}
      </Button>

      <p className="text-center text-xs text-gray-400">
        Secured by{' '}
        <span className="font-semibold text-gray-500">Stripe</span>. Your payment info is encrypted.
      </p>
    </form>
  )
}

interface PaymentFormProps {
  clientSecret: string
  planLabel: string
  planPrice: string
}

export function PaymentForm({ clientSecret, planLabel, planPrice }: Readonly<PaymentFormProps>) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#3b82f6',
            borderRadius: '12px',
            fontFamily: 'inherit',
          },
        },
      }}
    >
      <PaymentFormInner planLabel={planLabel} planPrice={planPrice} />
    </Elements>
  )
}
