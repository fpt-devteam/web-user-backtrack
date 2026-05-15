import { Check, Clock, Image, Mail, MapPin, MessageSquare, Package, Palette, Phone, Search, User, X } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'

/* ── types ──────────────────────────────────────────────────── */
export interface LostRequestItem {
  id: string
  itemName: string
  description: string
  color: string
  lostLocation: string
  createdAt: string
  status: 'pending' | 'found'
  type: 'in-inventory' | 'non-inventory'
  images: string[]
  reporterName: string
  reporterPhone: string
  reporterEmail: string
}

interface LostRequestDetailDrawerProps {
  request: LostRequestItem | null
  open: boolean
  onClose: () => void
}

/* ── progress steps ─────────────────────────────────────────── */
const STEPS = [
  { key: 'submitted', label: 'Request Submitted', desc: 'Your lost request has been submitted successfully.' },
  { key: 'reviewing', label: 'Under Review', desc: 'The organization is reviewing your request.' },
  { key: 'searching', label: 'Searching', desc: 'Staff is actively looking for your item.' },
  { key: 'found', label: 'Item Found', desc: 'Your item has been found! Please come to collect it.' },
] as const

function getCompletedSteps(status: 'pending' | 'found', type: 'in-inventory' | 'non-inventory'): number {
  if (type === 'in-inventory') {
    // 3 steps total: submitted, reviewing, found
    return status === 'found' ? 3 : 2
  }
  // 4 steps total: submitted, reviewing, searching, found
  return status === 'found' ? 4 : 2
}

/* ── helpers ─────────────────────────────────────────────────── */
function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

