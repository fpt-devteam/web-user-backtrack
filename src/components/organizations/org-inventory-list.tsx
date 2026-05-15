import { Package, Search } from 'lucide-react'
import { useState } from 'react'
import type { Org } from '@/types/org.type'
import { useGetOrgInventory } from '@/hooks/use-org'
import { Skeleton } from '@/components/ui/skeleton'
import { InventoryCard } from './inventory-card'
import { InventoryModal } from './inventory-modal'
import { SendMessageSheet } from './send-message-sheet'

const INVENTORY_PREVIEW_COUNT = 6

export function OrgInventoryList({ slug, org }: { slug: string; org: Org }) {
  const { data, isLoading } = useGetOrgInventory(slug)
  const items = data?.items ?? []
  const [showModal, setShowModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [showLostRequest, setShowLostRequest] = useState(false)

  const previewItems = items.slice(0, INVENTORY_PREVIEW_COUNT)

  return (
    <>
      <div className="bg-white rounded-3xl border border-[#E5E7EB] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-black text-black tracking-tight">Inventory</h2>
          <Package className="w-4.5 h-4.5 text-brand-500" />
        </div>

        {/* Grid */}
        <div className="px-6 py-5">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="w-full aspect-4/3 rounded-xl" />
                  <Skeleton className="h-3 w-3/4 rounded" />
                  <Skeleton className="h-2 w-1/2 rounded" />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Package className="w-12 h-12 text-[#E5E7EB] mb-4" strokeWidth={1} />
              <p className="text-sm text-[#9CA3AF] font-bold">No items in inventory</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {previewItems.map((item: any) => (
                <InventoryCard key={item.id} item={item} onSelect={setSelectedItem} />
              ))}
            </div>
          )}
        </div>

        {/* View all link */}
        {items.length > INVENTORY_PREVIEW_COUNT && (
          <div className="px-6 pb-5 pt-1">
            <button
              onClick={() => setShowModal(true)}
              className="text-sm font-bold text-[#111] underline underline-offset-2
                         hover:text-brand-600 transition-colors cursor-pointer"
            >
              View all {items.length} items
            </button>
          </div>
        )}
      </div>

      {/* Non-inventory lost request */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] mt-4 p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-black text-black tracking-tight">Non-inventory lost request</h2>
            <button
              onClick={() => setShowLostRequest(true)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-[13px] font-bold
                         bg-rose-500 hover:bg-rose-600 text-white shadow-[0_4px_12px_rgba(239,68,68,0.2)]
                         transition-all cursor-pointer active:scale-[0.97]"
            >
              Lost request
            </button>
          </div>
          <Search className="w-4.5 h-4.5 text-brand-500" />
        </div>

        <p className="text-[12px] text-[#9CA3AF] leading-relaxed">
          Can't find your item in the inventory? Submit a lost request and we'll notify you as soon as it's found.
        </p>
      </div>

      {showModal && (
        <InventoryModal
          items={items}
          onClose={() => setShowModal(false)}
          onSelect={(item: any) => { setShowModal(false); setSelectedItem(item) }}
        />
      )}

      {selectedItem && (
        <SendMessageSheet
          item={selectedItem}
          org={org}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {showLostRequest && (
        <SendMessageSheet
          item={null}
          org={org}
          onClose={() => setShowLostRequest(false)}
        />
      )}
    </>
  )
}

