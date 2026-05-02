import { AlertTriangle } from 'lucide-react'

export function PolicyRow() {
  return (
    <div className="flex items-start gap-3 px-4 py-3.5 bg-amber-50 border border-amber-200 rounded-2xl mt-3 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
      <div>
        <p className="text-sm font-black text-[#111] mb-1">Retention policy</p>
        <p className="text-xs text-[#666] leading-relaxed">
          Items are stored for up to <strong>30 days</strong>. High-value items are handed over
          to the local police after <strong>7 days</strong> if unclaimed.
        </p>
      </div>
    </div>
  )
}
