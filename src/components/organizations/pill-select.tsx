import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

export function PillSelect({ label, value, onChange, options, disabled }: {
  label: string
  value: string
  onChange: (v: string) => void
  options: Array<{ value: string; label: string }>
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = options.find(o => o.value === value)
  const hasValue = !!value
  const buttonLabel = hasValue ? `${label}: ${selected?.label ?? value}` : label

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(o => !o)}
        className={[
          'flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-sm font-medium transition-colors whitespace-nowrap cursor-pointer',
          disabled
            ? 'border-[#dddddd] text-[#B0B7C3] bg-white cursor-not-allowed'
            : hasValue
              ? 'border-[#222222] bg-[#222222] text-white'
              : 'border-[#dddddd] text-[#222222] bg-white hover:border-[#222222]',
        ].join(' ')}
      >
        {buttonLabel}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && !disabled && (
        <div className="absolute left-0 top-full mt-2 z-50 min-w-[180px] bg-white border border-[#dddddd] rounded-xl shadow-lg py-1 overflow-hidden">
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false) }}
              className="w-full flex items-center justify-between px-4 py-2 text-sm text-[#222222] hover:bg-[#f7f7f7] transition-colors"
            >
              <span>{opt.label}</span>
              {value === opt.value && <Check className="w-3.5 h-3.5 text-[#222222]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
