import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Clock, Package, Search, MapPin, ChevronRight, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pagination } from '@/components/ui/pagination'
import type { Variants } from 'framer-motion'

export interface ClaimRequestItem {
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

export const Route = createFileRoute('/claim-requests/')(
  { component: ClaimRequestsPage },
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

// Tab types and constants removed (Search & Sort used instead)

/* ── hardcoded data ─────────────────────────────────────────── */
export const MOCK_REQUESTS: ClaimRequestItem[] = [
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
    images: [
      'https://images.unsplash.com/photo-1619086303291-0ef7b4142db5?w=200&h=200&fit=crop',
    ],
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

// TypeBadge removed as item tags are no longer displayed on cards

/* ── page ────────────────────────────────────────────────────── */
function ClaimRequestsPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest')
  const [currentPage, setCurrentPage] = useState(1)

  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, sortBy])

  const filteredRequests = MOCK_REQUESTS.filter((req) => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return true
    return (
      req.itemName.toLowerCase().includes(query) ||
      req.description.toLowerCase().includes(query) ||
      req.lostLocation.toLowerCase().includes(query)
    )
  })

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime()
    const timeB = new Date(b.createdAt).getTime()
    return sortBy === 'newest' ? timeB - timeA : timeA - timeB
  })

  const totalPages = Math.ceil(sortedRequests.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedRequests = sortedRequests.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <div className="min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-72px)] bg-gray-50 pt-8 pb-12 flex flex-col justify-between">
      <div className="w-full px-25 flex-1 flex flex-col justify-between">
        <div className="w-full">
          {/* Page header */}
          <motion.div
            custom={0} variants={fadeUp} initial="hidden" animate="show"
            className="mb-6"
          >
            <h1 className="text-2xl font-black text-black tracking-tight">Claim Requests</h1>
          </motion.div>

          {/* Controls: Search and Sort */}
          <motion.div
            custom={0.5} variants={fadeUp} initial="hidden" animate="show"
            className="flex flex-col sm:flex-row items-center gap-4 mb-6"
          >
            {/* Search Bar */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search claim requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-white rounded-2xl border border-[#E5E7EB] text-[13px] font-medium text-[#111] placeholder-[#9CA3AF] focus:outline-hidden focus:border-black focus:ring-1 focus:ring-black transition-all shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#111] transition-colors cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="w-full sm:w-56 shrink-0">
              <Select value={sortBy} onValueChange={(value: 'newest' | 'oldest') => setSortBy(value)}>
                <SelectTrigger className="w-full bg-white rounded-2xl border border-[#E5E7EB] h-[46px] px-4 text-[13px] font-bold text-[#111] shadow-[0_1px_4px_rgba(0,0,0,0.02)] hover:bg-[#F9FAFB] transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="text-[#6B7280] font-normal">Sort:</span>
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-white border border-[#E5E7EB] rounded-xl shadow-lg">
                  <SelectItem value="newest" className="text-[13px] font-bold text-[#111] hover:bg-[#F3F4F6] focus:bg-[#F3F4F6] transition-colors cursor-pointer">
                    Newest first
                  </SelectItem>
                  <SelectItem value="oldest" className="text-[13px] font-bold text-[#111] hover:bg-[#F3F4F6] focus:bg-[#F3F4F6] transition-colors cursor-pointer">
                    Oldest first
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Request cards */}
          <div className="flex flex-col gap-4">
            {paginatedRequests.map((req, i) => (
              <motion.div
                key={req.id}
                custom={i + 1}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                onClick={() => navigate({ to: '/claim-requests/$id', params: { id: req.id } })}
                className="bg-white rounded-3xl border border-[#E5E7EB] overflow-hidden cursor-pointer
                           shadow-[0_2px_12px_rgba(0,0,0,0.04)]
                           hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-shadow duration-200"
              >
                <div className="p-5 flex gap-5 items-center">
                  {/* Left: Image Container */}
                  <div className="w-[100px] h-[100px] rounded-2xl bg-[#F3F4F6] overflow-hidden shrink-0 flex items-center justify-center border border-[#E5E7EB]">
                    {req.images && req.images.length > 0 ? (
                      <img
                        src={req.images[0]}
                        alt={req.itemName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-8 h-8 text-[#9CA3AF]" strokeWidth={1.5} />
                    )}
                  </div>

                  {/* Middle: Content */}
                  <div className="flex-1 min-w-0 py-1">
                    {/* Top row: title + status */}
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <h3 className="text-[15px] font-bold text-[#111] truncate">{req.itemName}</h3>
                      <div className="shrink-0">
                        <StatusBadge status={req.status} />
                      </div>
                    </div>

                    {/* Body */}
                    <p className="text-[13px] text-[#6B7280] leading-relaxed mb-3 line-clamp-2">
                      {req.description}
                    </p>

                    {/* Footer meta */}
                    <div className="flex items-center gap-4 text-[12px] text-[#9CA3AF]">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {req.lostLocation}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(req.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Right: Chevron Arrow */}
                  <div className="shrink-0 pl-1">
                    <ChevronRight className="w-5 h-5 text-[#9CA3AF]" strokeWidth={1.8} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty state */}
          {sortedRequests.length === 0 && (
            <motion.div
              custom={1} variants={fadeUp} initial="hidden" animate="show"
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <Search className="w-14 h-14 text-[#E5E7EB] mb-4" strokeWidth={1} />
              <p className="text-sm font-bold text-[#9CA3AF]">No claim requests found</p>
              <p className="text-[12px] text-[#C4C9D4] mt-1">
                {searchQuery
                  ? `We couldn't find any requests matching "${searchQuery}". Try a different keyword.`
                  : 'Submit a claim request from an organization page to get started.'}
              </p>
            </motion.div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 shrink-0">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  )
}
