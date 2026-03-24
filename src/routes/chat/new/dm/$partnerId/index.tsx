import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { MessageInput } from '@/components/chat/conversation-detail/message-input'
import { ArrowLeft, User2 } from 'lucide-react'
import { motion } from 'framer-motion'

export const Route = createFileRoute('/chat/new/dm/$partnerId/')(
  { component: NewDmPage }
)

function NewDmPage() {
  const { partnerId } = Route.useParams()
  const navigate = useNavigate()

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
            onClick={() => navigate({ to: '/' })}
            className="p-2 -ml-1 rounded-xl hover:bg-[#f5f5f5] transition-colors duration-200 shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-[#111]" />
          </button>
          <h1 className="text-base font-black text-[#111] tracking-tight">New Message</h1>
        </div>
      </motion.header>

      {/* ── Empty intro ── */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center gap-5 px-6 pb-6 bg-[#F7F7F7]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 280, damping: 22 }}
        >
          <div className="w-20 h-20 rounded-3xl bg-[#00D2FE]/15 flex items-center justify-center">
            <User2 className="h-10 w-10 text-[#0099BB]" />
          </div>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.35 }}
          className="text-xs text-[#aaa] font-medium text-center max-w-[220px] leading-relaxed"
        >
          Send a message to get started.
        </motion.p>
      </div>

      {/* ── Message input ── */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.18, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="border-t border-[#f0f0f0] bg-white shrink-0"
      >
        <MessageInput recipientId={partnerId} />
      </motion.div>
    </div>
  )
}
