import { AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { formatDate } from './subscription-plan-card'

interface CancelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  endDate: Date
  onConfirm: () => void
  isLoading: boolean
}

export function SubscriptionCancelDialog({
  open,
  onOpenChange,
  endDate,
  onConfirm,
  isLoading,
}: CancelDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="rounded-3xl border-0 shadow-xl max-w-sm">
        <DialogHeader className="items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <div className="space-y-1">
            <DialogTitle className="text-lg font-bold text-gray-900">
              Cancel your subscription?
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Your Premium access continues until{' '}
              <span className="font-semibold text-gray-700">{formatDate(endDate)}</span>. After
              that, you'll lose access to Premium features.
            </DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full h-12 rounded-2xl bg-red-500 hover:bg-red-600 disabled:opacity-60 transition-colors text-white font-semibold text-sm"
          >
            {isLoading ? 'Cancelling…' : 'Cancel Subscription'}
          </button>
          <button
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="w-full h-12 rounded-2xl border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700 font-semibold text-sm"
          >
            Keep Plan
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
