import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Check,
  Clock,
  Mail,
  MoreVertical,
  Package,
  Palette,
  Paperclip,
  Phone,
  Send,
  Smile,
  User,
  X,
  FileText,
  Tag,
  MapPin,
  Layers,
} from 'lucide-react'
import React, { useState, useEffect, useRef } from 'react'
import { MOCK_REQUESTS } from '../index'
import type { ClaimRequestItem } from '../index'
import { ConversationHeader } from '@/components/message/conversation-detail/conversation-header'
import { MessageList } from '@/components/message/conversation-detail/message-list'
import { MessageInput } from '@/components/message/conversation-detail/message-input'
import { useGetConversationById } from '@/hooks/use-message'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '@/hooks/use-auth'
import { useGetSubcategories } from '@/hooks/use-subcategory'
import {
  normalizeStatus,
  STATUS_BADGE,
  STATUS_DOT,
  STATUS_LABEL,
  STATUS_PULSE,
} from '@/components/claim-requests/claim.constants'
import type { ClaimStatus } from '@/components/claim-requests/claim.constants'



export const Route = createFileRoute('/claim-requests/$id/')({
  component: ClaimRequestDetailPage,
})

/* ── progress steps (the 4 claim stages) ─────────────────────── */
const STEPS = [
  { key: 'queue',       label: 'Request Submitted', desc: 'Your claim request has been submitted successfully.' },
  { key: 'in_progress', label: 'Under Review',      desc: 'The organization is reviewing your request.' },
  { key: 'in_verified', label: 'Verified',          desc: 'Your item has been verified as a match.' },
  { key: 'closed',      label: 'Resolved',          desc: 'Your claim is resolved — the item has been returned.' },
] as const

/** How many steps are fully completed for a given status (the rest are upcoming). */
const STEP_PROGRESS: Record<ClaimStatus, number> = {
  queue:       1,
  in_progress: 2,
  in_verified: 3,
  closed:      4,
  // Rejected is a terminal state reached after review — it stops at the review stage.
  rejected:    2,
}

