import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Clock, Package, Search } from 'lucide-react'
import { useState } from 'react'
import type { Variants } from 'framer-motion'
import { LostRequestDetailDrawer } from './detail-drawer'
import type { LostRequestItem } from './detail-drawer'

export const Route = createFileRoute('/lost-requests/')(
  { component: LostRequestsPage },
)

/* ── animation ──────────────────────────────────────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
}

/* ── tab types ──────────────────────────────────────────────── */
type TabKey = 'all' | 'in-inventory' | 'non-inventory'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'in-inventory', label: 'In Inventory' },
  { key: 'non-inventory', label: 'Non-inventory' },
]

/* ── hardcoded data ─────────────────────────────────────────── */
const MOCK_REQUESTS = [
  {
    id: '1',
    itemName: 'iPhone 14 Pro Max',
    description: 'Black color, has a crack on the top-left corner of the screen. Last seen in Building A, Floor 3 near the elevator.',
    color: 'Black',
    lostLocation: 'Building A, Floor 3',
    createdAt: '2026-05-15T10:30:00Z',
    status: 'pending' as const,
    type: 'in-inventory' as const,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=200&h=200&fit=crop',
    ],
    reporterName: 'Nguyen Van An',
    reporterPhone: '0912 345 678',
    reporterEmail: 'an.nguyen@example.com',
  },
  {
    id: '2',
    itemName: 'AirPods Pro 2nd Gen',
    description: 'White case with a small scratch on the lid. Was left on a desk in the library study room B2.',
    color: 'White',
    lostLocation: 'Library, Study Room B2',
    createdAt: '2026-05-14T14:20:00Z',
    status: 'pending' as const,
    type: 'non-inventory' as const,
    images: [
      'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=200&h=200&fit=crop',
    ],
    reporterName: 'Tran Thi Bich',
    reporterPhone: '0987 654 321',
    reporterEmail: 'bich.tran@example.com',
  },
  {
    id: '3',
    itemName: 'Laptop Charger (MacBook)',
    description: 'Apple 67W USB-C charger with a white cable. Left plugged in at the charging station near the cafeteria.',
    color: 'White',
    lostLocation: 'Cafeteria, Charging Station',
    createdAt: '2026-05-13T09:15:00Z',
    status: 'found' as const,
    type: 'in-inventory' as const,
    images: [],
    reporterName: 'Le Minh Duc',
    reporterPhone: '0976 111 222',
    reporterEmail: 'duc.le@example.com',
  },
  {
    id: '4',
    itemName: 'Student ID Card',
    description: 'FPT University student ID card. Name on card: Nguyen Van A, Student ID: SE180XXX.',
    color: 'Blue / White',
    lostLocation: 'Parking Lot B',
    createdAt: '2026-05-12T16:45:00Z',
    status: 'pending' as const,
    type: 'non-inventory' as const,
    images: [
      'https://images.unsplash.com/photo-1578507065211-1c4e99a5fd24?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1586892478025-2b947bb0e48f?w=200&h=200&fit=crop',
    ],
    reporterName: 'Pham Hoang Nam',
    reporterPhone: '0901 234 567',
    reporterEmail: 'nam.pham@example.com',
  },
  {
    id: '5',
    itemName: 'Water Bottle (Hydro Flask)',
    description: '32oz Hydro Flask, matte black with stickers on the side. Had a carabiner attached to the lid.',
    color: 'Matte Black',
    lostLocation: 'Gym, Locker Room',
    createdAt: '2026-05-11T08:00:00Z',
    status: 'found' as const,
    type: 'in-inventory' as const,
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200&h=200&fit=crop',
    ],
    reporterName: 'Vo Thanh Huyen',
    reporterPhone: '0938 876 543',
    reporterEmail: 'huyen.vo@example.com',
  },
]

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

function StatusBadge({ status }: { status: 'pending' | 'found' }) {
  const isPending = status === 'pending'
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide',
        isPending
          ? 'bg-amber-50 text-amber-600'
          : 'bg-emerald-50 text-emerald-600',
      ].join(' ')}
    >
      <span
        className={[
          'w-1.5 h-1.5 rounded-full',
          isPending ? 'bg-amber-400' : 'bg-emerald-400',
        ].join(' ')}
      />
      {isPending ? 'Pending' : 'Found'}
    </span>
  )
}

