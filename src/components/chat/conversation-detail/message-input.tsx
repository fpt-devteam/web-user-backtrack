import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, Loader2, WifiOff, Smile, Image } from 'lucide-react'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { useRef, useEffect, useCallback, useState } from 'react'
import { cn } from '@/lib/utils'
import { useSocket } from '@/hooks/use-socket'
import { useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { chatService } from '@/services/chat.service'
import { messagerKeys } from '@/hooks/use-messager'
import { toast } from '@/lib/toast'

const messageSchema = z.object({
  content: z.string().min(1).trim(),
})

type MessageFormValues = z.infer<typeof messageSchema>

interface MessageInputProps {
  conversationId?: string
  orgId?: string
  /** DM: send without a pre-created conversation */
  recipientId?: string
  onSend?: () => void
  /** Called instead of navigating when a new conversation is lazily created */
  onConversationCreated?: (conversationId: string) => void
}

const TYPING_DEBOUNCE_MS = 1500

const QUICK_SUGGESTIONS = [
  'Hello! 👋',
  'Is this item still available?',
  'I found something that might be yours',
  'Can we arrange a time to meet?',
  'Could you describe it in more detail?',
]

export function MessageInput({ conversationId, orgId, recipientId, onSend, onConversationCreated }: MessageInputProps) {
  const { sendMessage, sendTypingStart, sendTypingStop, onMessageSendSuccess, onMessageSendSupportSuccess, onMessageSendError, isConnected, markConversationAsRead } =
    useSocket()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isTypingRef = useRef(false)
  const [isSending, setIsSending] = useState(false)

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: '' },
  })

  const watchContent = form.watch('content')
  const hasText = !!watchContent?.trim()

  /* ── Auto-resize textarea ── */
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }, [watchContent])

  /* ── Auto-focus ── */
  useEffect(() => { textareaRef.current?.focus() }, [])

  /* ── Lazy conversation creation ── */
  useEffect(() => {
    return onMessageSendSuccess((data) => {
      setIsSending(false)
      if (data.isNewConversation && data.conversationId) {
        if (onConversationCreated) {
          onConversationCreated(data.conversationId)
        } else {
          navigate({
            to: '/chat/conversation/$id',
            params: { id: data.conversationId },
            replace: true,
          })
        }
      }
      onSend?.()
    })
  }, [onMessageSendSuccess, navigate, onSend, onConversationCreated])

  useEffect(() => {
    return onMessageSendSupportSuccess((data) => {
      setIsSending(false)
      if (data.isNewConversation && data.conversationId) {
        if (onConversationCreated) {
          onConversationCreated(data.conversationId)
        } else {
          navigate({
            to: '/chat/conversation/$id',
            params: { id: data.conversationId },
            replace: true,
          })
        }
      }
      onSend?.()
    })
  }, [onMessageSendSupportSuccess, navigate, onSend, onConversationCreated])

  /* ── Send error ── */
  useEffect(() => {
    return onMessageSendError((err) => {
      setIsSending(false)
      toast.error(err.message ?? 'Failed to send message')
    })
  }, [onMessageSendError])

  /* ── Typing ── */
  const stopTyping = useCallback(() => {
    if (isTypingRef.current && conversationId) {
      sendTypingStop(conversationId)
      isTypingRef.current = false
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = null
    }
  }, [conversationId, sendTypingStop])

  const handleTyping = useCallback(() => {
    if (!conversationId) return
    if (!isTypingRef.current) { sendTypingStart(conversationId); isTypingRef.current = true }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(stopTyping, TYPING_DEBOUNCE_MS)
  }, [conversationId, sendTypingStart, stopTyping])

  useEffect(() => () => stopTyping(), [stopTyping])

  /* ── Submit ── */
  const onSubmit = useCallback(
    async (values: MessageFormValues) => {
      if (isSending || !isConnected) return
      setIsSending(true)
      stopTyping()

      try {
        let targetId = conversationId
        let isSupport = false

        if (!targetId && orgId) {
          const conv = await chatService.createSupportConversation(orgId)
          targetId = conv.conversationId
          isSupport = true
          void queryClient.invalidateQueries({ queryKey: messagerKeys.conversations() })
          onConversationCreated?.(targetId)
        } else if (!targetId && recipientId) {
          const conv = await chatService.createDirectConversation(recipientId)
          targetId = conv.conversationId
          void queryClient.invalidateQueries({ queryKey: messagerKeys.conversations() })
          onConversationCreated?.(targetId)
          if (!onConversationCreated) {
            navigate({ to: '/chat/conversation/$id', params: { id: targetId }, replace: true })
          }
        }

        if (targetId) {
          sendMessage({ conversationId: targetId, type: 'text', content: values.content, isSupport })
        }
      } catch (err) {
        console.error('[MessageInput] failed to send:', err)
        setIsSending(false)
      }

      form.reset()
      requestAnimationFrame(() => {
        if (textareaRef.current) { textareaRef.current.style.height = 'auto'; textareaRef.current.focus() }
        if (conversationId) setIsSending(false)
      })
    },
    [isSending, isConnected, conversationId, orgId, recipientId, sendMessage, stopTyping, form, navigate, onConversationCreated],
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      form.handleSubmit(onSubmit)()
    }
  }

  const isDisabled = isSending || !isConnected

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Disconnection banner */}
        <AnimatePresence>
          {!isConnected && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex items-center justify-center gap-2 py-2 bg-amber-50 border-b border-amber-100">
                <WifiOff className="h-3.5 w-3.5 text-amber-500" />
                <p className="text-xs text-amber-600 font-medium">Reconnecting…</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick suggestion chips — only shown when input is empty */}
        <AnimatePresence>
          {!hasText && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden"
            >
              <div className="flex gap-2 px-3 pt-2 pb-1 overflow-x-auto scrollbar-none">
                {QUICK_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => form.setValue('content', s, { shouldValidate: true })}
                    className="shrink-0 px-3 py-1.5 rounded-full bg-white border border-gray-300 text-xs text-gray-600 font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors whitespace-nowrap"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input row */}
        <div className="flex items-end gap-2 px-3 py-3">
          {/* Left icons (emoji + image) — hidden once text is present */}
          <AnimatePresence>
            {!hasText && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1 shrink-0 overflow-hidden"
              >
                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Emoji"
                >
                  <Smile className="w-5 h-5 text-gray-500" strokeWidth={1.8} />
                </button>
                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Image"
                >
                  <Image className="w-5 h-5 text-gray-500" strokeWidth={1.8} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Textarea pill */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <textarea
                    value={field.value}
                    name={field.name}
                    onBlur={field.onBlur}
                    ref={textareaRef}
                    placeholder="Message…"
                    disabled={isDisabled}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => { field.onChange(e); handleTyping() }}
                    onFocus={() => { if (conversationId) markConversationAsRead(conversationId) }}
                    rows={1}
                    className={cn(
                      'w-full resize-none rounded-[22px] px-4 py-2.5',
                      'bg-gray-100 border-0 outline-none ring-0',
                      'text-sm text-gray-900 placeholder-gray-400 leading-relaxed',
                      'min-h-[40px] max-h-[120px]',
                      'transition-all duration-150',
                      'disabled:opacity-50',
                    )}
                    style={{ scrollbarWidth: 'none' }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Send / Like button */}
          <AnimatePresence mode="wait">
            {hasText ? (
              /* Send button — appears when there's text */
              <motion.button
                key="send"
                type="submit"
                disabled={isDisabled}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                className="shrink-0 p-2 rounded-full text-[#0095f6] hover:text-[#1877f2] transition-colors disabled:opacity-40"
                aria-label="Send"
              >
                {isSending ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Send className="w-6 h-6" strokeWidth={2} />
                )}
              </motion.button>
            ) : (
              /* Like button — shown when input is empty */
              <motion.button
                key="like"
                type="button"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                className="shrink-0 p-2 rounded-full text-[#0095f6] hover:text-[#1877f2] transition-colors text-xl"
                aria-label="Like"
              >
                👍
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </form>
    </Form>
  )
}