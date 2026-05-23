import { motion } from 'framer-motion'
import {
  Building2,
  CheckCircle2,
  ImagePlus,
  Mail,
  Package,
  Phone,
  Send,
  User,
  X,
} from 'lucide-react'
import { useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { Org } from '@/types/org.type'
import type { SupportFormData } from '@/types/chat.type'
import { useAuth } from '@/hooks/use-auth'
import { useSocket } from '@/hooks/use-socket'
import { useCreateUser } from '@/hooks/use-user'
import { toast } from '@/lib/toast'
import { messageService } from '@/services/message.service'
import { userService } from '@/services/user.service'
import { Spinner } from '@/components/ui/spinner'
import { DatePill, TimePill } from './date-time-pill'
import { FieldLabel } from './field-label'

const inputClass = [
  'w-full h-10 px-3 rounded-xl border border-[#E5E7EB] text-[13px] text-[#111]',
  'bg-[#F9FAFB] placeholder:text-[#B0B7C3]',
  'focus:outline-none focus:ring-2 focus:ring-brand-ring focus:border-transparent transition-all',
].join(' ')

export function SendMessageSheet({ item, org, onClose }: {
  item: any | null
  org: Org
  onClose: () => void
}) {
  const navigate = useNavigate()
  const { firebaseUser, profile, syncProfile } = useAuth()
  const { sendMessage } = useSocket()
  const { mutateAsync: createUser } = useCreateUser()

  const isAnonymous = !profile || !!firebaseUser?.isAnonymous
  const existingName = profile?.displayName?.trim() || firebaseUser?.displayName?.trim() || ''
  const isNameLocked = !!existingName

  const [displayName, setDisplayName] = useState(existingName)
  const [message, setMessage] = useState(
    item
      ? 'Chào ban quản lý, em là chủ nhân của món đồ này. Em có thể đến phòng ban nào và vào khung giờ nào để xin nhận lại đồ ạ?'
      : 'Dạ em chào Ban quản lý. Em có làm thất lạc món đồ này ở khu vực của mình. Nếu có ai nhặt được và gửi lại, nhờ Ban quản lý liên hệ giúp em với được không ạ? Em xin chân thành cảm ơn!'
  )
  const [isPending, setIsPending] = useState(false)

  const [itemName, setItemName] = useState<string>(item?.postTitle ?? item?.itemName ?? '')
  const [color, setColor] = useState('')
  const [lostLocation, setLostLocation] = useState('')
  const [lostDate, setLostDate] = useState('')
  const [lostTime, setLostTime] = useState('')
  const [additionalDetails, setAdditionalDetails] = useState('')
  const [evidenceFiles, setEvidenceFiles] = useState<Array<File>>([])
  const [evidencePreviews, setEvidencePreviews] = useState<Array<string>>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleEvidenceSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    const remaining = 3 - evidenceFiles.length
    const toAdd = files.slice(0, remaining)
    setEvidenceFiles((prev) => [...prev, ...toAdd])
    toAdd.forEach((f) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setEvidencePreviews((prev) => [...prev, ev.target?.result as string])
      }
      reader.readAsDataURL(f)
    })
    e.target.value = ''
  }

  function removeEvidence(idx: number) {
    setEvidenceFiles((prev) => prev.filter((_, i) => i !== idx))
    setEvidencePreviews((prev) => prev.filter((_, i) => i !== idx))
  }

  const itemImageUrl = item?.imageUrls?.[0] ?? null
  const todayStr = (() => {
    const t = new Date()
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
  })()
  const maxTimeToday = (() => {
    const t = new Date()
    return `${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`
  })()
  const timePillMax = lostDate === todayStr ? maxTimeToday : undefined

  const isFormValid =
    displayName.trim() !== '' &&
    message.trim() !== '' &&
    itemName.trim() !== '' &&
    color.trim() !== '' &&
    lostDate !== '' &&
    lostLocation.trim() !== ''

  async function handleSubmit() {
    if (!isFormValid) return
    setIsPending(true)
    try {
      if (isAnonymous) {
        await createUser()
        if (!existingName) await userService.updateMe({ displayName: displayName.trim() })
        await syncProfile()
      }

      let eventTime: Date | null = null
      if (lostDate) {
        eventTime = new Date(lostTime ? `${lostDate}T${lostTime}` : `${lostDate}T00:00`)
      }

      const uploadedUrls = evidenceFiles.length
        ? await Promise.all(evidenceFiles.map((f) => messageService.uploadChatImage(f)))
        : null

      const supportFormData: SupportFormData = {
        postId: item?.id ?? (null as any),
        category: item?.category ?? '',
        subCategoryId: item?.subcategoryId ?? '',
        itemName: itemName.trim(),
        color: color.trim(),
        additionalDetails: additionalDetails.trim() || null,
        imageUrls: uploadedUrls,
        lostLocation: lostLocation.trim() || null,
        eventTime,
      }
      const conversation = await messageService.createSupportConversation(org.id, supportFormData)
      const convId = conversation.conversationId
      if (!convId) throw new Error('No conversation ID returned from server')
      sendMessage({ conversationId: convId, content: message, isSupport: true })
      navigate({
        to: '/claim-requests/$id',
        params: { id: convId },
      })
    } catch (err) {
      toast.fromError(err)
      setIsPending(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-60 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white w-full md:max-w-3xl sm:max-w-lg rounded-t-3xl sm:rounded-3xl
                   max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="relative flex items-center justify-center px-6 py-4 border-b border-[#F3F4F6] shrink-0">
          <h2 className="text-[15px] font-black text-black">Contact Organization</h2>
          <button
            onClick={onClose}
            className="absolute right-4 w-8 h-8 rounded-full flex items-center justify-center
                       hover:bg-[#F3F4F6] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-black" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="flex flex-col md:flex-row md:divide-x md:divide-[#F3F4F6]">

            {/* Section 1: Item preview + Org info */}
            <div className="md:w-[42%] shrink-0 p-5 md:p-6">
              <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-3">
                Item &amp; Organization
              </p>

              {/* Item blurred image card */}
              {item && (
                <div className="relative rounded-2xl overflow-hidden mb-4 aspect-4/3 bg-[#F3F4F6]">
                  {itemImageUrl ? (
                    <>
                      <img
                        src={itemImageUrl}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover scale-110"
                      />
                      <div className="absolute inset-0 bg-black/30" />
                      <div className="absolute inset-0 flex items-end p-4">
                        <p className="text-white font-bold text-[14px] leading-snug line-clamp-2 drop-shadow-lg">
                          {item.postTitle}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
                      <Package className="w-10 h-10 text-[#C4C9D4]" strokeWidth={1.5} />
                      <p className="text-[13px] font-bold text-[#9CA3AF] text-center line-clamp-2">
                        {item.postTitle}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Org info */}
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 flex items-start gap-3">
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[#F3F4F6] flex items-center justify-center border border-[#E5E7EB]">
                    {org.logoUrl
                      ? <img src={org.logoUrl} alt={org.name} className="w-full h-full object-contain" />
                      : <Building2 className="w-5 h-5 text-[#C4C9D4]" />}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-[#111] truncate">{org.name}</p>
                  <p className="text-[11px] text-[#9CA3AF] mt-1 flex items-center gap-1.5 truncate">
                    <Mail className="w-3 h-3 shrink-0" />
                    <span className="truncate">{org.contactEmail ?? 'Email not available'}</span>
                  </p>
                  <p className="text-[11px] text-[#9CA3AF] mt-0.5 flex items-center gap-1.5">
                    <Phone className="w-3 h-3 shrink-0" />
                    {org.phone ?? 'Phone not available'}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: User form */}
            <div className="flex-1 p-5 md:p-6 border-t border-[#F3F4F6] md:border-t-0">
              <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-3">
                Your Information
              </p>

              {/* Name */}
              <div className="mb-3">
                <FieldLabel label="Your name" required />
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => { if (!isNameLocked) setDisplayName(e.target.value) }}
                    readOnly={isNameLocked}
                    placeholder="Your full name"
                    className={[
                      'w-full h-10 pl-9 pr-3 rounded-xl border border-[#E5E7EB] text-[13px] text-[#111]',
                      'focus:outline-none transition-all',
                      isNameLocked
                        ? 'bg-[#F3F4F6] cursor-default text-[#6B7280]'
                        : 'bg-[#F9FAFB] placeholder:text-[#B0B7C3] focus:ring-2 focus:ring-brand-ring focus:border-transparent',
                    ].join(' ')}
                  />
                </div>
              </div>

              {/* Item name + Color side by side */}
              <div className="mb-3 grid grid-cols-2 gap-2">
                <div>
                  <FieldLabel label="Item name" required />
                  <input
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="e.g. iPhone 14 Pro"
                    className={inputClass}
                  />
                </div>
                <div>
                  <FieldLabel label="Color" required />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="e.g. Black"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Date + Time side by side */}
              <div className="mb-3">
                <FieldLabel label="Date &amp; time of loss" required />
                <div className="flex flex-wrap gap-2">
                  <DatePill label="Date" value={lostDate} onChange={setLostDate} disableFuture />
                  <TimePill label="Time" value={lostTime} onChange={setLostTime} maxTime={timePillMax} />
                </div>
              </div>

              {/* Lost location */}
              <div className="mb-3">
                <FieldLabel label="Lost location" required />
                <input
                  type="text"
                  value={lostLocation}
                  onChange={(e) => setLostLocation(e.target.value)}
                  placeholder="e.g. Building A, Floor 3"
                  className={inputClass}
                />
              </div>

              {/* Additional details */}
              <div className="mb-3">
                <FieldLabel label="Additional details" />
                <textarea
                  value={additionalDetails}
                  onChange={(e) => setAdditionalDetails(e.target.value)}
                  rows={2}
                  placeholder="e.g. Scratch on the back, sticker on the case..."
                  className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2.5
                             text-[13px] text-[#111] placeholder:text-[#B0B7C3]
                             focus:outline-none focus:ring-2 focus:ring-brand-ring focus:border-transparent
                             resize-none transition-all"
                />
              </div>

              {/* Evidence images */}
              <div className="mb-3">
                <FieldLabel label="Evidence photos" />
                <div className="flex flex-wrap gap-2">
                  {evidencePreviews.map((src, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#E5E7EB] bg-[#F3F4F6] shrink-0">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeEvidence(idx)}
                        className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
                        aria-label="Remove image"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                  {evidenceFiles.length < 3 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-16 h-16 rounded-xl border border-dashed border-[#D1D5DB] bg-[#F9FAFB]
                                 flex flex-col items-center justify-center gap-1 hover:bg-[#F3F4F6]
                                 hover:border-[#9CA3AF] transition-all cursor-pointer shrink-0"
                    >
                      <ImagePlus className="w-5 h-5 text-[#9CA3AF]" />
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-[#9CA3AF] mt-1.5">Up to 3 photos as proof of ownership</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleEvidenceSelect}
                />
              </div>

              {/* Message */}
              <div>
                <FieldLabel label="Message" required />
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Nhập tin nhắn của bạn..."
                  className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2.5
                             text-[13px] text-[#111] placeholder:text-[#B0B7C3]
                             focus:outline-none focus:ring-2 focus:ring-brand-ring focus:border-transparent
                             resize-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-3 border-t border-[#F3F4F6] shrink-0">
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || isPending}
            className={[
              'w-full h-12 rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer',
              isFormValid && !isPending
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-[0_4px_16px_rgba(239,68,68,0.35)]'
                : 'bg-rose-200 text-rose-300 cursor-not-allowed',
            ].join(' ')}
          >
            {isPending
              ? <Spinner size="sm" />
              : (
                <>
                  <Send className="w-4 h-4" />
                  Send message
                </>
              )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
