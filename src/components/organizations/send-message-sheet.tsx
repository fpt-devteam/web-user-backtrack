import { motion } from 'framer-motion'
import {
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  Gem,
  Key,
  Mail,
  MapPin,
  Package,
  Phone,
  Send,
  ShoppingBag,
  Smartphone,
  Tag,
  User,
  X,
} from 'lucide-react'
import { useState } from 'react'
import type { ElementType } from 'react'
import { useNavigate } from '@tanstack/react-router'
import type { Org } from '@/types/org.type'
import { useAuth } from '@/hooks/use-auth'
import { useSocket } from '@/hooks/use-socket'
import { useCreateUser } from '@/hooks/use-user'
import { toast } from '@/lib/toast'
import { messageService } from '@/services/message.service'
import { userService } from '@/services/user.service'
import { Spinner } from '@/components/ui/spinner'

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

function formatItemDate(dateStr?: string | null): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const mo = String(d.getMonth() + 1).padStart(2, '0')
  return `${hh}:${mm} ${dd}/${mo}/${d.getFullYear()}`
}

export function SendMessageSheet({ item, org, onClose }: {
  item: any
  org: Org
  onClose: () => void
}) {
  const navigate = useNavigate()
  const { firebaseUser, profile, syncProfile } = useAuth()
  const { sendMessage } = useSocket()
  const { mutateAsync: createUser } = useCreateUser()
  const [message, setMessage] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [isPending, setIsPending] = useState(false)

  const isAnonymous = !profile || !!firebaseUser?.isAnonymous
  const CategoryIcon = CATEGORY_ICONS[item.category] ?? Package
  const itemLocation = item.location?.displayAddress ?? item.displayAddress ?? org.displayAddress
  const lastSeen = formatItemDate(item.createdAt ?? item.created_at)

  async function handleSubmit() {
    if (!message.trim()) return
    if (isAnonymous && !displayName.trim()) return
    setIsPending(true)
    try {
      if (isAnonymous) {
        await createUser()
        await userService.updateMe({ displayName: displayName.trim() })
        await syncProfile()
      }
      const conversation = await messageService.createSupportConversation(org.id)
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
          <div className="mx-6 mb-4 rounded-2xl border border-[#E5E7EB] shadow-sm bg-white p-4 flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-bold text-[#111] line-clamp-1">{item.postTitle}</p>
              {itemLocation && (
                <p className="text-[12px] text-[#6B7280] mt-1.5 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#9CA3AF]" />
                  <span className="line-clamp-1">{itemLocation}</span>
                </p>
              )}
              {lastSeen && (
                <p className="text-[12px] text-[#6B7280] mt-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 shrink-0 text-[#9CA3AF]" />
                  Last seen {lastSeen}
                </p>
              )}
            </div>
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
              <CategoryIcon className="w-5 h-5 text-rose-500" />
            </div>
          </div>

          {/* Owner card */}
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

          {/* Name input — shown only for anonymous users */}
          {isAnonymous && (
            <div className="px-6 pb-4">
              <p className="text-[14px] font-bold text-[#111] mb-0.5">Your name</p>
              <p className="text-[12px] text-[#6B7280] mb-3 leading-relaxed">
                So the organization knows who they're talking to.
              </p>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your name"
                  autoFocus
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB]
                             text-[13px] text-[#111] placeholder:text-[#B0B7C3]
                             focus:outline-none focus:ring-2 focus:ring-brand-ring focus:border-transparent transition-all"
                />
              </div>
            </div>
          )}

          {/* Message */}
          <div className="px-6 pb-6">
            <p className="text-[14px] font-bold text-[#111] mb-0.5">Message</p>
            <p className="text-[12px] text-[#6B7280] mb-3 leading-relaxed">
              Describe your situation or ask a question about this item.
            </p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              autoFocus
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
            disabled={!message.trim() || isPending || (isAnonymous && !displayName.trim())}
            className={[
              'w-full h-12 rounded-2xl text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer',
              message.trim() && !isPending && !(isAnonymous && !displayName.trim())
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
