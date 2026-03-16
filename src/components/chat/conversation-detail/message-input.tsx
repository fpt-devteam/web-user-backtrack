import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Loader2, WifiOff } from 'lucide-react'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { useRef, useEffect, useCallback, useState } from 'react'
import { cn } from '@/lib/utils'
import { useSocket } from '@/hooks/use-socket'
import { useNavigate } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'

const messageSchema = z.object({
  content: z.string().min(1).trim(),
})

type MessageFormValues = z.infer<typeof messageSchema>

interface MessageInputProps {
  /** Pass for existing conversations */
  conversationId?: string
  /** Pass for new chat with org (lazy creation) */
  orgId?: string
  onSend?: () => void
}

const TYPING_DEBOUNCE_MS = 1500

export function MessageInput({ conversationId, orgId, onSend }: MessageInputProps) {
  const { sendMessage, sendTypingStart, sendTypingStop, onMessageSendSuccess, isConnected } = useSocket()
  const navigate = useNavigate()
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

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [watchContent])

  // Auto-focus
  useEffect(() => { textareaRef.current?.focus() }, [])

  // Listen for lazy-creation success
  useEffect(() => {
    const unsub = onMessageSendSuccess((data) => {
      setIsSending(false)
      if (data.isNewConversation && data.conversationId) {
        navigate({ to: '/chat/conversation/$id', params: { id: data.conversationId }, replace: true })
      }
      onSend?.()
    })
    return unsub
  }, [onMessageSendSuccess, navigate, onSend])

  // Typing indicator
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

  const onSubmit = useCallback(
    (values: MessageFormValues) => {
      if (isSending || !isConnected) return
      setIsSending(true)
      stopTyping()

      if (conversationId) {
        sendMessage({ conversationId, type: 'text', content: values.content })
      } else if (orgId) {
        sendMessage({ orgId, type: 'text', content: values.content })
      }

      form.reset()
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto'
          textareaRef.current.focus()
        }
        if (conversationId) setIsSending(false)
      })
    },
    [isSending, isConnected, conversationId, orgId, sendMessage, stopTyping, form],
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white/80 backdrop-blur-sm">
        {/* Disconnection banner */}
        <AnimatePresence>
          {!isConnected && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="flex items-center justify-center gap-2 py-2 bg-amber-50 border-b border-amber-100">
                <WifiOff className="h-3.5 w-3.5 text-amber-500" />
                <p className="text-xs text-amber-700 font-medium">Reconnecting…</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="px-3 py-3">
          <div className="flex items-end gap-2">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Textarea
                      {...field}
                      ref={textareaRef}
                      placeholder="Type a message…"
                      disabled={isDisabled}
                      onKeyDown={handleKeyDown}
                      onChange={(e) => { field.onChange(e); handleTyping() }}
                      className={cn(
                        'min-h-[44px] max-h-[120px] resize-none rounded-2xl',
                        'bg-gray-50/80 border-gray-200/80 placeholder:text-gray-400',
                        'focus-visible:ring-2 focus-visible:ring-violet-400/60 focus-visible:border-violet-300',
                        'transition-all duration-200',
                      )}
                      rows={1}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Send button with animated appearance */}
            <motion.div
              animate={hasText && !isDisabled ? { scale: 1, opacity: 1 } : { scale: 0.85, opacity: 0.45 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            >
              <Button
                type="submit"
                size="icon"
                disabled={isDisabled || !hasText}
                className={cn(
                  'h-11 w-11 rounded-full shrink-0 shadow-md transition-colors duration-200',
                  hasText && !isDisabled
                    ? 'bg-gradient-to-br from-blue-500 via-violet-600 to-purple-600 hover:brightness-110 shadow-violet-500/30'
                    : 'bg-gray-200',
                )}
              >
                <AnimatePresence mode="wait">
                  {isSending ? (
                    <motion.span key="loading" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    </motion.span>
                  ) : (
                    <motion.span key="send" initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}>
                      <Send className="h-4.5 w-4.5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </div>
      </form>
    </Form>
  )
}