import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Clock,
  CreditCard,
  Handshake,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  PenLine,
  Phone,
  QrCode,
  ShieldCheck,
} from 'lucide-react'
import { useCallback, useState } from 'react'
import type { Variants } from 'framer-motion'
import type { BusinessHour } from '@/types/org.type'
import type { Post } from '@/types/post.type'
import { useGetPostsByOrg } from '@/hooks/use-post'
import { useAuth, useSignInAnonymous } from '@/hooks/use-auth'
import { AnonymousProfileDialog } from '@/components/shared/anonymous-profile-dialog'
import { orgKeys, useGetOrgBySlug  } from '@/hooks/use-org'
import { useCreateUser } from '@/hooks/use-user'
import { toast } from '@/lib/toast'
import { userService } from '@/services/user.service'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { orgService } from '@/services/org.service'
import {chatService} from '@/services/chat.service'

export const Route = createFileRoute('/organizations/$slug/')({
  component: OrgDetailPage,
  loader: ({ context: { queryClient }, params: { slug } }) =>
    queryClient.ensureQueryData({
      queryKey: orgKeys.detail(slug),
      queryFn: () => orgService.getOrgBySlug(slug),
      staleTime: 1000 * 60 * 5,
    }),
})

/* ─────────────── animations ─────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
}
const fadeUpReduced: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
}


const DEFAULT_DESCRIPTION = 'Official lost and found intake and return point. We are committed to safeguarding belongings and returning them safely to their owners.'
const DEFAULT_LOCATION_NOTE = 'Floor 1, Reception Desk'
const DEFAULT_STATS = { received: 120, returned: 95 }

const DAY_LABELS: Record<string, string> = {
  Monday: 'Monday', Tuesday: 'Tuesday', Wednesday: 'Wednesday',
  Thursday: 'Thursday', Friday: 'Friday', Saturday: 'Saturday', Sunday: 'Sunday',
}
const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

/* ─────────────── helpers ─────────────── */
function getTodayKey(): string {
  return DAY_ORDER[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]
}

function formatTimeVN(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h < 12 ? 'AM' : 'PM'
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return m === 0 ? `${hour12} ${period}` : `${hour12}:${String(m).padStart(2, '0')} ${period}`
}

type OpenStatus = 'open' | 'closing_soon' | 'closed'

function getOpenStatus(hours: Array<BusinessHour> | null): { status: OpenStatus; todayLabel: string } {
  if (!hours || hours.length === 0) return { status: 'closed', todayLabel: '' }
  const now = new Date()
  const todayKey = getTodayKey()
  const todayHours = hours.find(h => h.day === todayKey)
  if (!todayHours || todayHours.isClosed || !todayHours.openTime || !todayHours.closeTime) {
    return { status: 'closed', todayLabel: '' }
  }
  const [oh, om] = todayHours.openTime.split(':').map(Number)
  const [ch, cm] = todayHours.closeTime.split(':').map(Number)
  const nowMins = now.getHours() * 60 + now.getMinutes()
  const openMins = oh * 60 + om
  const closeMins = ch * 60 + cm
  if (nowMins < openMins) return { status: 'closed', todayLabel: `Opens at ${formatTimeVN(todayHours.openTime)}` }
  if (nowMins >= closeMins) return { status: 'closed', todayLabel: '' }
  if (closeMins - nowMins <= 30) return { status: 'closing_soon', todayLabel: `Closes at ${formatTimeVN(todayHours.closeTime)}` }
  return { status: 'open', todayLabel: `Closes at ${formatTimeVN(todayHours.closeTime)}` }
}

