import { motion } from 'framer-motion'
import {
  Briefcase,
  Building2,
  CheckCircle2,
  CreditCard,
  FileText,
  Gem,
  Key,
  Mail,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  Send,
  ShoppingBag,
  Smartphone,
  Tag,
  User,
  X,
} from 'lucide-react'
import { useCallback, useState } from 'react'
import type { ElementType } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { Org } from '@/types/org.type'
import type { SupportFormData } from '@/types/chat.type'
import { useAuth } from '@/hooks/use-auth'
import { useGetSubcategories } from '@/hooks/use-subcategory'
import { useSocket } from '@/hooks/use-socket'
import { useCreateUser } from '@/hooks/use-user'
import { toast } from '@/lib/toast'
import { messageService } from '@/services/message.service'
import { userService } from '@/services/user.service'
import { Spinner } from '@/components/ui/spinner'
import { PillSelect } from './pill-select'
import { DateTimePill } from './date-time-pill'
import { FieldLabel } from './field-label'

const RANDOM_ADJECTIVES = [
  'Happy', 'Clever', 'Brave', 'Swift', 'Calm', 'Bright', 'Kind', 'Bold',
  'Gentle', 'Lucky', 'Merry', 'Quiet', 'Witty', 'Jolly', 'Proud',
]
const RANDOM_ANIMALS = [
  'Panda', 'Fox', 'Otter', 'Koala', 'Falcon', 'Lynx', 'Deer', 'Wolf',
  'Crane', 'Finch', 'Heron', 'Lemur', 'Quail', 'Robin', 'Seal',
]
function randomName() {
  const adj = RANDOM_ADJECTIVES[Math.floor(Math.random() * RANDOM_ADJECTIVES.length)]
  const animal = RANDOM_ANIMALS[Math.floor(Math.random() * RANDOM_ANIMALS.length)]
  return `${adj} ${animal}`
}

const CATEGORY_ICONS: { [k: string]: ElementType | undefined } = {
  Electronics: Smartphone,
  Clothing: Tag,
  Accessories: Gem,
  Documents: FileText,
  Wallet: CreditCard,
  Suitcase: Briefcase,
  Bags: ShoppingBag,
  Keys: Key,
  Other: Package,
}

