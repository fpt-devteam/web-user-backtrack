import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useGetOrgById } from '@/hooks/use-org'
import { useAuth, useSignInAnonymous } from '@/hooks/use-auth'
import { useCreateUser } from '@/hooks/use-user'
import { chatService } from '@/services/chat.service'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { MapPin, Phone, ArrowLeft, MessageCircle, ShieldCheck } from 'lucide-react'
import { motion, type Variants } from 'framer-motion'

export const Route = createFileRoute('/org/$id/')({
  component: OrgDetailPage,
})

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
}

function OrgDetailPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const { profile, syncProfile } = useAuth()
  const { data: org, isLoading } = useGetOrgById(id)
  const { mutateAsync: signInAnonymous, isPending: isSigningIn } = useSignInAnonymous()
  const { mutateAsync: createUser, isPending: isCreatingUser } = useCreateUser()

  const isAuthPending = isSigningIn || isCreatingUser

  const handleStartChat = async () => {
    if (!profile) {
      await signInAnonymous()
      await createUser()
      await syncProfile()
    }

    // Check if a conversation with this org already exists
    try {
      const existing = await chatService.getConversationByOrgId(id)
      if (existing?.conversationId) {
        navigate({ to: '/chat/conversation/$id', params: { id: existing.conversationId } })
        return
      }
    } catch {
      // If check fails, fall through to the new-chat flow
    }

    navigate({ to: '/chat/new/$orgId', params: { orgId: id } })
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── Header ── */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white border-b border-[#f0f0f0] px-4 py-4 flex items-center gap-3 sticky top-0 z-10"
      >
        <button
          onClick={() => navigate({ to: '/organizations' })}
          className="p-2 -ml-1 rounded-xl hover:bg-[#f5f5f5] transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 text-[#111]" />
        </button>
        <h1 className="text-base font-black text-[#111] truncate tracking-tight">
          {isLoading ? <Skeleton className="h-5 w-32 inline-block" /> : (org?.name ?? 'Organisation')}
        </h1>
      </motion.div>

      {/* ── Content ── */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-3 pb-36">
        {isLoading ? (
          <OrgDetailSkeleton />
        ) : org ? (
          <>
            {/* ── Identity block ── */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
              <div className="bg-[#F7F7F7] rounded-3xl p-5">
                <div className="flex items-start gap-4">
                  {/* Logo */}
                  <div className="w-14 h-14 rounded-2xl bg-white border border-[#efefef] flex items-center justify-center shrink-0 overflow-hidden">
                    <img
                      src={org.logoUrl ?? '/org-default.png'}
                      alt={org.name}
                      className="w-9 h-9 object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0 pt-0.5">
                    <h2 className="text-xl font-black text-[#111] leading-tight tracking-tight">
                      {org.name}
                    </h2>
                    {org.industryType && (
                      <span className="inline-block mt-1.5 text-[10px] font-bold text-[#0099BB] bg-[#00D2FE]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {org.industryType}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── Info rows ── */}
            <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show">
              <div className="bg-white rounded-3xl border border-[#f0f0f0] divide-y divide-[#f5f5f5] overflow-hidden">
                {org.displayAddress && (
                  <div className="flex items-start gap-3 px-5 py-4">
                    <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4 text-rose-400" />
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <p className="text-[10px] font-bold text-[#bbb] uppercase tracking-widest mb-0.5">Address</p>
                      <p className="text-sm font-semibold text-[#111] leading-snug">{org.displayAddress}</p>
                    </div>
                  </div>
                )}
                {org.phone && (
                  <div className="flex items-start gap-3 px-5 py-4">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                      <Phone className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <p className="text-[10px] font-bold text-[#bbb] uppercase tracking-widest mb-0.5">Phone</p>
                      <a href={`tel:${org.phone}`} className="text-sm font-semibold text-[#0099BB] hover:underline">
                        {org.phone}
                      </a>
                    </div>
                  </div>
                )}
                {org.status && (
                  <div className="flex items-start gap-3 px-5 py-4">
                    <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <p className="text-[10px] font-bold text-[#bbb] uppercase tracking-widest mb-0.5">Status</p>
                      <p className="text-sm font-semibold text-emerald-600">{org.status}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* ── Verified banner ── */}
            <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show">
              <div className="bg-[#00D2FE]/8 border border-[#00D2FE]/20 rounded-3xl px-5 py-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#00D2FE]/15 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-[#0099BB]" />
                </div>
                <div>
                  <p className="text-sm font-black text-[#111] tracking-tight">Verified Safe Drop Point</p>
                  <p className="text-xs text-[#aaa] mt-0.5 font-medium leading-relaxed">
                    Hand in found items or enquire about lost belongings — no personal info shared.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </div>

      {/* ── Fixed CTA ── */}
      {org && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#f0f0f0] px-4 pt-3 pb-8"
        >
          <div className="max-w-sm mx-auto">
            <Button
              onClick={handleStartChat}
              disabled={isAuthPending}
              className="w-full h-14 rounded-2xl text-[15px] font-black bg-[#111] hover:bg-[#222] text-white flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed shadow-none"
            >
              {isAuthPending ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <MessageCircle className="h-5 w-5" />
                  Chat with {org.name}
                </>
              )}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

function OrgDetailSkeleton() {
  return (
    <div className="space-y-3">
      <div className="bg-[#F7F7F7] rounded-3xl p-5 flex items-start gap-4">
        <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
        <div className="space-y-2 pt-1 flex-1">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-20 rounded-full" />
        </div>
      </div>
      <div className="bg-white rounded-3xl border border-[#f0f0f0] divide-y divide-[#f5f5f5] overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-4">
            <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-2.5 w-16 rounded-full" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}