/* ── component ──────────────────────────────────────────────── */
export function LostRequestDetailDrawer({ request, open, onClose }: Readonly<LostRequestDetailDrawerProps>) {
  if (!request) return null

  const filteredSteps = STEPS.filter(s => {
    if (request.type === 'in-inventory' && s.key === 'searching') return false
    return true
  })

  const completedSteps = getCompletedSteps(request.status, request.type)

  const getStepTime = (idx: number) => {
    const base = new Date(request.createdAt)
    if (idx === 0) return base
    if (idx === 1) return new Date(base.getTime() + 1000 * 60 * 60 * 2) // +2h
    if (idx === 2) return new Date(base.getTime() + 1000 * 60 * 60 * 24) // +1d
    if (idx === 3) return new Date(base.getTime() + 1000 * 60 * 60 * 48) // +2d
    return base
  }

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-[92%] sm:max-w-[66%] p-0 flex flex-col gap-0 bg-white"
      >
        <SheetTitle className="sr-only">Lost Request Detail</SheetTitle>
        <SheetDescription className="sr-only">Details for {request.itemName}</SheetDescription>

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center shrink-0">
              <Package className="w-5 h-5 text-[#9CA3AF]" strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <h2 className="text-[16px] font-black text-[#111] truncate">{request.itemName}</h2>
              <p className="text-[11px] text-[#9CA3AF] mt-0.5">
                {request.type === 'in-inventory' ? 'In Inventory' : 'Non-inventory'} request
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center
                       hover:bg-[#F3F4F6] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4.5 h-4.5 text-[#9CA3AF]" />
          </button>
        </div>

        <div className="h-px bg-[#F3F4F6]" />

        {/* ── Scrollable body ────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">

          {/* Progress Status (Horizontal) */}
          <div className="px-6 py-8">
            <h3 className="text-[13px] font-bold text-[#111] uppercase tracking-wider mb-8">
              Request Progress
            </h3>

            <div className="relative flex justify-between">
              {/* Connector Line Background */}
              <div className="absolute top-3.5 left-0 right-0 h-0.5 bg-[#F3F4F6] -z-10" />
              
              {filteredSteps.map((step, idx) => {
                const isDone = idx < completedSteps
                const isCurrent = idx === completedSteps
                const stepTime = getStepTime(idx)

                return (
                  <div key={step.key} className="flex flex-col items-center flex-1 relative">
                    {/* Connector line (Colored) */}
                    {idx > 0 && (
                      <div 
                        className={[
                          'absolute top-3.5 right-[50%] w-full h-0.5 -z-10',
                          isDone || isCurrent ? 'bg-emerald-500/30' : 'bg-transparent'
                        ].join(' ')}
                      />
                    )}

                    {/* Step indicator */}
                    <div
                      className={[
                        'w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all shadow-sm',
                        isDone
                          ? 'bg-emerald-500 text-white'
                          : isCurrent
                            ? 'bg-amber-100 border-2 border-amber-400'
                            : 'bg-[#F3F4F6] border border-[#E5E7EB]',
                      ].join(' ')}
                    >
                      {isDone ? (
                        <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                      ) : isCurrent ? (
                        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-[#D1D5DB]" />
                      )}
                    </div>

                    {/* Step content */}
                    <div className="mt-3 text-center px-1">
                      <p
                        className={[
                          'text-[12px] font-bold leading-tight whitespace-nowrap',
                          isDone ? 'text-emerald-700' : isCurrent ? 'text-amber-700' : 'text-[#9CA3AF]',
                        ].join(' ')}
                      >
                        {step.label}
                      </p>
                      {(isDone || isCurrent) && (
                        <p
                          className={[
                            'text-[10px] leading-relaxed mt-1 font-medium',
                            isDone ? 'text-emerald-600/60' : 'text-amber-600/60',
                          ].join(' ')}
                        >
                          {formatDate(stepTime.toISOString())}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="h-px bg-[#F3F4F6] mx-6" />

          {/* Photos */}
          {request.images.length > 0 && (
            <>
              <div className="px-6 py-6">
                <h3 className="text-[13px] font-bold text-[#111] uppercase tracking-wider mb-4">
                  Photos
                </h3>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {request.images.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt={`Photo ${idx + 1}`}
                      className="w-24 h-24 rounded-xl object-cover border border-[#E5E7EB] shrink-0
                                 hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </div>
              </div>
              <div className="h-px bg-[#F3F4F6] mx-6" />
            </>
          )}

          {/* Details */}
          <div className="px-6 py-6">
            <div className="flex flex-col gap-4">
              {/* Description */}
              <div>
                <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-1">Description</p>
                <p className="text-[13px] text-[#374151] leading-relaxed">{request.description}</p>
              </div>

              {/* Color */}
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#9CA3AF]" strokeWidth={1.6} />
                <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">Color</p>
                <p className="text-[13px] text-[#374151] font-medium ml-auto">{request.color}</p>
              </div>

              <div className="h-px bg-[#F9FAFB]" />

              {/* Location */}
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#9CA3AF]" strokeWidth={1.6} />
                <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">Lost Location</p>
                <p className="text-[13px] text-[#374151] font-medium ml-auto">{request.lostLocation}</p>
              </div>

              <div className="h-px bg-[#F9FAFB]" />

              {/* Submitted time */}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#9CA3AF]" strokeWidth={1.6} />
                <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">Submitted</p>
                <p className="text-[13px] text-[#374151] font-medium ml-auto">{formatDate(request.createdAt)}</p>
              </div>

              <div className="h-px bg-[#F9FAFB]" />

              {/* Type */}
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#9CA3AF]" strokeWidth={1.6} />
                <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">Request Type</p>
                <span
                  className={[
                    'ml-auto inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold',
                    request.type === 'in-inventory'
                      ? 'bg-blue-50 text-blue-600'
                      : 'bg-purple-50 text-purple-600',
                  ].join(' ')}
                >
                  {request.type === 'in-inventory' ? 'In Inventory' : 'Non-inventory'}
                </span>
              </div>
            </div>
          </div>

          <div className="h-px bg-[#F3F4F6] mx-6" />

          {/* Reporter Info */}
          <div className="px-6 py-6">
            <h3 className="text-[13px] font-bold text-[#111] uppercase tracking-wider mb-4">
              Reporter Info
            </h3>

            <div className="flex flex-col gap-4">
              {/* Name */}
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#9CA3AF]" strokeWidth={1.6} />
                <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">Name</p>
                <p className="text-[13px] text-[#374151] font-medium ml-auto">{request.reporterName}</p>
              </div>

              <div className="h-px bg-[#F9FAFB]" />

              {/* Phone */}
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#9CA3AF]" strokeWidth={1.6} />
                <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">Phone</p>
                <p className="text-[13px] text-[#374151] font-medium ml-auto">{request.reporterPhone}</p>
              </div>

              <div className="h-px bg-[#F9FAFB]" />

              {/* Email */}
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#9CA3AF]" strokeWidth={1.6} />
                <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">Email</p>
                <p className="text-[13px] text-[#374151] font-medium ml-auto">{request.reporterEmail}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────── */}
        <div className="px-6 py-4 border-t border-[#F3F4F6]">
          <button
            className="w-full py-3 rounded-xl text-[13px] font-bold text-white bg-[#111] 
                       hover:bg-black transition-all cursor-pointer flex items-center justify-center gap-2
                       shadow-[0_4px_12px_rgba(0,0,0,0.1)] active:scale-[0.98]"
          >
            <MessageSquare className="w-4 h-4" />
            Go to chat
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