/** Map the legacy mock status onto the canonical 4-stage claim status. */
function legacyToClaimStatus(status: ClaimRequestItem['status']): ClaimStatus {
  switch (status) {
    case 'searching': return 'in_progress'
    case 'found':     return 'in_verified'
    default:          return 'queue'
  }
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

function formatDateShort(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatTimeOnly(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

interface ChatMessage {
  id: string
  sender: 'support' | 'user'
  senderName: string
  text: string
  timestamp: string
}

/* ── mock helper to generate chat log ────────────────────────── */
function getInitialChatMessages(request: ClaimRequestItem): ChatMessage[] {
  const baseTime = new Date(request.createdAt)

  if (request.id === '1') {
    return [
      {
        id: '1',
        sender: 'support',
        senderName: 'Backtrack Support',
        text: "Thanks for your request! We've received the details and will review it shortly.",
        timestamp: new Date(baseTime.getTime() + 1000 * 60 * 5).toISOString(),
      },
      {
        id: '2',
        sender: 'user',
        senderName: 'You',
        text: 'Thank you! Please let me know if you need more information.',
        timestamp: new Date(baseTime.getTime() + 1000 * 60 * 6).toISOString(),
      },
      {
        id: '3',
        sender: 'support',
        senderName: 'Backtrack Support',
        text: "We're reviewing your request. Our team is checking with the location you provided.",
        timestamp: new Date(baseTime.getTime() + 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        id: '4',
        sender: 'support',
        senderName: 'Backtrack Support',
        text: "Good news! Your item has been found and is now in our inventory. You can come to the front desk at Building A to claim your item.",
        timestamp: new Date(baseTime.getTime() + 1000 * 60 * 60 * 31).toISOString(),
      },
      {
        id: '5',
        sender: 'user',
        senderName: 'You',
        text: 'Amazing! I will come by tomorrow. Thank you!',
        timestamp: new Date(baseTime.getTime() + 1000 * 60 * 60 * 31.033).toISOString(),
      },
    ]
  }

  const msgs: ChatMessage[] = [
    {
      id: '1',
      sender: 'support',
      senderName: 'Backtrack Support',
      text: `Thanks for your request! We've received the details for your "${request.itemName}" and will review it shortly.`,
      timestamp: new Date(baseTime.getTime() + 1000 * 60 * 5).toISOString(),
    },
    {
      id: '2',
      sender: 'user',
      senderName: 'You',
      text: 'Thank you! Please let me know if you need any additional details.',
      timestamp: new Date(baseTime.getTime() + 1000 * 60 * 6).toISOString(),
    },
  ]

  if (request.status === 'found') {
    msgs.push({
      id: '3',
      sender: 'support',
      senderName: 'Backtrack Support',
      text: "Good news! Your item has been found. You can come to collect it at the organization's front desk.",
      timestamp: new Date(baseTime.getTime() + 1000 * 60 * 60 * 24).toISOString(),
    })
    msgs.push({
      id: '4',
      sender: 'user',
      senderName: 'You',
      text: 'Great, thank you so much for the update!',
      timestamp: new Date(baseTime.getTime() + 1000 * 60 * 60 * 24.1).toISOString(),
    })
  }

  return msgs
}

function ClaimRequestDetailPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const { profile } = useAuth()

  const mockRequest = MOCK_REQUESTS.find((r) => r.id === id)
  const { data: conversation, isLoading } = useGetConversationById(id, !mockRequest)

  let request = mockRequest
  if (!mockRequest && conversation) {
    const sfd = conversation.supportFormData
    request = {
      id: conversation.conversationId,
      itemName: sfd?.itemName || 'N/A',
      description: sfd?.additionalDetails || 'N/A',
      color: sfd?.color ?? '',
      lostLocation: sfd?.lostLocation ?? '',
      createdAt: conversation.createdAt ?? conversation.updatedAt ?? new Date().toISOString(),
      updatedAt: conversation.updatedAt ?? conversation.createdAt ?? new Date().toISOString(),
      status: (
        conversation.status === 'closed'
          ? 'found'
          : conversation.status === 'in_progress'
            ? 'searching'
            : conversation.status === 'queue'
              ? 'submitted'
              : 'submitted'
      ) as 'submitted' | 'searching' | 'found' | 'pending',
      type: (sfd?.postId ? 'in-inventory' : 'non-inventory') as 'in-inventory' | 'non-inventory',
      images: sfd?.imageUrls ?? [],
      reporterName: sfd?.contactName || conversation.partner?.displayName || profile?.displayName || 'N/A',
      reporterPhone: sfd?.contactPhone || 'N/A',
      reporterEmail: sfd?.contactEmail || 'N/A',
      conversationId: conversation.conversationId,
      category: sfd?.category,
      subCategoryId: sfd?.subCategoryId,
      eventTime: sfd?.eventTime,
      orgLogoUrl: conversation.orgLogoUrl ?? undefined,
    }
  }

  const claimStatus: ClaimStatus = mockRequest
    ? legacyToClaimStatus(mockRequest.status)
    : normalizeStatus(conversation?.status)

  const { data: subcategories = [] } = useGetSubcategories(request?.category || undefined)
  const subcategoryName = subcategories.find((s) => s.id === request?.subCategoryId)?.name

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputVal, setInputVal] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (request) {
      setMessages(getInitialChatMessages(request))
    }
  }, [request])

  useEffect(() => {
    if (!isLoading && !request) {
      navigate({ to: '/claim-requests' })
    }
  }, [isLoading, request, navigate])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!request) {
    return null
  }

  const filteredSteps = STEPS

  const completedSteps = STEP_PROGRESS[claimStatus]

  // Real per-step timestamps: Submitted, In Review, Verified, Resolved.
  // A step shows its time only once that timestamp exists (e.g. verifiedAt may be null).
  const stepTimes: Array<string | null | undefined> = [
    conversation?.createdAt ?? request.createdAt,
    conversation?.firstAssignedAt,
    conversation?.verifiedAt,
    conversation?.resolvedAt,
  ]

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputVal.trim()) return

    const newMsg: ChatMessage = {
      id: String(messages.length + 1),
      sender: 'user',
      senderName: 'You',
      text: inputVal,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, newMsg])
    setInputVal('')

    setTimeout(() => {
      const response: ChatMessage = {
        id: String(messages.length + 2),
        sender: 'support',
        senderName: 'Backtrack Support',
        text: "Thank you for the message. Our support staff has been notified and will reply if needed.",
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, response])
    }, 1500)
  }

  const renderChatFeed = () => {
    const feedElements: Array<React.ReactNode> = []
    let lastDateStr = ''

    messages.forEach((msg, idx) => {
      const dateStr = formatDateShort(msg.timestamp)
      if (dateStr !== lastDateStr) {
        feedElements.push(
          <div key={`divider-${dateStr}-${idx}`} className="flex items-center justify-center my-6">
            <div className="h-px bg-gray-100 flex-1" />
            <span className="text-[11px] font-bold text-[#aaa] px-4 tracking-wide">
              {dateStr}
            </span>
            <div className="h-px bg-gray-100 flex-1" />
          </div>
        )
        lastDateStr = dateStr
      }

      const isSupport = msg.sender === 'support'
      feedElements.push(
        <div
          key={msg.id}
          className={`flex gap-3 items-start mb-4 ${isSupport ? 'justify-start' : 'justify-end'}`}
        >
          {isSupport && (
            <div className="w-8 h-8 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-xs shrink-0 select-none shadow-[0_2px_6px_rgba(244,63,94,0.3)]">
              B
            </div>
          )}
          <div className={`flex flex-col max-w-[75%] ${isSupport ? 'items-start' : 'items-end'}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[12px] font-bold text-[#111]">{msg.senderName}</span>
              <span className="text-[10px] text-[#aaa]">{formatTimeOnly(msg.timestamp)}</span>
            </div>
            <div
              className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed font-medium shadow-[0_1px_2px_rgba(0,0,0,0.02)]
                ${isSupport
                  ? 'bg-[#F3F4F6] text-[#333] rounded-tl-none'
                  : 'bg-indigo-50 text-indigo-950 rounded-tr-none border border-indigo-100/50'
                }`}
            >
              {msg.text}
            </div>
          </div>
        </div>
      )
    })

    return feedElements
  }

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB] py-3 pr-3 pl-10 gap-3 overflow-hidden">



      {/* Main Content Area */}
      <div className="flex-1 flex gap-3 min-h-0">

        {/* LEFT COLUMN: Request Specifications (2/3 width, scrollable, cards layout) */}
        <div className="w-2/3 h-full overflow-y-auto autohide-scrollbar flex flex-col gap-3">

          {/* ── Header Card ── */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex items-center justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-[18px] font-black text-[#111] tracking-tight">{request.itemName}</h2>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${STATUS_BADGE[claimStatus]}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[claimStatus]} ${STATUS_PULSE[claimStatus] ? 'animate-pulse' : ''}`}
                    />
                    {STATUS_LABEL[claimStatus]}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#F3F4F6] text-[#6B7280] text-[11px] font-bold font-mono">
                    <Tag className="w-3 h-3" strokeWidth={2} />
                    #{request.id}
                  </span>
                  <span className="text-[12px] text-[#9CA3AF] font-medium">
                    Last updated {formatDate(request.updatedAt ?? request.createdAt)}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate({ to: '/claim-requests' })}
              className="w-9 h-9 rounded-xl flex items-center justify-center
                       hover:bg-[#F3F4F6] transition-colors cursor-pointer text-[#9CA3AF] hover:text-black shrink-0"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ── Request Progress Card ── */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <h3 className="text-[13px] font-black text-[#111] uppercase tracking-wider mb-8">
              Request Progress
            </h3>

            <div className="relative flex justify-between z-0">

              {filteredSteps.map((step, idx) => {
                const isDone = idx < completedSteps
                const stepTime = stepTimes[idx]

                return (
                  <div key={step.key} className="flex flex-col items-center flex-1 relative">
                    {/* Connector line (Background) */}
                    {idx > 0 && (
                      <div className="absolute top-3.5 right-[50%] w-full h-0.5 bg-[#F3F4F6] -z-10" />
                    )}

                    {/* Connector line (Colored / Done) */}
                    {idx > 0 && isDone && (
                      <div className="absolute top-3.5 right-[50%] w-full h-0.5 bg-emerald-500 -z-10" />
                    )}

                    {/* Step indicator */}
                    <div
                      className={[
                        'w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all shadow-sm',
                        isDone
                          ? 'bg-emerald-500 text-white'
                          : 'bg-[#F3F4F6] border border-[#E5E7EB]',
                      ].join(' ')}
                    >
                      {isDone ? (
                        <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-[#D1D5DB]" />
                      )}
                    </div>

                    {/* Step content */}
                    <div className="mt-3 text-center px-1">
                      <p
                        className={[
                          'text-[12px] font-bold leading-tight whitespace-nowrap',
                          isDone ? 'text-emerald-700' : 'text-[#9CA3AF]',
                        ].join(' ')}
                      >
                        {step.label}
                      </p>
                      {stepTime && (
                        <p
                          className={[
                            'text-[10px] leading-relaxed mt-1 font-medium',
                            isDone ? 'text-emerald-600/60' : 'text-[#9CA3AF]',
                          ].join(' ')}
                        >
                          {formatDate(stepTime)}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Photos Card ── */}
          {request.images.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              <h3 className="text-[13px] font-black text-[#111] uppercase tracking-wider mb-4">
                Photos
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {request.images.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`Photo ${idx + 1}`}
                    className="w-28 h-28 rounded-xl object-cover border border-[#E5E7EB] shrink-0
                             hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Details Card ── */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <h3 className="text-[13px] font-black text-[#111] uppercase tracking-wider mb-5">
              Details
            </h3>
            <div className="divide-y divide-gray-100">
              {/* Description */}
              <div className="flex items-start gap-4 py-3.5 first:pt-0">
                <div className="flex items-center gap-2.5 w-44 shrink-0 text-[#6B7280]">
                  <FileText className="w-4 h-4 text-[#9CA3AF]" strokeWidth={1.8} />
                  <span className="text-[13px] font-semibold">Description</span>
                </div>
                <p className="text-[13px] text-black leading-relaxed flex-1">{request.description}</p>
              </div>

              {/* Category */}
              {request.category && (
                <div className="flex items-center gap-4 py-3.5">
                  <div className="flex items-center gap-2.5 w-44 shrink-0 text-[#6B7280]">
                    <Tag className="w-4 h-4 text-[#9CA3AF]" strokeWidth={1.8} />
                    <span className="text-[13px] font-semibold">Category</span>
                  </div>
                  <p className="text-[13px] text-black font-medium flex-1">{request.category}</p>
                </div>
              )}

              {/* Subcategory */}
              {subcategoryName && (
                <div className="flex items-center gap-4 py-3.5">
                  <div className="flex items-center gap-2.5 w-44 shrink-0 text-[#6B7280]">
                    <Layers className="w-4 h-4 text-[#9CA3AF]" strokeWidth={1.8} />
                    <span className="text-[13px] font-semibold">Subcategory</span>
                  </div>
                  <p className="text-[13px] text-black font-medium flex-1">{subcategoryName}</p>
                </div>
              )}

              {/* Color */}
              <div className="flex items-center gap-4 py-3.5">
                <div className="flex items-center gap-2.5 w-44 shrink-0 text-[#6B7280]">
                  <Palette className="w-4 h-4 text-[#9CA3AF]" strokeWidth={1.8} />
                  <span className="text-[13px] font-semibold">Color</span>
                </div>
                <p className="text-[13px] text-black font-medium flex-1">{request.color || 'N/A'}</p>
              </div>

              {/* Lost Location */}
              {request.lostLocation && (
                <div className="flex items-center gap-4 py-3.5">
                  <div className="flex items-center gap-2.5 w-44 shrink-0 text-[#6B7280]">
                    <MapPin className="w-4 h-4 text-[#9CA3AF]" strokeWidth={1.8} />
                    <span className="text-[13px] font-semibold">Lost Location</span>
                  </div>
                  <p className="text-[13px] text-black font-medium flex-1">{request.lostLocation}</p>
                </div>
              )}

              {/* Type */}
              <div className="flex items-center gap-4 py-3.5">
                <div className="flex items-center gap-2.5 w-44 shrink-0 text-[#6B7280]">
                  <Package className="w-4 h-4 text-[#9CA3AF]" strokeWidth={1.8} />
                  <span className="text-[13px] font-semibold">Type</span>
                </div>
                <p className="text-[13px] text-black font-medium flex-1">
                  {request.type === 'in-inventory' ? 'In Inventory' : 'Not in Inventory'}
                </p>
              </div>

              {/* Time Lost / Event Time */}
              {request.eventTime && (
                <div className="flex items-center gap-4 py-3.5">
                  <div className="flex items-center gap-2.5 w-44 shrink-0 text-[#6B7280]">
                    <Clock className="w-4 h-4 text-[#9CA3AF]" strokeWidth={1.8} />
                    <span className="text-[13px] font-semibold">Time Lost</span>
                  </div>
                  <p className="text-[13px] text-black font-medium flex-1">{formatDate(request.eventTime.toString())}</p>
                </div>
              )}

              {/* Submitted time */}
              <div className="flex items-center gap-4 py-3.5 last:pb-0">
                <div className="flex items-center gap-2.5 w-44 shrink-0 text-[#6B7280]">
                  <Clock className="w-4 h-4 text-[#9CA3AF]" strokeWidth={1.8} />
                  <span className="text-[13px] font-semibold">Last Updated</span>
                </div>
                <p className="text-[13px] text-black font-medium flex-1">{formatDate(request.updatedAt ?? request.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* ── Reporter Info Card ── */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)] mb-1">
            <h3 className="text-[13px] font-black text-[#111] uppercase tracking-wider mb-5">
              Reporter Info
            </h3>
            <div className="divide-y divide-gray-100">
              {/* Name */}
              <div className="flex items-center gap-4 py-3.5 first:pt-0">
                <div className="flex items-center gap-2.5 w-44 shrink-0 text-[#6B7280]">
                  <User className="w-4 h-4 text-[#9CA3AF]" strokeWidth={1.8} />
                  <span className="text-[13px] font-semibold">Name</span>
                </div>
                <p className="text-[13px] text-black font-medium flex-1">{request.reporterName}</p>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4 py-3.5">
                <div className="flex items-center gap-2.5 w-44 shrink-0 text-[#6B7280]">
                  <Phone className="w-4 h-4 text-[#9CA3AF]" strokeWidth={1.8} />
                  <span className="text-[13px] font-semibold">Phone</span>
                </div>
                <p className="text-[13px] text-black font-medium flex-1">{request.reporterPhone}</p>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4 py-3.5 last:pb-0">
                <div className="flex items-center gap-2.5 w-44 shrink-0 text-[#6B7280]">
                  <Mail className="w-4 h-4 text-[#9CA3AF]" strokeWidth={1.8} />
                  <span className="text-[13px] font-semibold">Email</span>
                </div>
                <p className="text-[13px] text-black font-medium flex-1">{request.reporterEmail}</p>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Chat Box (1/3 width, full height) */}
        <div className="w-1/3 h-full flex flex-col">
          {request.conversationId ? (
            <div className="flex-1 bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
              <ConversationHeader conversationId={request.conversationId} />
              <div className="flex-1 min-h-0">
                <MessageList conversationId={request.conversationId} />
              </div>
              <div className="shrink-0 border-t border-gray-100 bg-white rounded-b-2xl">
                <MessageInput
                  conversationId={request.conversationId}
                  isSupport={false}
                  closed={claimStatus === 'closed' || claimStatus === 'rejected'}
                  closedMessage={
                    claimStatus === 'rejected'
                      ? 'This claim was rejected. You can view the chat history but can no longer send messages.'
                      : 'This claim is resolved. You can view the chat history but can no longer send messages.'
                  }
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">

              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-black tracking-tight">Chat</h2>
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Online
                  </span>
                </div>
                <button className="w-8 h-8 rounded-xl hover:bg-gray-50 flex items-center justify-center text-gray-400 hover:text-black transition-colors cursor-pointer">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Logs */}
              <div className="flex-1 overflow-y-auto autohide-scrollbar px-6 py-4 bg-gray-50/20">
                {renderChatFeed()}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Footer */}
              <form
                onSubmit={handleSend}
                className="p-4 border-t border-gray-100 shrink-0 bg-white"
              >
                <div className="flex items-center gap-2.5 bg-gray-50/50 border border-gray-200/80 rounded-2xl px-3 py-1.5 focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    className="flex-1 min-w-0 bg-transparent py-2 px-1 text-[13px] text-[#111] placeholder-[#9CA3AF] border-0 focus:outline-hidden focus:ring-0"
                  />
                  <button
                    type="button"
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100/50 transition-colors cursor-pointer"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100/50 transition-colors cursor-pointer"
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                  <button
                    type="submit"
                    disabled={!inputVal.trim()}
                    className={`h-9 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer select-none active:scale-[0.98]
                  ${inputVal.trim()
                        ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                      }`}
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
