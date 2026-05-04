import { useEffect, useRef, useState } from 'react'
import { CalendarDays, ChevronDown } from 'lucide-react'

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAY_LABELS = ['Su','Mo','Tu','We','Th','Fr','Sa']

export function DateTimePill({ label, value, onChange }: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const parsed = value ? new Date(value) : null
  const [viewYear, setViewYear] = useState(() => parsed?.getFullYear() ?? new Date().getFullYear())
  const [viewMonth, setViewMonth] = useState(() => parsed?.getMonth() ?? new Date().getMonth())
  const [timeHH, setTimeHH] = useState(() => parsed ? String(parsed.getHours()).padStart(2, '0') : '00')
  const [timeMM, setTimeMM] = useState(() => parsed ? String(parsed.getMinutes()).padStart(2, '0') : '00')

  const selDay = parsed?.getDate() ?? null
  const selMonth = parsed?.getMonth() ?? null
  const selYear = parsed?.getFullYear() ?? null

  const hasValue = !!value
  const displayLabel = hasValue && parsed
    ? `${String(parsed.getDate()).padStart(2,'0')}/${String(parsed.getMonth()+1).padStart(2,'0')}/${parsed.getFullYear()} ${String(parsed.getHours()).padStart(2,'0')}:${String(parsed.getMinutes()).padStart(2,'0')}`
    : label

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [open])

  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const cells: Array<number | null> = [
    ...Array<null>(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const today = new Date()

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }
  function selectDay(day: number) {
    const ds = `${viewYear}-${String(viewMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    onChange(`${ds}T${timeHH}:${timeMM}`)
  }
  function updateTime(hh: string, mm: string) {
    setTimeHH(hh); setTimeMM(mm)
    if (selYear !== null && selMonth !== null && selDay !== null) {
      const ds = `${selYear}-${String(selMonth+1).padStart(2,'0')}-${String(selDay).padStart(2,'0')}`
      onChange(`${ds}T${hh}:${mm}`)
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={[
          'flex items-center gap-1.5 px-4 py-1.5 rounded-full border text-sm font-medium transition-colors whitespace-nowrap cursor-pointer',
          hasValue
            ? 'border-[#222222] bg-[#222222] text-white'
            : 'border-[#dddddd] text-[#222222] bg-white hover:border-[#222222]',
        ].join(' ')}
      >
        <CalendarDays className="w-3.5 h-3.5 shrink-0" />
        {displayLabel}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 z-50 bg-white border border-[#dddddd] rounded-2xl shadow-xl p-4 w-72">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={prevMonth}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f7f7f7] transition-colors cursor-pointer"
            >
              <ChevronDown className="w-4 h-4 rotate-90" />
            </button>
            <span className="text-[13px] font-bold text-[#222222]">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f7f7f7] transition-colors cursor-pointer"
            >
              <ChevronDown className="w-4 h-4 -rotate-90" />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-1">
            {DAY_LABELS.map(d => (
              <div key={d} className="text-center text-[11px] font-semibold text-[#9CA3AF] py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-0.5">
            {cells.map((day, i) => {
              if (!day) return <div key={i} />
              const isSelected = day === selDay && viewMonth === selMonth && viewYear === selYear
              const isToday = day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectDay(day)}
                  className={[
                    'relative mx-auto w-8 h-8 flex items-center justify-center text-[13px] font-medium rounded-full transition-colors cursor-pointer',
                    isSelected
                      ? 'bg-[#222222] text-white'
                      : 'text-[#222222] hover:bg-[#f7f7f7]',
                  ].join(' ')}
                >
                  {day}
                  {isToday && !isSelected && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#222222]" />
                  )}
                </button>
              )
            })}
          </div>

          <div className="border-t border-[#f3f4f6] mt-3 pt-3">
            <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-2">Time</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={23}
                value={timeHH}
                onChange={(e) => {
                  const v = String(Math.min(23, Math.max(0, Number(e.target.value)))).padStart(2, '0')
                  updateTime(v, timeMM)
                }}
                className="w-14 h-9 text-center rounded-xl border border-[#E5E7EB] text-[13px] font-semibold text-[#111] bg-[#f9fafb] focus:outline-none focus:ring-2 focus:ring-[#222222] focus:border-transparent [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <span className="text-[16px] font-bold text-[#222222]">:</span>
              <input
                type="number"
                min={0}
                max={59}
                value={timeMM}
                onChange={(e) => {
                  const v = String(Math.min(59, Math.max(0, Number(e.target.value)))).padStart(2, '0')
                  updateTime(timeHH, v)
                }}
                className="w-14 h-9 text-center rounded-xl border border-[#E5E7EB] text-[13px] font-semibold text-[#111] bg-[#f9fafb] focus:outline-none focus:ring-2 focus:ring-[#222222] focus:border-transparent [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
