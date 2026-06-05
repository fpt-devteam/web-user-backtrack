import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { Variants } from 'framer-motion'
import { useGetConversations } from '@/hooks/use-message'
import { ClaimListPanel } from '@/components/claim-requests/claim-list/claim-list-panel'
import type { ClaimRequest } from '@/components/claim-requests/claim.types'
import { normalizeStatus } from '@/components/claim-requests/claim.constants'

/**
 * Legacy item shape kept for the detail route (`./$id`).
 * The list itself now uses the normalised `ClaimRequest` model.
 */
export interface ClaimRequestItem {
  id: string
  itemName: string
  description: string
  color: string
  lostLocation: string
  createdAt: string
  updatedAt?: string
  status: 'submitted' | 'searching' | 'found' | 'pending'
  type: 'in-inventory' | 'non-inventory'
  images: Array<string>
  reporterName: string
  reporterPhone: string
  reporterEmail: string
  conversationId?: string
  category?: string
  subCategoryId?: string
  eventTime?: string | Date | null
  orgLogoUrl?: string
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

/* ── hardcoded data (used by the detail route as a fallback) ──── */
export const MOCK_REQUESTS: Array<ClaimRequestItem> = [
  {
    id: '1',
    itemName: 'iPhone 14 Pro Max',
    description: 'Black color, has a crack on the top-left corner of the screen. Last seen in Building A, Floor 3 near the elevator.',
    color: 'Black',
    lostLocation: 'Building A, Floor 3',
    createdAt: '2026-05-15T10:30:00Z',
    status: 'submitted' as const,
    type: 'in-inventory' as const,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=200&h=200&fit=crop',
    ],
    reporterName: 'Nguyen Van An',
    reporterPhone: '0912 345 678',
    reporterEmail: 'an.nguyen@example.com',
    conversationId: 'mock-uuid-for-testing', // Replace with a real conversation UUID to test real chat integration
  },
  {
    id: '2',
    itemName: 'AirPods Pro 2nd Gen',
    description: 'White case with a small scratch on the lid. Was left on a desk in the library study room B2.',
    color: 'White',
    lostLocation: 'Library, Study Room B2',
    createdAt: '2026-05-14T14:20:00Z',
    status: 'searching' as const,
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
    status: 'submitted' as const,
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

/* ── page ────────────────────────────────────────────────────── */
function ClaimRequestsPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetConversations()

  const claims = useMemo<Array<ClaimRequest>>(() => {
    const conversations = data?.pages.flatMap((p) => p.items) ?? []
    return conversations
      .filter((c) => c.type === 'support')
      .map((c) => {
        const sfd = c.supportFormData
        return {
          id: c.conversationId,
          itemName: sfd?.itemName || 'Untitled item',
          description: c.lastMessage?.content || sfd?.additionalDetails || 'No additional details provided.',
          status: normalizeStatus(c.status),
          category: sfd?.category ?? null,
          subCategoryId: sfd?.subCategoryId ?? null,
          imageUrls: sfd?.imageUrls ?? [],
          createdAt: c.createdAt ?? c.updatedAt,
          updatedAt: c.updatedAt,
          lastMessageAt: c.lastMessage?.timestamp ?? null,
          orgName: c.orgName ?? null,
          orgLogoUrl: c.orgLogoUrl ?? null,
        }
      })
  }, [data])

  const filteredClaims = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return claims
    return claims.filter(
      (c) =>
        c.itemName.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        (c.category ?? '').toLowerCase().includes(query),
    )
  }, [claims, searchQuery])

  function handleView(claim: ClaimRequest) {
    void navigate({ to: '/claim-requests/$id', params: { id: claim.id } })
  }

  return (
    <div className="min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-72px)] bg-gray-50 pt-8 pb-12">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        {/* Search */}
        <motion.div
          custom={0.5}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mb-6"
        >
          <div className="relative w-full">
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
        </motion.div>

        {/* Status bar + order bar + list */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show">
          <ClaimListPanel
            claims={filteredClaims}
            isLoading={isLoading}
            isError={isError}
            emptyTitle="No claim requests found"
            emptyHint={
              searchQuery
                ? `We couldn't find any requests matching "${searchQuery}". Try a different keyword.`
                : 'Submit a claim request from an organization page to get started.'
            }
            onView={handleView}
          />
        </motion.div>

        {/* Load more */}
        {!isLoading && hasNextPage && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="px-6 py-3 rounded-2xl text-xs font-bold bg-white border border-[#E5E7EB] text-[#111] hover:bg-[#F9FAFB] active:scale-[0.98] shadow-sm transition-all cursor-pointer flex items-center gap-2 disabled:opacity-60"
            >
              {isFetchingNextPage ? 'Loading...' : 'Load more claim requests'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
