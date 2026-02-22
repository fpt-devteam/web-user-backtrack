import { useEffect, useState } from 'react'
import { MailOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  ResponsiveDialogRoot,
  ResponsiveDialogContent,
  ResponsiveDialogClose,
} from '@/components/shared/responsive-dialog'

interface AccountNotVerifiedModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onResend?: () => void
}

const RESEND_SECONDS = 59

export function AccountNotVerifiedModal({
  open,
  onOpenChange,
  onResend,
}: Readonly<AccountNotVerifiedModalProps>) {
  const [seconds, setSeconds] = useState(RESEND_SECONDS)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (!open) return

    setSeconds(RESEND_SECONDS)
    setCanResend(false)

    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(interval)
          setCanResend(true)
          return 0
        }
        return s - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [open])

  const handleResend = () => {
    if (!canResend) return
    onResend?.()
    setSeconds(RESEND_SECONDS)
    setCanResend(false)
  }

  const formattedTime = `0:${String(seconds).padStart(2, '0')}`

  return (
    <ResponsiveDialogRoot open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent aria-describedby="not-verified-desc">
        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
            <div className="relative">
              <MailOpen className="w-9 h-9 text-amber-500" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-amber-100" />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-gray-900 leading-tight mb-3">
            Account exists but not verified
          </h2>
          <p id="not-verified-desc" className="text-gray-500 text-base leading-relaxed">
            Please verify your email to continue using Backtrack.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button
            disabled={!canResend}
            onClick={handleResend}
            className="w-full h-14 rounded-2xl bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-bold text-base shadow-lg shadow-blue-200 active:scale-95 transition-all duration-200"
          >
            Resend Verification Email
          </Button>

          {!canResend && (
            <p className="text-center text-sm text-gray-400">
              Resend again in {formattedTime}
            </p>
          )}

          <ResponsiveDialogClose asChild>
            <button
              type="button"
              className="w-full py-3 text-base font-bold text-gray-800 hover:text-gray-600 transition-colors"
            >
              Cancel
            </button>
          </ResponsiveDialogClose>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialogRoot>
  )
}