function TypeBadge({ type }: { type: 'in-inventory' | 'non-inventory' }) {
  const isInventory = type === 'in-inventory'
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide',
        isInventory
          ? 'bg-blue-50 text-blue-600'
          : 'bg-purple-50 text-purple-600',
      ].join(' ')}
    >
      {isInventory ? 'In Inventory' : 'Non-inventory'}
    </span>
  )
}

/* ── page ────────────────────────────────────────────────────── */
function LostRequestsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('all')
  const [selectedRequest, setSelectedRequest] = useState<LostRequestItem | null>(null)

  const filteredRequests = MOCK_REQUESTS.filter((req) => {
    if (activeTab === 'all') return true
    return req.type === activeTab
  })

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-16">
      <div className="w-full px-25">

        {/* Page header */}
        <motion.div
          custom={0} variants={fadeUp} initial="hidden" animate="show"
          className="mb-6"
        >
          <h1 className="text-2xl font-black text-black tracking-tight">Lost Requests</h1>
        </motion.div>

        {/* Sub-tabs */}
        <motion.div
          custom={0.5} variants={fadeUp} initial="hidden" animate="show"
          className="mb-6"
        >
          <div className="flex items-center gap-1 bg-white rounded-2xl border border-[#E5E7EB] p-1.5 w-fit
                          shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            {TABS.map(({ key, label }) => {
              const isActive = activeTab === key
              const count = key === 'all'
                ? MOCK_REQUESTS.length
                : MOCK_REQUESTS.filter(r => r.type === key).length
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={[
                    'relative px-4 py-2 rounded-xl text-[13px] font-bold transition-all duration-200 cursor-pointer',
                    isActive
                      ? 'bg-[#111] text-white shadow-[0_2px_8px_rgba(0,0,0,0.15)]'
                      : 'text-[#6B7280] hover:text-[#111] hover:bg-[#F3F4F6]',
                  ].join(' ')}
                >
                  {label}
                  <span
                    className={[
                      'ml-1.5 text-[11px] font-bold',
                      isActive ? 'text-white/60' : 'text-[#9CA3AF]',
                    ].join(' ')}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Request cards */}
        <div className="flex flex-col gap-4">
          {filteredRequests.map((req, i) => (
            <motion.div
              key={req.id}
              custom={i + 1}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              onClick={() => setSelectedRequest(req)}
              className="bg-white rounded-3xl border border-[#E5E7EB] overflow-hidden cursor-pointer
                         shadow-[0_2px_12px_rgba(0,0,0,0.04)]
                         hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-shadow duration-200"
            >
              <div className="p-6">
                {/* Top row: title + status */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#F3F4F6] flex items-center justify-center shrink-0">
                      <Package className="w-4.5 h-4.5 text-[#9CA3AF]" strokeWidth={1.8} />
                    </div>
                    <h3 className="text-[15px] font-bold text-[#111] truncate">{req.itemName}</h3>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <TypeBadge type={req.type} />
                    <StatusBadge status={req.status} />
                  </div>
                </div>

                {/* Body */}
                <p className="text-[13px] text-[#6B7280] leading-relaxed mb-4">
                  {req.description}
                </p>

                {/* Footer meta */}
                <div className="flex items-center gap-4 text-[12px] text-[#9CA3AF]">
                  <span className="flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5" />
                    {req.lostLocation}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDate(req.createdAt)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty state */}
        {filteredRequests.length === 0 && (
          <motion.div
            custom={1} variants={fadeUp} initial="hidden" animate="show"
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <Search className="w-14 h-14 text-[#E5E7EB] mb-4" strokeWidth={1} />
            <p className="text-sm font-bold text-[#9CA3AF]">No lost requests found</p>
            <p className="text-[12px] text-[#C4C9D4] mt-1">
              {activeTab === 'all'
                ? 'Submit a lost request from an organization page to get started.'
                : `No ${activeTab === 'in-inventory' ? 'in-inventory' : 'non-inventory'} requests at the moment.`}
            </p>
          </motion.div>
        )}
      </div>

      {/* Detail Drawer */}
      <LostRequestDetailDrawer
        request={selectedRequest}
        open={selectedRequest !== null}
        onClose={() => setSelectedRequest(null)}
      />
    </div>
  )
}
