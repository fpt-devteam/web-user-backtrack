/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import type { Conversation } from '@/types/chat.type'
import { useGetOrgBySlug } from '@/hooks/use-org'
import { cn } from '@/lib/utils'

export const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -8 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.04, duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  }),
}

export function formatTimestamp(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60_000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m`
  const diffHrs = Math.floor(diffMins / 60)
  if (diffHrs < 24) return `${diffHrs}h`
  const diffDays = Math.floor(diffHrs / 24)
  if (diffDays < 7) return `${diffDays}d`
  const diffWeeks = Math.floor(diffDays / 7)
  if (diffWeeks < 52) return `${diffWeeks}w`
  return d.toLocaleDateString()
}

type ConversationListItemProps = {
  readonly conv: Conversation
  readonly index: number
  readonly isActive: boolean
  readonly onClick: () => void
}

export function ConversationListItem({ conv, index, isActive, onClick }: ConversationListItemProps) {
  const { data: org } = useGetOrgBySlug(conv.orgSlug ?? '', !conv.orgName)

  const displayName =
    conv.orgName?.trim() ||
    org?.name.trim() ||
    conv.partner?.displayName.trim() ||
    'Unknown'

  const avatarUrl =
    conv.orgLogoUrl?.trim() ??
    conv.partner?.avatarUrl?.trim() ??
    conv.partner?.avatar?.trim()

  const lastContent = conv.lastMessage?.content ?? conv.lastMessage?.lastContent

  return (
    <motion.div custom={index} variants={listItemVariants} initial="hidden" animate="show">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'w-full flex items-center gap-3 px-5 py-3.5 transition-colors duration-100 text-left',
          isActive
            ? 'bg-blue-50'
            : 'hover:bg-gray-100',
        )}
      >
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden ring-2 ring-gray-200">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-base font-bold text-gray-600">
                {displayName[0].toUpperCase() ?? '?'}
              </span>
            )}
          </div>
          {conv.unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow">
              {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <p
              className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-bold text-gray-900' : 'font-semibold text-gray-800'}`}
            >
              {displayName}
            </p>
            {conv.lastMessage?.timestamp && (
              <span className="text-[11px] text-gray-400 shrink-0">
                {formatTimestamp(conv.lastMessage.timestamp)}
              </span>
            )}
          </div>
          {lastContent && (
            <p
              className={`text-xs truncate ${conv.unreadCount > 0 ? 'font-semibold text-gray-700' : 'text-gray-500'}`}
            >
              {lastContent}
            </p>
          )}
        </div>
      </button>
    </motion.div>
  )
}
