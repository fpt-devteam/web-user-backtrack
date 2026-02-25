interface SubscriptionActionsProps {
  onCancelClick: () => void
  cancelAtPeriodEnd: boolean
}

export function SubscriptionActions({ onCancelClick, cancelAtPeriodEnd }: SubscriptionActionsProps) {
  return (
    <div className="flex flex-col gap-3 mt-2">
      <button className="w-full h-14 rounded-2xl bg-blue-500 hover:bg-blue-600 active:scale-95 transition-all text-white font-bold text-base shadow-sm shadow-blue-200">
        Update Payment Method
      </button>
      <button
        onClick={onCancelClick}
        disabled={cancelAtPeriodEnd}
        className="w-full h-14 rounded-2xl border border-red-200 hover:bg-red-50 active:scale-95 transition-all text-red-500 font-semibold text-base disabled:opacity-40 disabled:pointer-events-none"
      >
        {cancelAtPeriodEnd ? 'Cancellation Scheduled' : 'Cancel Subscription'}
      </button>
    </div>
  )
}
