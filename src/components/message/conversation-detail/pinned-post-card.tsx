import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Package,
  PackageSearch,
  Pin,
  X,
} from 'lucide-react'
import { useState } from 'react'
import type { ElementType } from 'react'
import { useGetPost } from '@/hooks/use-post'
import { Skeleton } from '@/components/ui/skeleton'
import type { SupportFormData } from '@/types/chat.type'
import QRCode from 'react-qr-code'

interface PinnedPostCardProps {
  supportFormData: SupportFormData
  orgSlug?: string
}

function formatEventTime(value: Date | string | null | undefined): string {
  if (!value) return ''
  const d = new Date(value as string)
  if (isNaN(d.getTime())) return ''
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const mo = String(d.getMonth() + 1).padStart(2, '0')
  return `${hh}:${mm}  ·  ${dd}/${mo}/${d.getFullYear()}`
}

function DetailCard({ icon: Icon, label, value, accent = false }: {
  icon: ElementType
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="flex items-start gap-3 bg-gray-50 rounded-2xl px-4 py-3">
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${accent ? 'bg-brand-100' : 'bg-white border border-gray-100 shadow-sm'}`}>
        <Icon className={`w-4 h-4 ${accent ? 'text-brand-600' : 'text-gray-400'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{label}</p>
        <p className="text-[13px] font-semibold text-gray-800 mt-1 leading-snug break-words">{value}</p>
      </div>
    </div>
  )
}

function HeroCarousel({ images, title, onClose }: {
  images: Array<string>
  title: string
  onClose: () => void
}) {
  const [idx, setIdx] = useState(0)
  const hasImages = images.length > 0
  const prev = () => setIdx(i => (i - 1 + images.length) % images.length)
  const next = () => setIdx(i => (i + 1) % images.length)

  return (
    <div className="relative shrink-0">
      <div className="w-full h-52 sm:h-60 relative overflow-hidden bg-gradient-to-br from-brand-100 to-brand-50">
        {hasImages ? (
          <AnimatePresence mode="wait">
            <motion.img
              key={idx}
              src={images[idx]}
              alt={`${title} photo ${idx + 1}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PackageSearch className="w-16 h-16 text-brand-200" strokeWidth={1} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      {/* Prev / Next */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm
                       flex items-center justify-center hover:bg-black/50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-14 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm
                       flex items-center justify-center hover:bg-black/50 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </>
      )}

      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm
                   flex items-center justify-center hover:bg-black/50 transition-colors"
        aria-label="Close"
      >
        <X className="w-4 h-4 text-white" />
      </button>

      {/* Pin badge */}
      <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/20 backdrop-blur-sm
                      rounded-full px-2.5 py-1 border border-white/30">
        <Pin className="w-3 h-3 text-white -rotate-45" strokeWidth={2.5} />
        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Pinned item</span>
      </div>

      {/* Title + dots */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
        <p className="text-white font-black text-[18px] leading-tight drop-shadow-sm truncate mb-1.5">
          {title}
        </p>
        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="flex items-center gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                className={`rounded-full transition-all ${i === idx ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function PinnedPostCard({ supportFormData, orgSlug }: PinnedPostCardProps) {
  const { data: post, isLoading } = useGetPost(supportFormData.postId ?? '')
  const [showPopup, setShowPopup] = useState(false)
  const staffItemUrl =
    orgSlug?.trim() && supportFormData.postId
      ? `https://backtrack-console.vercel.app/console/${orgSlug}/staff/item/${supportFormData.postId}`
      : null
  const qrValue = staffItemUrl ?? `backtrack-item:${supportFormData.postId}`

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

  const images = post.imageUrls ?? []
  const eventTimeStr = formatEventTime(supportFormData.eventTime)

  return (
    <>
      {/* Card row */}
      <motion.button
        type="button"
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => setShowPopup(true)}
        className="w-full flex items-center gap-3 px-4 py-2.5
                   bg-brand-50 border-b border-brand-100
                   hover:bg-brand-100/60 active:bg-brand-100
                   transition-colors text-left overflow-hidden"
      >
        <Pin className="w-3.5 h-3.5 text-brand-400 shrink-0 -rotate-45" strokeWidth={2.5} aria-hidden="true" />

        <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shrink-0 border border-brand-100 shadow-sm">
          {images[0] ? (
            <img src={images[0]} alt={post.postTitle} className="w-full h-full object-cover" loading="lazy" />
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
            {post.postTitle}
          </p>
          {eventTimeStr && (
            <p className="text-[10px] text-gray-400 mt-0.5 truncate">{eventTimeStr}</p>
          )}
        </div>

        <Pin className="w-3.5 h-3.5 text-gray-300 shrink-0 rotate-45" strokeWidth={2} />
      </motion.button>

      {/* Detail popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setShowPopup(false) }}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white w-full sm:max-w-xl xl:max-w-2xl 2xl:max-w-3xl rounded-t-3xl sm:rounded-3xl
                         max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Hero header — image carousel */}
              <HeroCarousel images={images} title={post.postTitle} onClose={() => setShowPopup(false)} />

              {/* Body */}
              <div className="overflow-y-auto flex-1">
                <div className="px-5 pt-5 pb-8 space-y-3">
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Item details
                  </p>

                  <div className="grid grid-cols-[4fr_1fr] gap-3">
                    <DetailCard icon={Package} label="Item name" value={supportFormData.itemName} accent />

                    <div className="rounded-2xl bg-gray-50 p-2.5 flex flex-col items-center justify-center">
                      <QRCode value={qrValue} size={70} />
                      <p className="mt-1.5 text-[10px] text-gray-400 text-center">
                        Show this QR to staff.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
