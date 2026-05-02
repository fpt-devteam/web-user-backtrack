import { AnimatePresence, motion } from 'framer-motion'
import { Building2, PackageSearch, Pin, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useGetPost } from '@/hooks/use-post'
import { useGetOrgInventory } from '@/hooks/use-org'
import { useUpdateConversationPost } from '@/hooks/use-message'
import { InventoryModal } from '@/components/organizations/inventory-modal'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/lib/toast'

interface PinnedPostCardProps {
  postId: string
  orgSlug: string
  conversationId: string
}

export function PinnedPostCard({ postId, orgSlug, conversationId }: PinnedPostCardProps) {
  const navigate = useNavigate()
  const { data: post, isLoading } = useGetPost(postId)
  const [showActions, setShowActions] = useState(false)
  const [showInventory, setShowInventory] = useState(false)
  const [pendingItem, setPendingItem] = useState<any>(null)

  const { data: inventoryData, isLoading: isInventoryLoading } = useGetOrgInventory(orgSlug, showInventory)
  const inventoryItems = inventoryData?.items ?? []

  const { mutateAsync: updatePost, isPending: isUpdating } = useUpdateConversationPost(conversationId)

  function handleSelectItem(item: any) {
    setShowInventory(false)
    setPendingItem(item)
  }

  async function handleConfirm() {
    if (!pendingItem) return
    const item = pendingItem
    setPendingItem(null)
    setShowActions(false)
    try {
      await updatePost(item.id)
      toast.success('Pinned item updated')
    } catch {
      // error already toasted by the mutation
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 px-4 py-2.5 bg-brand-50 border-b border-brand-100">
        <Pin className="w-3.5 h-3.5 text-brand-300 shrink-0 -rotate-45" strokeWidth={2.5} />
        <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-2.5 w-16 rounded" />
          <Skeleton className="h-3.5 w-40 rounded" />
        </div>
      </div>
    )
  }

  if (!post) return null

  const imageUrl = post.imageUrls?.[0] ?? null
  const isLost = post.postType === 'Lost'

  return (
    <>
      {/* Backdrop to close action panel */}
      {showActions && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowActions(false)}
        />
      )}

      <div className="relative z-20">
        {/* Card row */}
        <motion.button
          type="button"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => setShowActions(v => !v)}
          className="w-full flex items-center gap-3 px-4 py-2.5
                     bg-brand-50 border-b border-brand-100
                     hover:bg-brand-100/60 active:bg-brand-100
                     transition-colors text-left overflow-hidden"
        >
          <Pin
            className="w-3.5 h-3.5 text-brand-400 shrink-0 -rotate-45"
            strokeWidth={2.5}
            aria-hidden="true"
          />

          <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shrink-0 border border-brand-100 shadow-sm">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={post.postTitle ?? ''}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <PackageSearch className="w-4 h-4 text-gray-300" strokeWidth={1.5} />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-brand-500 uppercase tracking-wider leading-none mb-0.5">
              Pinned item
            </p>
            <p className="text-xs font-semibold text-gray-800 truncate leading-snug">
              {post.postTitle ?? 'Unknown item'}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${
                  isLost ? 'bg-rose-400' : 'bg-emerald-400'
                }`}
              />
              <span className="text-[10px] text-gray-400">
                {isLost ? 'Lost item' : 'Found item'}
                {post.category ? ` · ${post.category}` : ''}
              </span>
            </div>
          </div>

          <motion.div
            animate={{ rotate: showActions ? 90 : 0 }}
            transition={{ duration: 0.15 }}
          >
            <Pin className="w-3.5 h-3.5 text-gray-300 shrink-0 rotate-45" strokeWidth={2} />
          </motion.div>
        </motion.button>

        {/* Action panel */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="flex border-b border-brand-100 bg-white overflow-hidden"
            >
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => setShowInventory(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4
                           text-xs font-semibold text-brand-600
                           hover:bg-brand-50 active:bg-brand-100
                           transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
                Update Item
              </button>
              <div className="w-px bg-gray-100 shrink-0" />
              <button
                type="button"
                onClick={() => {
                  setShowActions(false)
                  navigate({ to: '/organizations/$slug', params: { slug: orgSlug } })
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4
                           text-xs font-semibold text-gray-600
                           hover:bg-gray-50 active:bg-gray-100
                           transition-colors"
              >
                <Building2 className="w-3.5 h-3.5" />
                Go to Organization
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Inventory picker */}
      {showInventory && (
        <InventoryModal
          items={isInventoryLoading ? [] : inventoryItems}
          onClose={() => setShowInventory(false)}
          onSelect={handleSelectItem}
        />
      )}

      {/* Confirmation dialog */}
      <AnimatePresence>
        {pendingItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setPendingItem(null) }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
            >
              <p className="text-[15px] font-black text-gray-900 mb-1">Update pinned item?</p>
              <p className="text-[13px] text-gray-500 mb-4">
                Pin <span className="font-semibold text-gray-800">{pendingItem.postTitle ?? 'this item'}</span> to this conversation?
              </p>

              {/* Item preview */}
              <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 mb-5">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-white shrink-0 border border-gray-100">
                  {pendingItem.imageUrls?.[0] ? (
                    <img src={pendingItem.imageUrls[0]} alt={pendingItem.postTitle ?? ''} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PackageSearch className="w-4 h-4 text-gray-300" strokeWidth={1.5} />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">{pendingItem.postTitle ?? 'Unknown item'}</p>
                  {pendingItem.category && (
                    <p className="text-[10px] text-gray-400 mt-0.5">{pendingItem.category}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setPendingItem(null)}
                  className="flex-1 h-10 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600
                             hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={handleConfirm}
                  className="flex-1 h-10 rounded-xl bg-brand-primary text-sm font-bold text-white
                             hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isUpdating ? 'Updating…' : 'Yes, update'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
