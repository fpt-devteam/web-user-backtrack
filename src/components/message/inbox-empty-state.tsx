import { Send } from 'lucide-react'
import { motion } from 'framer-motion'

export function InboxEmptyState() {
  return (
    <motion.div
      className="flex flex-col items-center gap-4 text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="w-[90px] h-[90px] rounded-full border-2 border-gray-900 flex items-center justify-center">
        <Send className="w-10 h-10 text-gray-900 -rotate-12" strokeWidth={1.4} />
      </div>

      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-gray-900">Your messages</h2>
        <p className="text-sm text-gray-500 max-w-[220px] leading-relaxed">
          Send a message to start a chat.
        </p>
      </div>
    </motion.div>
  )
}