const CATEGORIES = [
  'PersonalBelongings', 'Cards', 'Accessories', 'Electronics',
  'Others',
] as const

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

  const [message, setMessage] = useState('')
  const [displayName, setDisplayName] = useState(() => firebaseUser?.displayName?.trim() || randomName())
  const [isPending, setIsPending] = useState(false)

  const [category, setCategory] = useState<string>(item?.category ?? '')
  const [subCategoryId, setSubCategoryId] = useState<string>(item?.subcategoryId ?? '')
  const [itemName, setItemName] = useState<string>(item?.postTitle ?? item?.itemName ?? '')
  const [color, setColor] = useState('')
  const [lostLocation, setLostLocation] = useState('')
  const [eventTime, setEventTime] = useState('')
  const [additionalDetails, setAdditionalDetails] = useState('')

  const isAnonymous = !profile || !!firebaseUser?.isAnonymous
  const existingName = profile?.displayName?.trim() ?? ''
  const needsName = isAnonymous && !existingName
  const isNameLocked = !!(firebaseUser?.displayName?.trim())
  const shuffleName = useCallback(() => setDisplayName(randomName()), [])
  const CategoryIcon = CATEGORY_ICONS[item?.category] ?? Package
  const itemLocation = item?.location?.displayAddress ?? item?.displayAddress ?? org.displayAddress
  const { data: subcategories = [] } = useGetSubcategories(category || undefined)

  const isFormValid =
    message.trim() !== '' &&
    category !== '' &&
    itemName.trim() !== '' &&
    color.trim() !== '' &&
    subCategoryId !== '' &&
    !(needsName && !displayName.trim())

  async function handleSubmit() {
    if (!isFormValid) return
    setIsPending(true)
    try {
      if (isAnonymous) {
        await createUser()
        if (needsName) await userService.updateMe({ displayName: displayName.trim() })
        await syncProfile()
      }
      const supportFormData: SupportFormData = {
        postId: item?.id ?? null,
        category,
        subCategoryId,
        itemName: itemName.trim(),
        color: color.trim(),
        additionalDetails: additionalDetails.trim() || null,
        imageUrls: null,
        lostLocation: lostLocation.trim() || null,
        eventTime: eventTime ? new Date(eventTime) : null,
      }
      const conversation = await messageService.createSupportConversation(org.id, supportFormData)
      const convId = conversation.conversationId
      if (!convId) throw new Error('No conversation ID returned from server')
      sendMessage({ conversationId: convId, content: message, isSupport: true })
      navigate({
        to: '/message',
        search: {
          selectedId: convId,
          isSupport: true,
          fallbackName: org.name,
          ...(org.logoUrl ? { fallbackAvatarUrl: org.logoUrl } : {}),
        } as never,
      })
    } catch (err) {
      toast.fromError(err)
      setIsPending(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl
                   max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="relative flex items-center justify-center px-6 py-4 border-b border-[#F3F4F6] shrink-0">
          <h2 className="text-[15px] font-black text-[#111]">Contact Organization</h2>
          <button
            onClick={onClose}
            className="absolute right-4 w-8 h-8 rounded-full flex items-center justify-center
                       hover:bg-[#F3F4F6] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-[#111]" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="px-6 pt-5 pb-4">
            <h3 className="text-[20px] font-black text-[#111] leading-tight">Send a message</h3>
            <p className="text-[13px] text-[#6B7280] mt-1 leading-relaxed">
              Start a conversation with this organization about the item below.
            </p>
          </div>

          {/* Item card */}
          {item && (
            <div className="mx-6 mb-4 rounded-2xl border border-[#E5E7EB] shadow-sm bg-white p-4 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-[#111] line-clamp-1">{item.postTitle}</p>
                {itemLocation && (
                  <p className="text-[12px] text-[#6B7280] mt-1.5 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#9CA3AF]" />
                    <span className="line-clamp-1">{itemLocation}</span>
                  </p>
                )}
              </div>
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <CategoryIcon className="w-5 h-5 text-rose-500" />
              </div>
            </div>
          )}

          {/* Org card */}
          <div className="mx-6 mb-5 rounded-2xl border border-[#E5E7EB] shadow-sm bg-white p-4 flex items-start gap-3">
            <div className="relative shrink-0">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-[#F3F4F6] flex items-center justify-center border border-[#E5E7EB]">
                {org.logoUrl
                  ? <img src={org.logoUrl} alt={org.name} className="w-full h-full object-cover" />
                  : <Building2 className="w-5 h-5 text-[#C4C9D4]" />}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center border-2 border-white">
                <CheckCircle2 className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-bold text-[#111]">{org.name}</p>
              <p className="text-[12px] text-[#9CA3AF] mt-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                {org.contactEmail ?? 'Email not available'}
              </p>
              <p className="text-[12px] text-[#9CA3AF] mt-0.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                {org.phone ?? 'Phone not available'}
              </p>
            </div>
          </div>

          {/* Item details form */}
          <div className="px-6 pb-4">
            <p className="text-[14px] font-black text-[#111] mb-4">Item details</p>

            <div className="mb-3">
              <FieldLabel label="Item name" required />
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. iPhone 14 Pro"
                className={inputClass}
              />
            </div>

            <div className="mb-3">
              <FieldLabel label="Category & subcategory" required />
              <div className="flex flex-wrap gap-2">
                <PillSelect
                  label="Category"
                  value={category}
                  onChange={(v) => { setCategory(v); setSubCategoryId('') }}
                  options={CATEGORIES.map(c => ({ value: c, label: c }))}
                />
                <PillSelect
                  label="Subcategory"
                  value={subCategoryId}
                  onChange={setSubCategoryId}
                  options={subcategories.map(s => ({ value: s.id, label: s.name }))}
                  disabled={!category || subcategories.length === 0}
                />
              </div>
            </div>

            <div className="mb-3">
              <FieldLabel label="Color" required />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Black, Silver"
                className={inputClass}
              />
            </div>

            <div className="mb-3">
              <FieldLabel label="Lost location" />
              <input
                type="text"
                value={lostLocation}
                onChange={(e) => setLostLocation(e.target.value)}
                placeholder="e.g. Building A, Floor 3"
                className={inputClass}
              />
            </div>

            <div className="mb-3">
              <FieldLabel label="Date & time of loss" />
              <DateTimePill
                label="Date & time of loss"
                value={eventTime}
                onChange={setEventTime}
              />
            </div>

            <div>
              <FieldLabel label="Additional details" />
              <textarea
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                rows={2}
                placeholder="e.g. Has a scratch on the back, sticker on the case..."
                className="w-full rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2.5
                           text-[13px] text-[#111] placeholder:text-[#B0B7C3]
                           focus:outline-none focus:ring-2 focus:ring-brand-ring focus:border-transparent
                           resize-none transition-all"
              />
            </div>
          </div>

          <div className="border-t border-[#F3F4F6] mx-6 mb-4" />

          {/* Name input — anonymous users only */}
          {needsName && (
            <div className="px-6 pb-4">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-[14px] font-bold text-[#111]">Your name</p>
                {!isNameLocked && (
                  <button
                    type="button"
                    onClick={shuffleName}
                    className="flex items-center gap-1 text-[11px] font-semibold text-brand-500
                               hover:text-brand-600 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Shuffle
                  </button>
                )}
              </div>
              <p className="text-[12px] text-[#6B7280] mb-3 leading-relaxed">
                {isNameLocked
                  ? 'This is your account name and cannot be changed here.'
                  : 'A name has been suggested — keep it or enter your own.'}
              </p>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => { if (!isNameLocked) setDisplayName(e.target.value) }}
                  readOnly={isNameLocked}
                  autoFocus={!isNameLocked}
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
          )}

          {/* Message */}
          <div className="px-6 pb-6">
            <p className="text-[14px] font-bold text-[#111] mb-0.5">
              Message <span className="text-rose-500">*</span>
            </p>
            <p className="text-[12px] text-[#6B7280] mb-3 leading-relaxed">
              Describe your situation or ask a question about this item.
            </p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Example: I can describe the keychain attached to these keys, and I'm available near F-Town after 5 PM."
              className="w-full rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3
                         text-[13px] text-[#111] placeholder:text-[#B0B7C3]
                         focus:outline-none focus:ring-2 focus:ring-brand-ring focus:border-transparent
                         resize-none transition-all"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-3 border-t border-[#F3F4F6] shrink-0">
          <p className="text-center text-[11px] text-[#9CA3AF] mb-3 leading-relaxed">
            Your message will open a direct conversation with this organization.
          </p>
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
