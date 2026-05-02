import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Package,
  Search,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { InventoryCard } from './inventory-card'

/* ── Date helpers ── */
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function formatDateShort(d: Date): string {
  return `${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getDate()}`
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

export function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

/* ── Calendar Month ── */
function CalendarMonth({
  year, month, startDate, endDate, hoverDate, today,
  onDayClick, onDayHover,
}: {
  year: number
  month: number
  startDate: Date | null
  endDate: Date | null
  hoverDate: Date | null
  today: Date
  onDayClick: (d: Date) => void
  onDayHover: (d: Date | null) => void
}) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const rangeEnd = endDate ?? hoverDate

  const cells: Array<Date | null> = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="flex-1 min-w-0">
      <p className="text-center text-[13px] font-black text-[#111] mb-3">
        {MONTH_NAMES[month]} {year}
      </p>
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center text-[11px] font-bold text-[#9CA3AF] py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} />

          const isToday = isSameDay(day, today)
          const isStart = startDate ? isSameDay(day, startDate) : false
          const isEnd = endDate ? isSameDay(day, endDate) : false
          const isEndpoint = isStart || isEnd

          const inRange = startDate && rangeEnd && !isEndpoint &&
            startOfDay(day) > startOfDay(startDate) &&
            startOfDay(day) < startOfDay(rangeEnd)

          const isPast = startOfDay(day) < startOfDay(today)

          return (
            <div key={idx} className="relative flex items-center justify-center h-9">
              {inRange && (
                <div className="absolute inset-y-1 inset-x-0 bg-brand-primary/10" />
              )}
              {isStart && rangeEnd && !isSameDay(startDate!, rangeEnd) && (
                <div className="absolute inset-y-1 right-0 left-1/2 bg-brand-primary/10" />
              )}
              {isEnd && startDate && !isSameDay(startDate, endDate!) && (
                <div className="absolute inset-y-1 left-0 right-1/2 bg-brand-primary/10" />
              )}
              <button
                onClick={() => !isPast && onDayClick(day)}
                onMouseEnter={() => onDayHover(day)}
                onMouseLeave={() => onDayHover(null)}
                disabled={isPast}
                className={[
                  'relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-[13px] transition-colors',
                  isPast ? 'text-[#D1D5DB] cursor-default' : 'cursor-pointer',
                  isEndpoint
                    ? 'bg-brand-primary text-white font-bold'
                    : isToday
                      ? 'text-red-500 font-black'
                      : !isPast
                        ? 'hover:bg-[#F3F4F6] text-[#374151]'
                        : '',
                ].join(' ')}
              >
                {day.getDate()}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Date Range Picker ── */
function DateRangePicker({
  startDate, endDate, onChange, onClose,
}: {
  startDate: Date | null
  endDate: Date | null
  onChange: (start: Date | null, end: Date | null) => void
  onClose: () => void
}) {
  const today = startOfDay(new Date())
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [hoverDate, setHoverDate] = useState<Date | null>(null)

  const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1
  const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear

  function prevMonthNav() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonthNav() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  function handleDayClick(day: Date) {
    if (!startDate || endDate) {
      onChange(day, null)
    } else {
      if (startOfDay(day) < startOfDay(startDate)) {
        onChange(day, startDate)
      } else {
        onChange(startDate, day)
      }
    }
  }

  let footerText = 'Select start date'
  if (startDate && !endDate) footerText = 'Select end date'
  if (startDate && endDate) footerText = `${formatDateShort(startDate)} – ${formatDateShort(endDate)}`

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] w-[620px] max-w-[calc(100vw-2rem)] p-5">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonthNav}
          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#F3F4F6] transition-colors cursor-pointer"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4 text-[#374151]" />
        </button>
        <div className="flex-1" />
        <button
          onClick={nextMonthNav}
          className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#F3F4F6] transition-colors cursor-pointer"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4 text-[#374151]" />
        </button>
      </div>

      <div className="flex gap-6">
        <CalendarMonth
          year={viewYear} month={viewMonth}
          startDate={startDate} endDate={endDate}
          hoverDate={hoverDate} today={today}
          onDayClick={handleDayClick} onDayHover={setHoverDate}
        />
        <div className="w-px bg-[#F3F4F6] shrink-0" />
        <CalendarMonth
          year={nextYear} month={nextMonth}
          startDate={startDate} endDate={endDate}
          hoverDate={hoverDate} today={today}
          onDayClick={handleDayClick} onDayHover={setHoverDate}
        />
      </div>

      <div className="mt-4 pt-3 border-t border-[#F3F4F6] flex items-center justify-between">
        <span className="text-[13px] text-[#6B7280] font-medium">{footerText}</span>
        {(startDate || endDate) && (
          <button
            onClick={() => { onChange(null, null); onClose() }}
            className="text-[13px] font-bold text-brand-600 hover:underline cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}

/* ── Inventory Modal ── */
export function InventoryModal({ items, onClose, onSelect }: {
  items: Array<any>
  onClose: () => void
  onSelect: (item: any) => void
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [dateOpen, setDateOpen] = useState(false)
  const [dateStart, setDateStart] = useState<Date | null>(null)
  const [dateEnd, setDateEnd] = useState<Date | null>(null)

  const categories: Array<string> = Array.from(
    new Set(items.map((item: any) => item.category).filter(Boolean))
  )

  const filteredItems = items.filter((item: any) => {
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      !q ||
      item.postTitle?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)
    const matchesCategory = !selectedCategory || item.category === selectedCategory

    let matchesDate = true
    if (dateStart && dateEnd) {
      const raw = item.createdAt ?? item.addedAt ?? item.created_at ?? item.added_at
      if (raw) {
        const d = startOfDay(new Date(raw))
        matchesDate = d >= startOfDay(dateStart) && d <= startOfDay(dateEnd)
      }
    }

    return matchesSearch && matchesCategory && matchesDate
  })

  function dateBtnLabel() {
    if (dateStart && dateEnd) {
      const sm = MONTH_NAMES[dateStart.getMonth()].slice(0, 3)
      const em = MONTH_NAMES[dateEnd.getMonth()].slice(0, 3)
      if (dateStart.getMonth() === dateEnd.getMonth()) {
        return `${sm} ${dateStart.getDate()} – ${dateEnd.getDate()}`
      }
      return `${sm} ${dateStart.getDate()} – ${em} ${dateEnd.getDate()}`
    }
    if (dateStart) return `${MONTH_NAMES[dateStart.getMonth()].slice(0, 3)} ${dateStart.getDate()}`
    return 'Any dates'
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[#F3F4F6] shrink-0">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F3F4F6] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-[#111]" />
          </button>
          <h3 className="text-[16px] font-black text-[#111]">
            Inventory · {items.length} {items.length === 1 ? 'item' : 'items'}
          </h3>
        </div>

        {/* Filter bar */}
        <div className="px-6 py-3 border-b border-[#F3F4F6] shrink-0 flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, details..."
              className="w-full h-9 pl-9 pr-3 text-sm border border-[#E5E7EB] rounded-xl bg-[#F9FAFB]
                         placeholder:text-[#B0B7C3] text-[#111]
                         focus:outline-none focus:ring-2 focus:ring-brand-ring focus:border-transparent transition-all"
            />
          </div>

          {/* Category */}
          <div className="relative shrink-0">
            <button
              onClick={() => { setCategoryOpen(v => !v); setDateOpen(false) }}
              className="flex items-center gap-1.5 h-9 px-3 text-sm font-semibold text-[#374151]
                         border border-[#E5E7EB] rounded-xl bg-white hover:bg-[#F9FAFB] transition-colors cursor-pointer whitespace-nowrap"
            >
              {selectedCategory || 'Category'}
              <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
            </button>
            {categoryOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setCategoryOpen(false)} />
                <div className="absolute right-0 top-full mt-1 bg-white border border-[#E5E7EB]
                                rounded-xl shadow-lg z-20 min-w-[180px] py-1 overflow-hidden">
                  <button
                    onClick={() => { setSelectedCategory(''); setCategoryOpen(false) }}
                    className={`w-full text-left px-3 py-2 text-sm cursor-pointer hover:bg-[#F9FAFB] transition-colors
                      ${!selectedCategory ? 'font-bold text-brand-600' : 'text-[#374151]'}`}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setCategoryOpen(false) }}
                      className={`w-full text-left px-3 py-2 text-sm cursor-pointer hover:bg-[#F9FAFB] transition-colors
                        ${selectedCategory === cat ? 'font-bold text-brand-600' : 'text-[#374151]'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Date range */}
          <div className="relative shrink-0">
            <button
              onClick={() => { setDateOpen(v => !v); setCategoryOpen(false) }}
              className={[
                'flex items-center gap-1.5 h-9 px-3 text-sm font-semibold',
                'border rounded-xl bg-white hover:bg-[#F9FAFB] transition-colors cursor-pointer whitespace-nowrap',
                dateStart ? 'border-brand-primary text-brand-600' : 'border-[#E5E7EB] text-[#374151]',
              ].join(' ')}
            >
              <Calendar className="w-3.5 h-3.5 text-[#9CA3AF]" />
              {dateBtnLabel()}
              <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
            </button>
            {dateOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDateOpen(false)} />
                <div className="absolute right-0 top-full mt-2 z-20">
                  <DateRangePicker
                    startDate={dateStart}
                    endDate={dateEnd}
                    onChange={(s, e) => { setDateStart(s); setDateEnd(e) }}
                    onClose={() => setDateOpen(false)}
                  />
                </div>
              </>
            )}
          </div>

          <span className="text-[12px] font-semibold text-[#9CA3AF] whitespace-nowrap shrink-0">
            1–{filteredItems.length} of {items.length}
          </span>
        </div>

        {/* Grid */}
        <div className="overflow-y-auto px-6 py-5">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Package className="w-12 h-12 text-[#E5E7EB] mb-3" strokeWidth={1} />
              <p className="text-sm text-[#9CA3AF] font-bold">No items match your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredItems.map((item: any) => (
                <InventoryCard key={item.id} item={item} onSelect={onSelect} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
