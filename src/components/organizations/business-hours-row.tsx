import { ChevronDown, Clock } from 'lucide-react'
import { useState } from 'react'
import type { BusinessHour } from '@/types/org.type'

const DAY_LABELS: Record<string, string> = {
  Monday: 'Monday', Tuesday: 'Tuesday', Wednesday: 'Wednesday',
  Thursday: 'Thursday', Friday: 'Friday', Saturday: 'Saturday', Sunday: 'Sunday',
}
const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function getTodayKey(): string {
  return DAY_ORDER[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]
}

function formatTimeVN(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h < 12 ? 'AM' : 'PM'
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return m === 0 ? `${hour12} ${period}` : `${hour12}:${String(m).padStart(2, '0')} ${period}`
}

type OpenStatus = 'open' | 'closing_soon' | 'closed'

function getOpenStatus(hours: Array<BusinessHour> | null): { status: OpenStatus; todayLabel: string } {
  if (!hours || hours.length === 0) return { status: 'closed', todayLabel: '' }
  const now = new Date()
  const todayKey = getTodayKey()
  const todayHours = hours.find(h => h.day === todayKey)
  if (!todayHours || todayHours.isClosed || !todayHours.openTime || !todayHours.closeTime) {
    return { status: 'closed', todayLabel: '' }
  }
  const [oh, om] = todayHours.openTime.split(':').map(Number)
  const [ch, cm] = todayHours.closeTime.split(':').map(Number)
  const nowMins = now.getHours() * 60 + now.getMinutes()
  const openMins = oh * 60 + om
  const closeMins = ch * 60 + cm
  if (nowMins < openMins) return { status: 'closed', todayLabel: `Opens at ${formatTimeVN(todayHours.openTime)}` }
  if (nowMins >= closeMins) return { status: 'closed', todayLabel: '' }
  if (closeMins - nowMins <= 30) return { status: 'closing_soon', todayLabel: `Closes at ${formatTimeVN(todayHours.closeTime)}` }
  return { status: 'open', todayLabel: `Closes at ${formatTimeVN(todayHours.closeTime)}` }
}

export function BusinessHoursRow({ hours }: { hours: Array<BusinessHour> | null }) {
  const [expanded, setExpanded] = useState(false)

  if (!hours || hours.length === 0) {
    return (
      <div className="flex items-start gap-3">
        <Clock className="w-4.5 h-4.5 text-[#555] shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-[15px] text-[#111] font-semibold">Business hours have not been updated</p>
      </div>
    )
  }

  const { status, todayLabel } = getOpenStatus(hours)
  const todayKey = getTodayKey()
  const sorted = [...hours].sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day))

  const statusText =
    status === 'open' ? 'Open now' :
    status === 'closing_soon' ? 'Closing soon' :
    'Closed'
  const statusColor =
    status === 'open' ? 'text-emerald-600' :
    status === 'closing_soon' ? 'text-amber-500' :
    'text-red-600'

  return (
    <div className="flex items-start gap-3">
      <Clock className="w-4.5 h-4.5 text-[#555] shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex-1">
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex items-center w-full text-left cursor-pointer"
          aria-expanded={expanded}
        >
          <span className={`text-[15px] font-semibold ${statusColor}`}>{statusText}</span>
          {todayLabel && (
            <>
              <span className="mx-1.5 text-[#999]">·</span>
              <span className="text-[15px] text-[#111] font-normal">{todayLabel}</span>
            </>
          )}
          <ChevronDown
            className={`ml-auto w-4 h-4 text-[#888] shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>

        {expanded && (
          <div className="mt-2 space-y-1.5">
            {sorted.map((h) => {
              const isToday = h.day === todayKey
              const timeStr =
                h.isClosed || !h.openTime || !h.closeTime
                  ? 'Closed'
                  : `${formatTimeVN(h.openTime)} – ${formatTimeVN(h.closeTime)}`
              return (
                <div
                  key={h.day}
                  className={`flex justify-between gap-4 text-[14px] ${isToday ? 'font-bold text-[#111]' : 'font-normal text-[#555]'}`}
                >
                  <span>{DAY_LABELS[h.day]}</span>
                  <span className={h.isClosed ? 'text-[#aaa]' : ''}>{timeStr}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