/* ═══════════════════════════════════════════ */
/*                  PAGE                       */
/* ═══════════════════════════════════════════ */
function OrgDetailPage() {
  const { slug } = Route.useParams()
  const navigate = useNavigate()

  const { data: org, isLoading: isOrgLoading } = useGetOrgBySlug(slug)
  const { firebaseUser, profile, syncProfile, loading: isProfileLoading } = useAuth()

  const { mutateAsync: signInAnonymous, isPending: isSigningIn } = useSignInAnonymous()
  const { mutateAsync: createUser, isPending: isCreatingUser } = useCreateUser()
  const isAuthPending = isSigningIn || isCreatingUser

  const [showAnonDialog, setShowAnonDialog] = useState(false)

  if (isOrgLoading || isProfileLoading) { return <OrgDetailSkeleton /> }
  if (!org) {
    navigate({ to: '/organizations' })
    return null
  }

  const doCreateConversation = async () => {
    const conversation = await chatService.createSupportConversation(org.id)
    const convId = conversation.conversationId
    if (!convId) throw new Error('No conversation ID returned from server')
    navigate({
      to: '/message',
      search: {
        selectedId: convId,
        fallbackName: org.name,
        ...(org.logoUrl ? { fallbackAvatarUrl: org.logoUrl } : {}),
      } as never,
    })
  }

  const handleStartChat = async () => {
    try {
      if (firebaseUser?.isAnonymous || !profile) {
        // Ensure user exists in DB before showing the name picker
        await createUser()
        setShowAnonDialog(true)
        return
      }
      await doCreateConversation()
    } catch (err) {
      toast.fromError(err)
    }
  }

  const handleAnonConfirm = async (displayName: string) => {
    try {
      await userService.updateMe({ displayName })
      await syncProfile()
      setShowAnonDialog(false)
      await doCreateConversation()
    } catch (err) {
      toast.fromError(err)
    }
  }

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const motionVariant = prefersReduced ? fadeUpReduced : fadeUp

  return (
    <>
    <AnonymousProfileDialog
      open={showAnonDialog}
      onConfirm={handleAnonConfirm}
      onCancel={() => setShowAnonDialog(false)}
    />
    <div className="min-h-screen bg-[#F7F7F7] pb-8">

      {/* ── back button ── */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 pt-4 pb-1">
        <button
          onClick={() => navigate({ to: '/organizations' })}
          aria-label="Back to list"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#444] hover:text-[#111]
                     transition-colors duration-200 cursor-pointer focus:outline-none
                     focus:ring-2 focus:ring-brand-ring focus:ring-offset-2 rounded-lg px-1 py-1 -ml-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* ── two-column grid ── */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 py-3
                      grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8 items-start">

        {/* ══ LEFT: Profile card ══ */}
        <motion.div
          custom={0} variants={motionVariant} initial="hidden" animate="show"
          className="lg:sticky lg:top-6"
        >
          <OrgProfileCard
            org={org}
            onChat={handleStartChat}
            isAuthPending={isAuthPending}
          />
        </motion.div>

        {/* ══ RIGHT: Found items + guides ══ */}
        <motion.div
          custom={1} variants={motionVariant} initial="hidden" animate="show"
          className="flex flex-col gap-0"
        >
          <FoundItemsList orgId={org.id} />
          <GuidesAccordion />
          <PolicyRow />
          <StatsRow prefersReduced={prefersReduced} />
          <LocationSection org={org} />
        </motion.div>
      </div>

      {/* ── sticky action bar ── */}
      {/* Removed - button now in profile card
      {(org || isLoading) && (
        <StickyActionBar
          orgName={org?.name ?? ''}
          isAuthPending={isAuthPending}
          onChat={handleStartChat}
          onReportLost={handleReportLost}
          isLoading={isLoading}
        />
      )}
      */}
    </div>
    </>
  )
}

/* ═══════════════════════════════════════════ */
/*   Business Hours (Google Maps-style)        */
/* ═══════════════════════════════════════════ */
function BusinessHoursRow({ hours }: { hours: Array<BusinessHour> | null }) {
  const [expanded, setExpanded] = useState(false)

  if (!hours || hours.length === 0) {
    return (
      <div className="flex items-start gap-3">
        <Clock className="w-4.5 h-4.5 text-[#555] shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-[15px] text-[#111] font-semibold">Business hours have not been updated</p>
      </div>
    )
  }

  const { status, todayLabel } = getOpenStatus(hours)
  const todayKey = getTodayKey()
  const sorted = [...hours].sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day))

  const statusText =
    status === 'open' ? 'Open now' :
    status === 'closing_soon' ? 'Closing soon' :
    'Closed'
  const statusColor =
    status === 'open' ? 'text-emerald-600' :
    status === 'closing_soon' ? 'text-amber-500' :
    'text-red-600'

  return (
    <div className="flex items-start gap-3">
      <Clock className="w-4.5 h-4.5 text-[#555] shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex-1">
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex items-center w-full text-left cursor-pointer"
          aria-expanded={expanded}
        >
          <span className={`text-[15px] font-semibold ${statusColor}`}>{statusText}</span>
          {todayLabel && (
            <>
              <span className="mx-1.5 text-[#999]">·</span>
              <span className="text-[15px] text-[#111] font-normal">{todayLabel}</span>
            </>
          )}
          <ChevronDown
            className={`ml-auto w-4 h-4 text-[#888] shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>

        {expanded && (
          <div className="mt-2 space-y-1.5">
            {sorted.map((h) => {
              const isToday = h.day === todayKey
              const timeStr =
                h.isClosed || !h.openTime || !h.closeTime
                  ? 'Closed'
                  : `${formatTimeVN(h.openTime)} – ${formatTimeVN(h.closeTime)}`
              return (
                <div
                  key={h.day}
                  className={`flex justify-between gap-4 text-[14px] ${isToday ? 'font-bold text-[#111]' : 'font-normal text-[#555]'}`}
                >
                  <span>{DAY_LABELS[h.day]}</span>
                  <span className={h.isClosed ? 'text-[#aaa]' : ''}>{timeStr}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════ */
/*   LEFT: Org Profile (Airbnb-style, no card) */
/* ═══════════════════════════════════════════ */
function OrgProfileCard({ org, onChat, isAuthPending }: {
  org: {
    name: string
    logoUrl: string | null
    coverImageUrl: string | null
    description: string | null
    status: string
    industryType: string
    displayAddress: string | null
    phone: string | null
    contactEmail: string | null
    locationNote: string | null
    businessHours: Array<BusinessHour> | null
    location: { latitude: number; longitude: number } | null
  }
  onChat: () => void
  isAuthPending: boolean
}) {
  const { received, returned } = DEFAULT_STATS

  return (
    <div className="flex flex-col">

      {/* ── Cover photo (standalone, rounded) ── */}
      <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden
                      bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700">
        {org.coverImageUrl && (
          <img
            src={org.coverImageUrl}
            alt={`Cover image of ${org.name}`}
            fetchPriority="high"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {!org.coverImageUrl && (
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>

      {/* ── Avatar — centered, overlaps cover bottom ── */}
      <div className="flex justify-center -mt-9 relative z-10">
        <div className="w-20 h-20 rounded-full bg-white border-4 border-white
                        shadow-[0_4px_20px_rgba(0,0,0,0.15)]
                        flex items-center justify-center overflow-hidden shrink-0">
          {org.logoUrl
            ? <img src={org.logoUrl} alt={`Logo ${org.name}`} className="w-full h-full object-contain" />
            : <Building2 className="w-10 h-10 text-[#ccc]" aria-hidden="true" />}
        </div>
      </div>

      {/* ── Name + description block (centered, like Airbnb) ── */}
      <div className="text-center pt-3 px-2">

        {/* Name — large and unmissable */}
        <h1 className="text-2xl font-black text-[#111] tracking-tight leading-snug">
          {org.name}
        </h1>

        {/* Status · industry · verified */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 mt-2.5">
          <span className={`inline-flex items-center gap-1.5 text-sm font-semibold
            ${org.status === 'Active' ? 'text-emerald-700' : 'text-red-600'}`}>
            <span className={`w-2 h-2 rounded-full ${org.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
            {org.status === 'Active' ? 'Active' : 'Temporarily closed'}
          </span>
          {org.industryType && (
            <>
              <span className="text-[#999] font-bold">·</span>
              <span className="text-sm text-[#444] font-semibold">{org.industryType}</span>
            </>
          )}
          <span className="text-[#999] font-bold">·</span>
          <span className="inline-flex items-center gap-1 text-sm text-brand-600 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            Verified
          </span>
        </div>

        {/* Description — darker and larger */}
        <p className="text-[15px] text-[#222] leading-relaxed mt-3 font-normal">
          {org.description ?? DEFAULT_DESCRIPTION}
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 mt-3 text-[15px] text-[#111]">
          <span className="font-black">{received}</span>
          <span className="text-[#999] font-bold">·</span>
          <span className="font-normal text-[#444]">Items received</span>
          <span className="text-[#999] font-bold">·</span>
          <span className="font-black text-emerald-700">{returned}</span>
          <span className="text-[#999] font-bold">·</span>
          <span className="font-normal text-[#444]">Items returned</span>
        </div>

        {/* Location note */}
        <p className="text-sm text-[#555] font-medium mt-1.5">
          {org.locationNote ?? DEFAULT_LOCATION_NOTE}
        </p>
      </div>

      {/* ── Chat Button ── */}
      <div className="px-2 mt-5">
        <Button
          variant="outline"
          onClick={onChat}
          disabled={isAuthPending}
          aria-label={`Start a chat with ${org.name}`}
          className="w-full h-12 rounded-2xl text-sm font-black
                     bg-brand-primary hover:bg-brand-hover
                     text-white flex items-center justify-center gap-2 border-0
                     shadow-[0_4px_16px_color-mix(in_srgb,var(--brand-primary)_35%,transparent)]
                     transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-brand-ring focus:ring-offset-2 cursor-pointer"
        >
          {isAuthPending
            ? <Spinner size="sm" />
            : (
              <>
                <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="truncate">Chat with {org.name}</span>
              </>
            )}
        </Button>
      </div>

      {/* ── Horizontal divider ── */}
      <div className="border-t border-[#D1D1D1] mt-5 mx-2" />

      {/* ── Contact info — plain rows, no card ── */}
      <div className="pt-4 px-2 space-y-4">

        {/* Hours */}
        <BusinessHoursRow hours={org.businessHours} />

        {/* Phone */}
        {org.phone && (
          <div className="flex items-start gap-3">
            <Phone className="w-4.5 h-4.5 text-[#555] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              {/* <p className="text-[11px] font-bold text-[#888] uppercase tracking-widest mb-1">Hotline</p> */}
              <a href={`tel:${org.phone}`} className="text-[15px] text-[#111] font-semibold hover:underline cursor-pointer">
                {org.phone}
              </a>
            </div>
          </div>
        )}

        {/* Email */}
        {org.contactEmail && (
          <div className="flex items-start gap-3">
            <Mail className="w-4.5 h-4.5 text-[#555] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-[11px] font-bold text-[#888] uppercase tracking-widest mb-1">Email</p>
              <a href={`mailto:${org.contactEmail}`}
                className="text-[15px] text-brand-600 font-semibold hover:underline break-all cursor-pointer">
                {org.contactEmail}
              </a>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}


/* ═══════════════════════════════════════════ */
/*   RIGHT: Found Items List (Airbnb-style)   */
/* ═══════════════════════════════════════════ */
function FoundItemsList({ orgId }: { orgId: string }) {
  const { data: posts, isLoading } = useGetPostsByOrg(orgId)

  return (
    <div className="bg-white rounded-2xl border border-[#DDDDDD] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-[#f0f0f0]">
        <h2 className="text-lg font-black text-[#111]">Recently found items here</h2>
        <p className="text-sm text-[#888] mt-1">Tap a card to see details</p>
      </div>

      {/* Items */}
      <div className="overflow-y-auto px-5 py-4 space-y-4" style={{ height: '550px' }}>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-5 p-6 rounded-2xl border border-[#DDDDDD]">
              <Skeleton className="w-28 h-28 rounded-2xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))
        ) : !posts?.length ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <Package className="w-10 h-10 text-[#ddd]" strokeWidth={1.5} />
            <p className="text-sm text-[#aaa] font-medium">No items found at this location yet</p>
          </div>
        ) : (
          posts.map((post) => <FoundItemCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  )
}

function FoundItemCard({ post }: { post: Post }) {
  const navigate = useNavigate()
  const timeAgo = (() => {
    const diff = (Date.now() - new Date(post.createdAt).getTime()) / 1000
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  })()

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={post.title}
      className="bg-white rounded-2xl border border-[#DDDDDD] overflow-hidden
                 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]
                 transition-all duration-200 cursor-pointer focus:outline-none
                 focus:ring-2 focus:ring-brand-ring focus:ring-offset-2"
      onClick={() => navigate({ to: '/feed/$postId', params: { postId: post.id } })}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate({ to: '/feed/$postId', params: { postId: post.id } }) }}
    >
      <div className="flex items-center gap-5 p-6">
        {/* Thumbnail */}
        <div className="relative shrink-0 w-28 h-28 rounded-2xl overflow-hidden bg-[#F3F4F6] flex items-center justify-center">
          {post.imageUrl ? (
            <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
          ) : (
            <Package className="w-12 h-12 text-[#9CA3AF]" strokeWidth={1.5} />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold text-[#111] truncate">{post.title}</p>
          {post.location?.displayAddress && (
            <p className="text-sm text-[#888] mt-1 truncate">{post.location.displayAddress}</p>
          )}
          <p className="text-sm text-brand-primary font-semibold mt-2">{timeAgo}</p>
        </div>

        <span className="text-[#ccc] text-2xl shrink-0">›</span>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════ */
/*   RIGHT: Guides Accordion                  */
/* ═══════════════════════════════════════════ */
const CLAIM_STEPS = [
  { icon: CreditCard, title: 'Prepare your identification', desc: 'Bring your national ID, passport, or any valid identification document.' },
  { icon: QrCode,     title: 'Provide item information',    desc: 'Present a QR code from Backtrack or provide a detailed description and images of the item.' },
  { icon: PenLine,    title: 'Sign return confirmation',    desc: 'Complete and sign the item return record to finish the process safely for both parties.' },
]
const DEPOSIT_STEPS = [
  { icon: ClipboardList, title: 'Describe the found item',          desc: 'Provide details such as item type, color, identifying marks, and where it was found.' },
  { icon: Camera,        title: 'Take photos and verify condition', desc: 'Photograph the item at drop-off to ensure transparency and prevent later disputes.' },
  { icon: Handshake,     title: 'Sign handover record',             desc: 'Receive a drop-off confirmation slip as legal proof that protects your rights.' },
]

function GuidesAccordion() {
  const [openClaim, setOpenClaim] = useState(false)
  const [openDeposit, setOpenDeposit] = useState(false)

  return (
    <div className="bg-white border border-[#ebebeb] rounded-2xl overflow-hidden shadow-sm mt-3 divide-y divide-[#f5f5f5]">
      {/* Claim guide */}
      <AccordionSection
        title="Item claim process"
        steps={CLAIM_STEPS}
        open={openClaim}
        onToggle={() => setOpenClaim(v => !v)}
      />
      {/* Deposit guide */}
      <AccordionSection
        title="Item drop-off process"
        steps={DEPOSIT_STEPS}
        open={openDeposit}
        onToggle={() => setOpenDeposit(v => !v)}
      />
    </div>
  )
}

function AccordionSection({
  title, steps, open, onToggle,
}: {
  title: string
  steps: Array<{ icon: React.ElementType; title: string; desc: string }>
  open: boolean
  onToggle: () => void
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-5 py-4
                   hover:bg-[#FAFAFA] transition-colors duration-200 cursor-pointer
                   focus:outline-none focus:bg-[#FAFAFA] text-left"
      >
        <span className="text-sm font-black text-[#111]">{title}</span>
        {open
          ? <ChevronUp className="w-4 h-4 text-[#888] shrink-0" />
          : <ChevronDown className="w-4 h-4 text-[#888] shrink-0" />}
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-0">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center shrink-0">
                <div className="w-7 h-7 rounded-full bg-brand-primary flex items-center justify-center
                                text-white text-xs font-black shadow-sm">
                  {i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px flex-1 my-1 bg-[#E5E7EB]" />
                )}
              </div>
              <div className="pb-5 pt-0.5 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <step.icon className="w-3.5 h-3.5 text-brand-primary" aria-hidden="true" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">Step {i + 1}</span>
                </div>
                <p className="text-sm font-bold text-[#111] leading-snug">{step.title}</p>
                <p className="text-xs text-[#888] mt-1 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════ */
/*   RIGHT: Policy Row                        */
/* ═══════════════════════════════════════════ */
function PolicyRow() {
  return (
    <div className="flex items-start gap-3 px-4 py-3.5 bg-amber-50 border border-amber-200 rounded-2xl mt-3 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" aria-hidden="true" />
      <div>
        <p className="text-sm font-black text-[#111] mb-1">Retention policy</p>
        <p className="text-xs text-[#666] leading-relaxed">
          Items are stored for up to <strong>30 days</strong>. High-value items are handed over
          to the local police after <strong>7 days</strong> if unclaimed.
        </p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════ */
/*   RIGHT: Stats Row                         */
/* ═══════════════════════════════════════════ */
function StatsRow({ prefersReduced }: { prefersReduced: boolean }) {
  const { received, returned } = DEFAULT_STATS
  const returnRate = Math.round((returned / received) * 100)

  return (
    <div className="bg-white border border-[#DDDDDD] rounded-2xl px-4 py-4 mt-3 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <p className="text-[11px] font-black text-[#111] tracking-widest uppercase mb-4">
        Statistics at this location
      </p>
      <div className="grid grid-cols-3 gap-3">
        <StatBox value={received}    label="Items received" color="text-[#111]" />
        <StatBox value={returned}    label="Items returned"  color="text-emerald-600" />
        <StatBox value={`${returnRate}%`} label="Return rate" color="text-brand-primary" />
      </div>
      <div className="mt-3 h-1.5 bg-[#f0f0f0] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full"
          initial={{ width: prefersReduced ? `${returnRate}%` : 0 }}
          animate={{ width: `${returnRate}%` }}
          transition={prefersReduced ? { duration: 0 } : { delay: 0.4, duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <p className="text-[10px] text-[#bbb] mt-1.5 font-medium">*Statistics are for reference only</p>
    </div>
  )
}

function StatBox({ value, label, color }: { value: string | number; label: string; color: string }) {
  return (
    <div className="bg-[#FAFAFA] rounded-xl p-3.5 flex flex-col items-center text-center">
      <p className={`text-2xl font-black ${color}`}>{value}</p>
      <p className="text-[10px] text-[#999] font-semibold mt-0.5 leading-tight">{label}</p>
    </div>
  )
}

/* ═══════════════════════════════════════════ */
/*   RIGHT: Location Section                  */
/* ═══════════════════════════════════════════ */
function LocationSection({ org }: {
  org: {
    displayAddress: string | null
    location: { latitude: number; longitude: number } | null
  }
}) {
  if (!org.displayAddress && !org.location) return null
  return (
    <div className="bg-white rounded-2xl border border-[#DDDDDD] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)] mt-3">
      <div className="px-5 pt-5 pb-4">
        <h3 className="text-base font-black text-[#111]">Getting here</h3>
        {org.displayAddress && (
          <p className="text-sm text-[#555] mt-1 leading-relaxed flex items-start gap-2">
            <MapPin className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" aria-hidden="true" />
            {org.displayAddress}
          </p>
        )}
      </div>
      {org.location && (
        <div className="relative h-56 overflow-hidden">
          <iframe
            title="Location map"
            aria-hidden="true"
            width="100%" height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${org.location.latitude},${org.location.longitude}&z=16&output=embed`}
          />
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${org.location.latitude},${org.location.longitude}`}
            target="_blank" rel="noreferrer"
            className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white text-[11px] font-bold
                       text-[#111] px-3 py-1.5 rounded-xl shadow-md hover:bg-[#f5f5f5] transition-colors cursor-pointer"
          >
            <MapPin className="w-3 h-3 text-brand-primary" />
            View map
          </a>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════ */
/*   SKELETON                                  */
/* ═══════════════════════════════════════════ */
function OrgDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3
                    grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
      {/* Left skeleton — no card, matches new layout */}
      <div className="flex flex-col">
        <Skeleton className="h-64 sm:h-72 w-full rounded-3xl" />
        <div className="flex justify-center -mt-11">
          <Skeleton className="w-24 h-24 rounded-full" />
        </div>
        <div className="flex flex-col items-center gap-3 pt-3 px-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-full max-w-xs" />
          <Skeleton className="h-3 w-3/4 max-w-xs" />
          <Skeleton className="h-4 w-52" />
        </div>
        <div className="border-t border-[#ebebeb] mt-5 mx-2" />
        <div className="pt-4 px-2 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-3">
              <Skeleton className="w-4 h-4 shrink-0 mt-0.5 rounded" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-2.5 w-14" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right skeleton */}
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-[#ebebeb] shadow-sm p-5 space-y-4">
          <Skeleton className="h-5 w-48" />
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex gap-4 py-2">
              <Skeleton className="w-20 h-20 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="h-14 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    </div>
  )
}
