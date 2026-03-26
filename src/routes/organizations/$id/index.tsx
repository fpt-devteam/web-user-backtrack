import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import {
  ArrowLeft,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  Building2,
  Clock,
  CheckCircle2,
  CreditCard,
  QrCode,
  PenLine,
  Package,
  Key,
  Shirt,
  Wallet,
  ChevronLeft,
  Umbrella,
  Backpack,
  Home,
  ClipboardList,
  Camera,
  Handshake,
} from 'lucide-react'
import { useRef, useState } from 'react'
import { useAuth, useSignInAnonymous } from '@/hooks/use-auth'
import { useGetOrgById } from '@/hooks/use-org'
import { useCreateUser } from '@/hooks/use-user'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import type { BusinessHour } from '@/types/org.type'
import { orgService } from '@/services/org.service'
import { orgKeys } from '@/hooks/use-org'

export const Route = createFileRoute('/organizations/$id/')({
  component: OrgDetailPage,
  loader: ({ context: { queryClient }, params: { id } }) =>
    queryClient.ensureQueryData({
      queryKey: orgKeys.detail(id),
      queryFn: () => orgService.getOrgById(id),
      staleTime: 1000 * 60 * 5,
    }),
})

/* ─────────────── animations (prefers-reduced-motion aware) ─────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}
// Reduced-motion variant – no y-translate, instant opacity
const fadeUpReduced: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
}

/* ─────────────── mock found-items (no API yet) ─────────────── */
const FOUND_ITEMS = [
  { id: '1', icon: Key, label: 'Chìa khóa', category: 'Chìa khóa', hoursAgo: 2, blur: true },
  { id: '2', icon: Wallet, label: 'Ví da', category: 'Ví / Túi', hoursAgo: 5, blur: true },
  { id: '3', icon: Shirt, label: 'Áo khoác', category: 'Quần áo', hoursAgo: 8, blur: false },
  { id: '4', icon: Umbrella, label: 'Dù', category: 'Phụ kiện', hoursAgo: 12, blur: false },
  { id: '5', icon: Backpack, label: 'Balo', category: 'Túi xách', hoursAgo: 24, blur: true },
  { id: '6', icon: Package, label: 'Hộp quà', category: 'Khác', hoursAgo: 36, blur: false },
]

/* ─────────────── default values for fields not in API ─────────────── */
const DEFAULT_DESCRIPTION = 'Điểm tiếp nhận và trao trả thất lạc chính thức. Chúng tôi cam kết bảo quản và trả lại tài sản cho chủ nhân một cách an toàn.'
const DEFAULT_LOCATION_NOTE = 'Tầng 1, Quầy lễ tân'
const DEFAULT_STATS = { received: 120, returned: 95 }

const DAY_LABELS: Record<string, string> = {
  Monday: 'Thứ 2', Tuesday: 'Thứ 3', Wednesday: 'Thứ 4',
  Thursday: 'Thứ 5', Friday: 'Thứ 6', Saturday: 'Thứ 7', Sunday: 'CN',
}
const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

