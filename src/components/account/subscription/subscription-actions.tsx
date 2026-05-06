import { CreditCard, Loader2 } from 'lucide-react'
import { useCustomerPortal } from '@/hooks/use-subscription'
import { useAuth } from '@/hooks/use-auth'

export function SubscriptionActions() {
  const { profile } = useAuth()
  const { mutate: openPortal, isPending } = useCustomerPortal()

  function handleUpdatePaymentMethod() {
    if (!profile) return
    openPortal({ userId: profile.id, returnUrl: window.location.href })
  }

  return (
    <button
      onClick={handleUpdatePaymentMethod}
      disabled={isPending || !profile}
      className="flex items-center gap-2 px-5 py-2.5 border border-[#dddddd] text-[#222222] rounded-[20px] text-sm font-medium hover:border-[#222222] transition-colors active:scale-[0.92] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending
        ? <><Loader2 className="w-4 h-4 animate-spin" /> Opening…</>
        : <><CreditCard className="w-4 h-4" /> Update payment method</>
      }
    </button>
  )
}
