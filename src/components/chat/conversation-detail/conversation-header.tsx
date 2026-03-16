import { Skeleton } from "@/components/ui/skeleton"
import { useGetConversationById } from "@/hooks/use-chat"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useSocket } from "@/hooks/use-socket"
import { cn } from "@/lib/utils"
import { ArrowLeft, Wifi, WifiOff } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { motion, AnimatePresence } from "framer-motion"

type ConversationHeaderProps = {
  readonly conversationId: string
}

export function ConversationHeader({ conversationId }: ConversationHeaderProps) {
  const { data: conversation, isLoading } = useGetConversationById(conversationId)
  const { isConnected } = useSocket()
  const navigate = useNavigate()

  const title = conversation?.partner?.displayName ?? 'Conversation'
  const initial = title.charAt(0).toUpperCase()

  if (isLoading || !conversation) {
    return (
      <header className="sticky top-0 z-20 w-full border-b border-white/60 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="flex items-center gap-3 px-3 py-3">
          <div className="p-2">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3.5 w-20" />
          </div>
        </div>
      </header>
    )
  }

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-20 w-full border-b border-white/60 bg-white/80 backdrop-blur-xl shadow-sm"
    >
      <div className="flex items-center gap-3 px-3 py-3">
        {/* Back button */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => navigate({ to: '/org' })}
          className="p-2 rounded-full hover:bg-gray-100/80 transition-colors shrink-0"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </motion.button>

        {/* Avatar with pulsing ring */}
        <div className="relative shrink-0">
          {isConnected && (
            <motion.div
              animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full bg-green-400/50"
            />
          )}
          <Avatar className="h-10 w-10 border-2 border-primary/10 shadow-md relative">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 via-violet-500 to-pink-500 text-white text-base font-semibold">
              {initial}
            </AvatarFallback>
          </Avatar>

          {/* Online dot */}
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
          <h2 className="truncate text-sm font-semibold leading-tight text-gray-900">{title}</h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <AnimatePresence mode="wait">
              {isConnected ? (
                <motion.div
                  key="on"
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 4 }}
                  className="flex items-center gap-1"
                >
                  <Wifi className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">Online</span>
                </motion.div>
              ) : (
                <motion.div
                  key="off"
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 4 }}
                  className="flex items-center gap-1"
                >
                  <WifiOff className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-500">Offline</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
