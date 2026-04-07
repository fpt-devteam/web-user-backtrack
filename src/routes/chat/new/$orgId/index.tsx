import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useGetOrgById } from '@/hooks/use-org'
import { useSocket } from '@/hooks/use-socket'
import { useAuth, useSignInAnonymous } from '@/hooks/use-auth'
import { useCreateUser } from '@/hooks/use-user'
import { MessageInput } from '@/components/chat/conversation-detail/message-input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Building2, Wifi, WifiOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'
import { useGetConversationByOrgId } from '@/hooks/use-chat'
import { motion, AnimatePresence } from 'framer-motion'

export const Route = createFileRoute('/chat/new/$orgId/')({
  component: NewChatPage,
})

function NewChatPage() {
  const { orgId } = Route.useParams()
  const navigate = useNavigate()
  const { data: org, isLoading } = useGetOrgById(orgId)
  const { isConnected } = useSocket()

  const { profile, syncProfile } = useAuth()
  const { mutateAsync: signInAnonymous } = useSignInAnonymous()
  const { mutateAsync: createUser } = useCreateUser()

  useEffect(() => {
    if (profile) return
    const run = async () => {
      try {
        await signInAnonymous()
        await createUser()
        await syncProfile()
      } catch (err) {
        console.error('[NewChatPage] auto-auth failed:', err)
      }
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { data: existingConversation, isLoading: isCheckingConversation } =
    useGetConversationByOrgId(orgId, !!profile)

  useEffect(() => {
    if (existingConversation?.conversationId) {
      navigate({
        to: '/chat/conversation/$id',
        params: { id: existingConversation.conversationId },
        replace: true,
      })
    }
  }, [existingConversation, navigate])

  const title = org?.name ?? 'Chat'
  const initial = title.charAt(0).toUpperCase()

  // ── Skeleton ──
  if (isCheckingConversation) {
    return (
      <div className="flex h-screen flex-col overflow-hidden bg-white">
        <header className="sticky top-0 z-20 w-full border-b border-[#f0f0f0] bg-white shrink-0">
          <div className="flex items-center gap-3 px-4 py-4">
            <div className="p-2 -ml-1">
              <ArrowLeft className="h-5 w-5 text-[#111]" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center bg-[#F7F7F7]">
          <Skeleton className="h-5 w-40 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">

      {/* ── Header ── */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-20 w-full border-b border-[#f0f0f0] bg-white shrink-0"
      >
        <div className="flex items-center gap-3 px-4 py-4">
          <button
            onClick={() => navigate({ to: '/organizations/$slug', params: { slug: org?.slug ?? '' } })}
            className="p-2 -ml-1 rounded-xl hover:bg-[#f5f5f5] transition-colors duration-200 shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-[#111]" />
          </button>

          {/* Avatar */}
          <div className="relative shrink-0">
            {isConnected && (
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full bg-green-400/40"
              />
            )}
            <Avatar className="h-10 w-10 relative">
              <AvatarFallback className="bg-[#00D2FE]/15 text-[#0099BB] font-black text-sm">
                {isLoading ? <Building2 className="h-4 w-4" /> : initial}
              </AvatarFallback>
            </Avatar>
            <AnimatePresence mode="wait">
              <motion.span
                key={isConnected ? 'on' : 'off'}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className={cn(
                  'absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white',
                  isConnected ? 'bg-green-500' : 'bg-[#ccc]',
                )}
              />
            </AnimatePresence>
          </div>

          {/* Name & status */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-16" />
              </div>
            ) : (
              <>
                <h1 className="truncate text-sm font-black text-[#111] tracking-tight leading-tight">
                  {title}
                </h1>
                <div className="flex items-center gap-1 mt-0.5">
                  <AnimatePresence mode="wait">
                    {isConnected ? (
                      <motion.div
                        key="on"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-1"
                      >
                        <Wifi className="h-3 w-3 text-green-500" />
                        <span className="text-[11px] text-green-600 font-semibold">Online</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="off"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-1"
                      >
                        <WifiOff className="h-3 w-3 text-[#ccc]" />
                        <span className="text-[11px] text-[#bbb] font-medium">Connecting…</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.header>

      {/* ── Empty intro state ── */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center gap-5 px-6 pb-6 bg-[#F7F7F7]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 280, damping: 22 }}
        >
          <div className="w-20 h-20 rounded-3xl bg-[#00D2FE]/15 flex items-center justify-center">
            <Building2 className="h-10 w-10 text-[#0099BB]" />
          </div>
        </motion.div>

        {isLoading ? (
          <Skeleton className="h-4 w-48 rounded-xl" />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.35 }}
            className="text-center"
          >
            <p className="text-sm font-black text-[#111] tracking-tight">{org?.name}</p>
            <p className="text-xs text-[#aaa] font-medium mt-1 max-w-[220px] leading-relaxed">
              Send a message to get started. They'll respond as soon as possible.
            </p>
          </motion.div>
        )}
      </div>

      {/* ── Message input ── */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.18, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="border-t border-[#f0f0f0] bg-white shrink-0"
      >
        <MessageInput orgId={orgId} />
      </motion.div>
    </div>
  )
}