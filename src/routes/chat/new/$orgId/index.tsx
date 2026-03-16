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
      <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/10">
        <header className="sticky top-0 z-20 w-full border-b border-white/60 bg-white/80 backdrop-blur-xl shadow-sm shrink-0">
          <div className="flex items-center gap-3 px-3 py-3">
            <div className="p-2"><ArrowLeft className="h-5 w-5 text-muted-foreground" /></div>
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3.5 w-20" />
            </div>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <Skeleton className="h-6 w-48 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/10">

      {/* ── Header ─────────────────────────────────────────────── */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-20 w-full border-b border-white/60 bg-white/80 backdrop-blur-xl shadow-sm shrink-0"
      >
        <div className="flex items-center gap-3 px-3 py-3">
          <motion.button
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.08 }}
            onClick={() => navigate({ to: '/org/$id', params: { id: orgId } })}
            className="p-2 rounded-full hover:bg-gray-100/80 transition-colors shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </motion.button>

          {/* Avatar */}
          <div className="relative shrink-0">
            {isConnected && (
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.45, 0, 0.45] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full bg-green-400/50"
              />
            )}
            <Avatar className="h-10 w-10 border-2 border-primary/10 shadow-md relative">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 via-violet-500 to-pink-500 text-white font-semibold">
                {isLoading ? <Building2 className="h-5 w-5" /> : initial}
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
                  'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white shadow-sm',
                  isConnected ? 'bg-green-500' : 'bg-gray-400',
                )}
              />
            </AnimatePresence>
          </div>

          {/* Name & status */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <>
                <Skeleton className="h-5 w-28 mb-1" />
                <Skeleton className="h-3.5 w-16" />
              </>
            ) : (
              <>
                <h1 className="truncate text-sm font-semibold leading-tight text-gray-900">{title}</h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <AnimatePresence mode="wait">
                    {isConnected ? (
                      <motion.div key="on" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1">
                        <Wifi className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-600 font-medium">Online</span>
                      </motion.div>
                    ) : (
                      <motion.div key="off" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1">
                        <WifiOff className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">Connecting…</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.header>

      {/* ── Empty intro state ──────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center gap-5 px-6 pb-6">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 280, damping: 22 }}
          className="relative"
        >
          {/* Pulsing glow */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.15, 0.4] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400 to-purple-500 blur-xl"
          />
          <div className="relative h-24 w-24 rounded-3xl bg-gradient-to-br from-blue-500 via-violet-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-violet-500/30">
            <Building2 className="h-12 w-12 text-white" />
          </div>
        </motion.div>

        {isLoading ? (
          <Skeleton className="h-5 w-48 rounded-xl" />
        ) : (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-center text-sm text-muted-foreground max-w-xs leading-relaxed"
          >
            Start a conversation with{' '}
            <span className="font-semibold text-gray-900">{org?.name}</span>.{' '}
            They will respond as soon as possible.
          </motion.p>
        )}
      </div>

      {/* ── Pinned message input ──────────────────────────────── */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="border-t border-white/60 bg-white/80 backdrop-blur-xl shrink-0"
      >
        <MessageInput orgId={orgId} />
      </motion.div>
    </div>
  )
}