/* ═══════════════════════════════════════════ */
/*                  PAGE                       */
/* ═══════════════════════════════════════════ */
function OrgDetailPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const { profile, syncProfile } = useAuth()
  const { data: org, isLoading } = useGetOrgById(id)
  const { mutateAsync: signInAnonymous, isPending: isSigningIn } = useSignInAnonymous()
  const { mutateAsync: createUser, isPending: isCreatingUser } = useCreateUser()
  const isAuthPending = isSigningIn || isCreatingUser
  // Respect prefers-reduced-motion
  const prefersReduced = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const motionVariant = prefersReduced ? fadeUpReduced : fadeUp

  const handleStartChat = async () => {
    if (!profile) {
      await signInAnonymous()
      await createUser()
      await syncProfile()
    }
    navigate({ to: '/chat/new/$orgId', params: { orgId: id } })
  }

  const handleReportLost = async () => {
    if (!profile) {
      await signInAnonymous()
      await createUser()
      await syncProfile()
    }
    navigate({ to: '/chat/new/$orgId', params: { orgId: id } })
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] pb-28">

      {/* ── loading state ── */}
      {isLoading && <OrgDetailSkeleton />}

      {org && (
        <>
          {/* ══ 1. COVER + BREADCRUMB + AVATAR ══ */}
          <CoverSection org={org} onBack={() => navigate({ to: '/organizations' })} />

          {/* ══ 2. PROFILE STRIP (Facebook-style) ══ */}
          <motion.div custom={0} variants={motionVariant} initial="hidden" animate="show">
            <HeroSection org={org} />
          </motion.div>

          {/* ══ 3. MAIN CONTENT GRID ══ */}
          <div className="max-w-5xl mx-auto px-4 mt-5 grid grid-cols-1 lg:grid-cols-[38%_1fr] gap-5 items-stretch">
            {/* Left */}
            <motion.div custom={1} variants={motionVariant} initial="hidden" animate="show" className="flex flex-col gap-4 min-h-0">
              <ContactCard org={org} />
              <MapCard org={org} />
            </motion.div>
            {/* Right — two guide cards side-by-side, then policy + stats */}
            <motion.div custom={2} variants={motionVariant} initial="hidden" animate="show" className="flex flex-col gap-4 min-h-0">
              {/* Guide cards: 2-col grid on md+, stacked on mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ClaimGuideCard />
                <DepositGuideCard />
              </div>
              <PolicyCard />
              <StatsCard prefersReduced={prefersReduced} />
            </motion.div>
          </div>

          {/* ══ 4. FOUND ITEMS CAROUSEL ══ */}
          <motion.div custom={3} variants={motionVariant} initial="hidden" animate="show"
            className="max-w-5xl mx-auto px-4 mt-5"
          >
            <FoundItemsCarousel />
          </motion.div>
        </>
      )}

      {/* ══ 5. STICKY ACTION BAR ══ */}
      {(org || isLoading) && (
        <StickyActionBar
          orgName={org?.name ?? ''}
          isAuthPending={isAuthPending}
          onChat={handleStartChat}
          onReportLost={handleReportLost}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════ */
/*           1. COVER SECTION                  */
/* ═══════════════════════════════════════════ */
function CoverSection({
  org, onBack,
}: {
  org: { name: string; coverImageUrl: string | null; slug: string }
  onBack: () => void
}) {
  return (
    <div className="relative h-52 sm:h-64 overflow-hidden bg-gradient-to-br from-cyan-500 via-teal-400 to-emerald-400">
      {/* Real cover photo if available */}
      {org.coverImageUrl && (
        <img
          src={org.coverImageUrl}
          alt={`Ảnh bìa ${org.name}`}
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      {/* Dot pattern overlay (gradient fallback only) */}
      {!org.coverImageUrl && (
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
      )}
      {/* Bottom-to-top dark vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

      {/* Breadcrumb — back button min 44×44 for touch targets */}
      <div className="absolute top-0 left-0 right-0 px-4 pt-3 pb-2 flex items-center gap-1.5">
        <button
          onClick={onBack}
          aria-label="Quay lại danh sách điểm trả đồ"
          className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-black/20 backdrop-blur-sm text-white
                     hover:bg-black/30 transition-colors duration-200 cursor-pointer
                     focus:outline-none focus:ring-2 focus:ring-white/60 flex items-center justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-white/80 text-xs font-medium bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-xl ml-1">
          <Home className="w-3 h-3" aria-hidden="true" />
          <span>Trang chủ</span>
          <ChevronRight className="w-2.5 h-2.5 opacity-60" aria-hidden="true" />
          <span>Điểm trả đồ</span>
          <ChevronRight className="w-2.5 h-2.5 opacity-60" aria-hidden="true" />
          <span className="text-white font-bold truncate max-w-[100px]" aria-current="page">{org.name}</span>
        </nav>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════ */
/*      2. PROFILE STRIP (Facebook-style)         */
/* ═══════════════════════════════════════════ */
function HeroSection({ org }: {
  org: { name: string; industryType: string; status: string; logoUrl: string | null; description: string | null }
}) {
  return (
    <div className="bg-white border-b border-[#ebebeb] relative z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* ─ Avatar + Name row: flex side-by-side like Facebook ─ */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-5 pt-3 pb-4">

          {/* Avatar: -mt-14 makes it poke 56 px up into the cover photo */}
          <div className="-mt-14 shrink-0 relative z-20">
            <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white
                            shadow-[0_4px_24px_rgba(0,0,0,0.18)]
                            flex items-center justify-center overflow-hidden">
              {org.logoUrl
                ? <img src={org.logoUrl} alt={`Logo của ${org.name}`} className="w-full h-full object-contain" />
                : <Building2 className="w-11 h-11 text-[#ccc]" aria-hidden="true" />}
            </div>
          </div>

          {/* Name + badges column, aligned to bottom of avatar row */}
          <div className="min-w-0 flex-1 pb-1">
            <h1 className="text-xl sm:text-2xl font-black text-[#111] tracking-tight leading-tight">
              {org.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {/* Status */}
              <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full
                ${org.status === 'Active'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  : 'bg-red-50 text-red-600 border border-red-100'}`}>
                <span className={`w-1.5 h-1.5 rounded-full
                  ${org.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                {org.status === 'Active' ? 'Đang hoạt động' : 'Tạm ngừng'}
              </span>

              {/* Verified */}
              <div className="group relative">
                <span
                  tabIndex={0}
                  aria-describedby="verified-tooltip"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1
                              rounded-full bg-cyan-50 text-cyan-700 border border-cyan-100 cursor-default
                              focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-1"
                >
                  <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                  Verified Safe Drop Point
                </span>
                <div
                  id="verified-tooltip"
                  role="tooltip"
                  className="absolute bottom-full left-0 mb-2 w-60 bg-[#111] text-white text-[11px]
                             leading-relaxed rounded-xl px-3 py-2 pointer-events-none z-50 shadow-xl
                             opacity-0 group-hover:opacity-100 group-focus-within:opacity-100
                             transition-opacity duration-200"
                >
                  Điểm tiếp nhận đồ thất lạc đã được xác minh và chứng nhận bởi Backtrack Network.
                  <div className="absolute top-full left-4 border-4 border-transparent border-t-[#111]" aria-hidden="true" />
                </div>
              </div>

              {/* Industry */}
              {org.industryType && (
                <span className="inline-flex items-center text-[11px] font-bold px-3 py-1
                                rounded-full bg-slate-100 text-slate-600 uppercase tracking-wider">
                  {org.industryType}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description — full width below the avatar+name row */}
        <p className="text-sm text-[#475569] leading-relaxed pb-5 max-w-2xl">
          {org.description ?? DEFAULT_DESCRIPTION}
        </p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════ */
/*     3L. CONTACT CARD (Left Column)          */
/* ═══════════════════════════════════════════ */
function formatBusinessHours(hours: BusinessHour[]) {
  const sorted = [...hours].sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day))
  // group consecutive same-schedule days
  const groups: { label: string; time: string }[] = []
  let i = 0
  while (i < sorted.length) {
    const h = sorted[i]
    if (h.isClosed || !h.openTime || !h.closeTime) { groups.push({ label: DAY_LABELS[h.day], time: 'Đóng cửa' }); i++; continue }
    const timeStr = `${h.openTime} – ${h.closeTime}`
    let j = i + 1
    while (j < sorted.length && !sorted[j].isClosed && `${sorted[j].openTime} – ${sorted[j].closeTime}` === timeStr) j++
    const label = j - i === 1 ? DAY_LABELS[h.day] : `${DAY_LABELS[h.day]} – ${DAY_LABELS[sorted[j - 1].day]}`
    groups.push({ label, time: timeStr })
    i = j
  }
  return groups
}

function isOpenNow(hours: BusinessHour[] | null): boolean {
  if (!hours || hours.length === 0) return false
  const now = new Date()
  const dayName = DAY_ORDER[now.getDay() === 0 ? 6 : now.getDay() - 1]
  const todayHours = hours.find(h => h.day === dayName)
  if (!todayHours || todayHours.isClosed || !todayHours.openTime || !todayHours.closeTime) return false
  const [oh, om] = todayHours.openTime.split(':').map(Number)
  const [ch, cm] = todayHours.closeTime.split(':').map(Number)
  const nowMins = now.getHours() * 60 + now.getMinutes()
  return nowMins >= oh * 60 + om && nowMins < ch * 60 + cm
}

function ContactCard({ org }: {
  org: {
    displayAddress: string | null
    phone: string | null
    contactEmail: string | null
    locationNote: string | null
    businessHours: BusinessHour[] | null
    location: { latitude: number; longitude: number } | null
  }
}) {
  return (
    <div className="bg-white rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.07)] overflow-hidden divide-y divide-[#f5f5f5]">
      <div className="px-5 py-4">
        <p className="text-[11px] font-black text-[#111] tracking-widest uppercase">Thông tin liên hệ</p>
      </div>

      {/* Location note — use API value or fall back to default */}
      <div className="flex items-start gap-3 px-5 py-3.5">
        <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center shrink-0 mt-0.5">
          <Building2 className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-[#aaa] uppercase tracking-widest mb-0.5">Vị trí cụ thể</p>
          <p className="text-sm font-semibold text-[#111]">{org.locationNote ?? DEFAULT_LOCATION_NOTE}</p>
        </div>
      </div>

      {/* Address */}
      {org.displayAddress && (
        <div className="flex items-start gap-3 px-5 py-3.5">
          <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#aaa] uppercase tracking-widest mb-0.5">Địa chỉ</p>
            <p className="text-sm font-semibold text-[#111] leading-snug">{org.displayAddress}</p>
          </div>
        </div>
      )}

      {/* Business hours — from API */}
      <div className="flex items-start gap-3 px-5 py-3.5">
        <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center shrink-0 mt-0.5">
          <Clock className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-bold text-[#bbb] uppercase tracking-widest mb-1">Giờ hoạt động</p>
          {org.businessHours && org.businessHours.length > 0 ? (
            <div className="space-y-0.5">
              {formatBusinessHours(org.businessHours).map((g, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-[#444]">{g.label}</span>
                  {/* <span className={`font-bold text-xs ${g.time === 'Đóng cửa' ? 'text-red-400' : 'text-[#111]'
                    }`}>{g.time}</span> */}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm font-semibold text-[#111]">08:00 – 18:00 (Thứ 2 – Thứ 6)</p>
          )}
          <OpenNowTag open={isOpenNow(org.businessHours)} />
        </div>
      </div>

      {/* Phone */}
      {org.phone && (
        <div className="flex items-start gap-3 px-5 py-3.5">
          <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center shrink-0 mt-0.5">
            <Phone className="w-4 h-4 text-white" aria-hidden="true" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest mb-0.5">Hotline</p>
            <a
              href={`tel:${org.phone}`}
              aria-label={`Gọi hotline ${org.phone}`}
              className="text-sm font-bold text-[#111] hover:underline cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
            >
              {org.phone}
            </a>
          </div>
        </div>
      )}

      {/* Email */}
      {org.contactEmail && (
        <div className="flex items-start gap-3 px-5 py-3.5">
          <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center shrink-0 mt-0.5">
            <MessageCircle className="w-4 h-4 text-white" aria-hidden="true" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest mb-0.5">Email liên hệ</p>
            <a
              href={`mailto:${org.contactEmail}`}
              aria-label={`Gửi email đến ${org.contactEmail}`}
              className="text-sm font-bold text-[#0099BB] hover:underline break-all cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
            >
              {org.contactEmail}
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

function OpenNowTag({ open }: { open: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold mt-1.5 px-2 py-0.5 rounded-full
      ${open ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${open ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'}`} />
      {open ? 'Đang mở cửa' : 'Đã đóng cửa'}
    </span>
  )
}

/* ── Map Card ── */
function MapCard({ org }: { org: { location: { latitude: number; longitude: number } | null; displayAddress: string | null } }) {
  if (!org.location) return null
  const { latitude: lat, longitude: lng } = org.location
  return (
    <div className="bg-white rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.07)] overflow-hidden flex-1 flex flex-col">
      <div className="relative flex-1 min-h-44 overflow-hidden">
        <iframe
          title="Bản đồ vị trí"
          aria-hidden="true"
          width="100%" height="100%"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`}
        />
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
          target="_blank" rel="noreferrer"
          className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white text-[11px] font-bold text-[#111] px-3 py-1.5 rounded-xl shadow-md hover:bg-[#f5f5f5] transition-colors"
        >
          <MapPin className="w-3 h-3 text-rose-400" />
          Xem bản đồ
        </a>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════ */
/*     3R. CLAIM GUIDE (Right Column)          */
/* ═══════════════════════════════════════════ */
const CLAIM_STEPS = [
  {
    icon: CreditCard,
    title: 'Chuẩn bị giấy tờ tùy thân',
    desc: 'Mang theo CCCD, hộ chiếu hoặc bất kỳ giấy tờ định danh hợp lệ nào.',
  },
  {
    icon: QrCode,
    title: 'Cung cấp thông tin đồ vật',
    desc: 'Xuất trình mã QR từ hệ thống Backtrack hoặc mô tả chi tiết / hình ảnh đồ vật.',
  },
  {
    icon: PenLine,
    title: 'Ký xác nhận nhận lại',
    desc: 'Điền vào biên bản nhận tài sản để hoàn tất quy trình an toàn cho cả hai bên.',
  },
]

function ClaimGuideCard() {
  return (
    <div className="bg-white rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.07)] px-5 py-5">
      <p className="text-[11px] font-black text-[#111] tracking-widest uppercase mb-4">Quy trình nhận lại đồ</p>
      <div className="space-y-0">
        {CLAIM_STEPS.map((step, i) => (
          <div key={i} className="flex gap-4">
            {/* Step column */}
            <div className="flex flex-col items-center shrink-0">
              <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-black shadow-sm">
                {i + 1}
              </div>
              {i < CLAIM_STEPS.length - 1 && (
                <div className="w-[1.5px] flex-1 my-1 bg-brand-muted" />
              )}
            </div>
            {/* Content */}
            <div className="pb-5 pt-0.5">
              <div className="flex items-center gap-2 mb-1">
                <step.icon className="w-3.5 h-3.5 text-brand-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">Bước {i + 1}</span>
              </div>
              <p className="text-sm font-bold text-[#111] leading-snug">{step.title}</p>
              <p className="text-xs text-[#777] mt-1 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════ */
/*     3R-B. DEPOSIT GUIDE (Right Column)      */
/* ═══════════════════════════════════════════ */
const DEPOSIT_STEPS = [
  {
    icon: ClipboardList,
    title: 'Mô tả đồ vật tìm được',
    desc: 'Cung cấp thông tin chi tiết: loại đồ, màu sắc, đặc điểm nhận dạng hoặc địa điểm tìm thấy.',
  },
  {
    icon: Camera,
    title: 'Chụp ảnh & xác nhận tình trạng',
    desc: 'Chụp ảnh đồ vật ngay lúc nộp để đảm bảo minh bạch và tránh tranh chấp sau này.',
  },
  {
    icon: Handshake,
    title: 'Ký biên bản bàn giao',
    desc: 'Nhận phiếu xác nhận đã nộp đồ – bằng chứng pháp lý bảo vệ quyền lợi của bạn.',
  },
]

function DepositGuideCard() {
  return (
    <div className="bg-white rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.07)] px-5 py-5">
      <p className="text-[11px] font-black text-[#111] tracking-widest uppercase mb-4">Quy trình nộp đồ</p>
      <div className="space-y-0">
        {DEPOSIT_STEPS.map((step, i) => (
          <div key={i} className="flex gap-4">
            {/* Step column */}
            <div className="flex flex-col items-center shrink-0">
              <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-black shadow-sm">
                {i + 1}
              </div>
              {i < DEPOSIT_STEPS.length - 1 && (
                <div className="w-[1.5px] flex-1 my-1 bg-brand-muted" />
              )}
            </div>
            {/* Content */}
            <div className="pb-5 pt-0.5">
              <div className="flex items-center gap-2 mb-1">
                <step.icon className="w-3.5 h-3.5 text-brand-primary" aria-hidden="true" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary">Bước {i + 1}</span>
              </div>
              <p className="text-sm font-bold text-[#111] leading-snug">{step.title}</p>
              <p className="text-xs text-[#777] mt-1 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Policy Card ── */
function PolicyCard() {
  return (
    <div className="bg-amber-50 border border-amber-100 rounded-3xl px-5 py-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
        </div>
        <div>
          <p className="text-sm font-black text-[#111] mb-1.5">Chính sách lưu giữ</p>
          <p className="text-xs text-[#666] leading-relaxed">
            Đồ vật được lưu giữ tối đa <strong>30 ngày</strong>. Các vật phẩm có giá trị cao sẽ được
            bàn giao cho cơ quan công an phường sau <strong>7 ngày</strong> nếu không có người nhận.
          </p>
        </div>
      </div>
    </div>
  )
}

/* ── Stats Card ── */
function StatsCard({ prefersReduced }: { prefersReduced: boolean }) {
  const { received, returned } = DEFAULT_STATS
  const returnRate = Math.round((returned / received) * 100)
  return (
    <div className="bg-white rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.07)] px-5 py-5 flex-1 flex flex-col">
      <p className="text-[11px] font-black text-[#111] tracking-widest uppercase mb-4">Thống kê tại điểm này</p>
      <div className="grid grid-cols-3 gap-3 flex-1">
        <div className="bg-[#FAFAFA] rounded-2xl p-3.5 flex flex-col items-center justify-center text-center">
          <p className="text-2xl font-black text-[#111]">{received}</p>
          <p className="text-[10px] text-[#999] font-semibold mt-0.5 leading-tight">Đã tiếp nhận</p>
        </div>
        <div className="bg-[#FAFAFA] rounded-2xl p-3.5 flex flex-col items-center justify-center text-center">
          <p className="text-2xl font-black text-emerald-600">{returned}</p>
          <p className="text-[10px] text-[#999] font-semibold mt-0.5 leading-tight">Đã trao trả</p>
        </div>
        <div className="bg-[#FAFAFA] rounded-2xl p-3.5 flex flex-col items-center justify-center text-center">
          <p className="text-2xl font-black text-cyan-600">{returnRate}%</p>
          <p className="text-[10px] text-[#999] font-semibold mt-0.5 leading-tight">Tỷ lệ trao trả</p>
        </div>
      </div>
      {/* progress bar */}
      <div className="mt-3 h-1.5 bg-[#f0f0f0] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full"
          initial={{ width: prefersReduced ? `${returnRate}%` : 0 }}
          animate={{ width: `${returnRate}%` }}
          transition={prefersReduced ? { duration: 0 } : { delay: 0.5, duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <p className="text-[10px] text-[#bbb] mt-1.5 font-medium">*Số liệu thống kê mang tính tham khảo</p>
    </div>
  )
}

/* ═══════════════════════════════════════════ */
/*     4. FOUND ITEMS CAROUSEL                 */
/* ═══════════════════════════════════════════ */
function FoundItemsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'left' ? -240 : 240, behavior: 'smooth' })
  }

  return (
    <div className="bg-white rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.07)] px-5 py-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[11px] font-black text-[#111] tracking-widest uppercase">Đồ vật mới tìm thấy tại đây</p>
          <p className="text-xs text-[#888] mt-0.5">Bấm vào thẻ để mô tả và xác nhận đồ của bạn</p>
        </div>
        <div className="flex gap-1.5">
          {/* min 44×44 touch target per UI/UX Pro Max guidelines */}
          <button
            onClick={() => scroll('left')}
            aria-label="Cuộn sang trái"
            className="min-w-[44px] min-h-[44px] rounded-xl bg-[#f5f5f5] hover:bg-[#e8e8e8] flex items-center justify-center
                       transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400">
            <ChevronLeft className="w-4 h-4 text-[#555]" aria-hidden="true" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Cuộn sang phải"
            className="min-w-[44px] min-h-[44px] rounded-xl bg-[#f5f5f5] hover:bg-[#e8e8e8] flex items-center justify-center
                       transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400">
            <ChevronRight className="w-4 h-4 text-[#555]" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {FOUND_ITEMS.map((item) => (
          <FoundItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}

function FoundItemCard({ item }: { item: typeof FOUND_ITEMS[0] }) {
  const [revealed, setRevealed] = useState(false)
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={item.blur && !revealed ? `${item.label} – nhấn để mô tả và xem` : item.label}
      style={{ scrollSnapAlign: 'start', minWidth: '160px' }}
      className="group relative bg-[#FAFAFA] rounded-2xl overflow-hidden border border-[#f0f0f0] flex-shrink-0 cursor-pointer
                 hover:border-cyan-200 hover:shadow-[0_4px_16px_rgba(0,153,187,0.12)] transition-all duration-200
                 focus:outline-none focus:ring-2 focus:ring-cyan-400"
      onClick={() => setRevealed(!revealed)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setRevealed(!revealed) }}
    >
      {/* Icon area */}
      <div className={`relative h-24 flex items-center justify-center ${item.blur && !revealed ? 'blur-sm' : ''} transition-all duration-300`}>
        <div className="w-16 h-16 rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] flex items-center justify-center">
          <item.icon className="w-8 h-8 text-[#999]" strokeWidth={1.5} />
        </div>
      </div>

      {/* Blur overlay */}
      {item.blur && !revealed && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-[#111]/60 backdrop-blur-[2px] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-xl flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Mô tả để xem
          </div>
        </div>
      )}

      {/* Info */}
      <div className="px-3 pb-3">
        <p className="text-[11px] font-black text-[#111] truncate">{item.label}</p>
        <p className="text-[10px] text-[#bbb] font-medium">{item.category}</p>
        <p className="text-[10px] text-cyan-600 font-bold mt-1">
          {item.hoursAgo < 24
            ? `Cách đây ${item.hoursAgo} giờ`
            : `Cách đây ${Math.floor(item.hoursAgo / 24)} ngày`}
        </p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════ */
/*     5. STICKY ACTION BAR                    */
/* ═══════════════════════════════════════════ */
function StickyActionBar({
  orgName,
  isAuthPending,
  onChat,
  onReportLost,
  isLoading,
}: {
  orgName: string
  isAuthPending: boolean
  onChat: () => void
  onReportLost: () => void
  isLoading: boolean
}) {
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-lg border-t border-[#f0f0f0] px-4 pt-3 pb-7"
    >
      <div className="max-w-5xl mx-auto flex gap-3">
        {/* Secondary: Chat */}
        <Button
          variant="outline"
          onClick={onChat}
          disabled={isAuthPending || isLoading}
          aria-label={`Bắt đầu chat với ${orgName || 'điểm này'}`}
          className="flex-1 h-13 rounded-2xl text-[13px] font-bold border-[#e5e5e5] text-[#0f172a]
                     hover:bg-[#f8f8f8] flex items-center justify-center gap-2 cursor-pointer
                     focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2
                     transition-colors duration-200"
        >
          {isAuthPending
            ? <Spinner size="sm" />
            : (
              <>
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Chat với </span>{orgName || 'điểm này'}
              </>
            )}
        </Button>

        {/* Primary: Report lost item — no hover:scale to avoid layout shift */}
        <Button
          onClick={onReportLost}
          disabled={isAuthPending || isLoading}
          aria-label="Báo mất đồ tại đây"
          className="flex-[1.4] h-13 rounded-2xl text-[13px] font-black bg-gradient-to-r from-rose-500 to-orange-500
                     hover:opacity-90 text-white flex items-center justify-center gap-2
                     shadow-[0_4px_20px_rgba(239,68,68,0.25)] border-0 transition-opacity duration-200
                     focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 cursor-pointer"
        >
          <AlertTriangle className="w-4 h-4" aria-hidden="true" />
          Báo mất đồ tại đây
        </Button>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════ */
/*     SKELETON                                */
/* ═══════════════════════════════════════════ */
function OrgDetailSkeleton() {
  return (
    <div>
      <Skeleton className="h-52 sm:h-64 w-full rounded-none" />
      <div className="max-w-5xl mx-auto px-4 -mt-6">
        <div className="bg-white rounded-3xl px-6 pt-12 pb-6">
          <Skeleton className="h-7 w-48 mb-3" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-6 w-36 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full max-w-sm mt-3" />
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 mt-5 grid grid-cols-1 lg:grid-cols-[38%_1fr] gap-5">
        <div className="space-y-4">
          <Skeleton className="h-52 w-full rounded-3xl" />
          <Skeleton className="h-44 w-full rounded-3xl" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-52 w-full rounded-3xl" />
          <Skeleton className="h-24 w-full rounded-3xl" />
          <Skeleton className="h-32 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  )
}