import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import type { Variants } from 'framer-motion'
import { useAuth, useSignInAnonymous } from '@/hooks/use-auth'
import { AnonymousProfileDialog } from '@/components/shared/anonymous-profile-dialog'
import { orgKeys, useGetOrgBySlug } from '@/hooks/use-org'
import { useCreateUser } from '@/hooks/use-user'
import { toast } from '@/lib/toast'
import { userService } from '@/services/user.service'
import { Skeleton } from '@/components/ui/skeleton'
import { orgService } from '@/services/org.service'
import { messageService } from '@/services/message.service'
import { OrgProfileCard } from '@/components/organizations/org-profile-card'
import { OrgInventoryList } from '@/components/organizations/org-inventory-list'
import { GuidesAccordion } from '@/components/organizations/guides-accordion'
import { PolicyRow } from '@/components/organizations/policy-row'
import { LocationSection } from '@/components/organizations/location-section'

export const Route = createFileRoute('/organizations/$slug/')({
  component: OrgDetailPage,
  loader: ({ context: { queryClient }, params: { slug } }) =>
    queryClient.ensureQueryData({
      queryKey: orgKeys.detail(slug),
      queryFn: () => orgService.getOrgBySlug(slug),
      staleTime: 1000 * 60 * 5,
    }),
})

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

function OrgDetailPage() {
  const { slug } = Route.useParams()
  const navigate = useNavigate()

  const { data: org, isLoading: isOrgLoading } = useGetOrgBySlug(slug)
  const { syncProfile, loading: isProfileLoading } = useAuth()

  const { mutateAsync: createUser } = useCreateUser()

  if (isOrgLoading || isProfileLoading) { return <OrgDetailSkeleton /> }
  if (!org) {
    navigate({ to: '/organizations' })
    return null
  }
  const [showAnonDialog, setShowAnonDialog] = useState(false)

  const createConversation = async () => {
    const conversation = await messageService.createSupportConversation(org.id)
    const convId = conversation.conversationId
    if (!convId) throw new Error('No conversation ID returned from server')
    navigate({
      to: '/message',
      search: {
        selectedId: convId,
        isSupport: true,
        fallbackName: org.name,
        ...(org.logoUrl ? { fallbackAvatarUrl: org.logoUrl } : {}),
      } as never,
    })
  }
  const handleStartChat = async () => {
    const freshProfile = await syncProfile()
    if (freshProfile && freshProfile.displayName) {
      await createConversation()
      return
    }
    setShowAnonDialog(true)
  }

  const handleAnonConfirm = async (displayName: string) => {
    try {
      await createUser()
      await userService.updateMe({ displayName })
      await syncProfile()
      setShowAnonDialog(false)
      await createConversation()
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

        {/* Back button */}
        <div className="max-w-350 mx-auto px-6 sm:px-8 pt-4 pb-1">
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

        {/* Two-column grid */}
        <div className="max-w-350 mx-auto px-6 sm:px-8 py-3
                        grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8 items-start">

          {/* LEFT: Profile card */}
          <motion.div
            custom={0} variants={motionVariant} initial="hidden" animate="show"
            className="lg:sticky lg:top-6"
          >
            <OrgProfileCard
              org={org}
              onChat={handleStartChat}
              isAuthPending={isOrgLoading}
            />
          </motion.div>

          {/* RIGHT: Inventory + guides + info */}
          <motion.div
            custom={1} variants={motionVariant} initial="hidden" animate="show"
            className="flex flex-col gap-0"
          >
            <OrgInventoryList slug={slug} org={org} />
            <GuidesAccordion />
            <PolicyRow />
            <LocationSection org={org} />
          </motion.div>
        </div>

      </div>
    </>
  )
}

function OrgDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3
                    grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
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
