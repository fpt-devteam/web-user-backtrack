import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useGetOrgById } from '@/hooks/use-org'
import { useAuth, useSignInAnonymous } from '@/hooks/use-auth'
import { useCreateUser } from '@/hooks/use-user'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import {
  MapPin,
  Phone,
  Building2,
  ArrowLeft,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { motion, type Variants } from 'framer-motion'

export const Route = createFileRoute('/org/$id/')({
  component: OrgDetailPage,
})

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
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
    navigate({ to: '/chat/new/$orgId', params: { orgId: id } })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 flex flex-col">
      {/* ── Header ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ y: -48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white/80 backdrop-blur-xl border-b border-white/60 px-4 py-3.5 flex items-center gap-3 sticky top-0 z-10 shadow-sm"
      >
        <motion.button
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.08 }}
          onClick={() => navigate({ to: '/org' })}
          className="p-2 rounded-full hover:bg-gray-100/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </motion.button>
        <h1 className="text-base font-semibold text-gray-900 truncate">
          {isLoading ? <Skeleton className="h-5 w-32 inline-block" /> : (org?.name ?? 'Organisation')}
        </h1>
      </motion.div>

      {/* ── Content ──────────────────────────────────────────── */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-5 space-y-4 pb-36">
        {isLoading ? (
          <OrgDetailSkeleton />
        ) : org ? (
          <>
            {/* ── Org Card ── */}
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="bg-white/90 backdrop-blur-sm rounded-3xl border border-white shadow-xl shadow-blue-900/5 overflow-hidden"
            >
              {/* Decorative top stripe */}
              <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500" />

              <div className="p-6">
                <div className="flex items-center gap-4 mb-5">
                  {/* Animated avatar */}
                  <div className="relative shrink-0">
                    <motion.div
                      animate={{ scale: [1, 1.06, 1] }}
                      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                      className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 opacity-30 blur-md"
                    />
                    <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <Building2 className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{org.name}</h2>
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
                      className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 Ring-1 ring-blue-100 px-3 py-1 rounded-full mt-1.5"
                    >
                      {org.industryType}
                    </motion.span>
                  </div>
                </div>

                {/* Info rows */}
                <div className="space-y-3">
                  {org.displayAddress && (
                    <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show" className="flex items-start gap-3 group">
                      <div className="p-1.5 rounded-lg bg-rose-50 group-hover:bg-rose-100 transition-colors">
                        <MapPin className="h-4 w-4 text-rose-500" />
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed pt-0.5">{org.displayAddress}</p>
                    </motion.div>
                  )}
                  {org.phone && (
                    <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show" className="flex items-center gap-3 group">
                      <div className="p-1.5 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 transition-colors">
                        <Phone className="h-4 w-4 text-emerald-500" />
                      </div>
                      <a href={`tel:${org.phone}`} className="text-sm text-blue-600 hover:underline font-medium">
                        {org.phone}
                      </a>
                    </motion.div>
                  )}
                  {org.status && (
                    <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show" className="flex items-center gap-3 group">
                      <div className="p-1.5 rounded-lg bg-green-50 group-hover:bg-green-100 transition-colors">
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                      </div>
                      <span className="text-sm font-medium text-emerald-700">{org.status}</span>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* ── Verified safe drop banner ── */}
            <motion.div
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="relative overflow-hidden bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-pink-500/10 border border-blue-200/60 rounded-2xl p-4"
            >
              {/* Animated blobs */}
              <motion.div
                animate={{ x: [0, 8, 0], y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-blue-400/20 blur-xl"
              />
              <div className="relative flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white shadow-sm shrink-0">
                  <Sparkles className="h-4 w-4 text-violet-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm mb-0.5">✅ Verified Safe Drop Point</p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    This organisation is a verified safe drop point. Hand in found items or enquire about lost belongings.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </div>

      {/* ── Fixed CTA ─────────────────────────────────────────── */}
      {org && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-white/60 px-4 pt-3 pb-7 shadow-[0_-8px_30px_rgba(0,0,0,0.06)]"
        >
          <motion.div whileTap={{ scale: 0.97 }} className="max-w-sm mx-auto">
            <Button
              onClick={handleStartChat}
              disabled={isAuthPending}
              className="relative w-full h-14 rounded-full text-base font-semibold flex items-center justify-center gap-2.5 overflow-hidden
                         bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600
                         shadow-lg shadow-violet-500/30
                         hover:shadow-xl hover:shadow-violet-500/40 hover:scale-[1.02]
                         transition-all duration-300"
            >
              {/* Shimmer effect */}
              <motion.div
                animate={{ x: [-200, 300] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'linear', repeatDelay: 1 }}
                className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
              />
              {isAuthPending ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <MessageCircle className="h-5 w-5" />
                  Chat with {org.name}
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

function OrgDetailSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-3xl border border-gray-100 p-6 space-y-4 shadow-sm"
    >
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-2xl" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
    </motion.div>
  )
}
