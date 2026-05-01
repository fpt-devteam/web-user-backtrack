import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, Loader2, WifiOff, Camera } from 'lucide-react'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { useRef, useEffect, useCallback, useState } from 'react'
import { cn } from '@/lib/utils'
import { useSocket } from '@/hooks/use-socket'
import { motion, AnimatePresence } from 'framer-motion'
import { messageService } from '@/services/message.service'
import { toast } from '@/lib/toast'
import { useGetConversationById } from '@/hooks/use-message'
import { useSendNotification } from '@/hooks/use-notification'
import { NOTIFICATION_CATEGORY, NOTIFICATION_EVENT } from '@/types/notification.type'
import { useAuth } from '@/hooks/use-auth'

const messageSchema = z.object({
  content: z.string().min(1).trim(),
})

type MessageFormValues = z.infer<typeof messageSchema>

interface MessageInputProps {
  conversationId?: string
  isSupport?: boolean
  onSend?: () => void
}

const TYPING_DEBOUNCE_MS = 1500

const QUICK_SUGGESTIONS = [
  'Hello! 👋',
  'Is this item still available?',
  'I found something that might be yours',
  'Can we arrange a time to meet?',
  'Could you describe it in more detail?',
]

export function MessageInput({ conversationId, isSupport, onSend }: MessageInputProps) {
  const {
    sendMessage,
    sendTypingStart,
    sendTypingStop,
    onMessageSendError,
    isConnected,
    markConversationAsRead,
  } = useSocket()

  const { profile: myProfile } = useAuth()
  const { data: conversation } = useGetConversationById(conversationId ?? '', !!conversationId)
  const { mutate: sendNotification } = useSendNotification()

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isTypingRef = useRef(false)
  const [isSending, setIsSending] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: '' },
  })

  const watchContent = form.watch('content')
  const hasText = !!watchContent.trim()

  /* ── Auto-resize textarea ── */
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }, [watchContent])

  /* ── Auto-focus ── */
  useEffect(() => { textareaRef.current?.focus() }, [])

  /* ── Send error ── */
  useEffect(() => {
    return onMessageSendError((err) => {
      setIsSending(false)
      toast.error(err.message || 'Failed to send message')
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

  const triggerPushNotification = useCallback(
    (content: string, type: 'text' | 'image' = 'text') => {
      console.log('Triggering push notification for recipient...', conversation)
      const recipientId = conversation?.partner?.id
      if (!recipientId || !conversationId) return

      const randomSuffix = () => Math.random().toString(36).substring(2, 10)
      
      sendNotification({
        target: { userId: recipientId },
        source: {
          name: 'web-chat-sender',
          eventId: `msg-${conversationId}-${Date.now()}-${randomSuffix()}`,
        },
        title: myProfile?.displayName ? `${myProfile.displayName} sent a message` : 'New message',
        body: type === 'image' ? 'Sent an image' : content,
        category: NOTIFICATION_CATEGORY.Push,
        type: NOTIFICATION_EVENT.ChatEvent,
        data: {
          screenPath: 'CHAT_THREAD',
          conversationId,
        },
      })
    },
    [conversation, conversationId, myProfile, sendNotification],
  )

  /* ── Submit ── */
  const onSubmit = useCallback(
    (values: MessageFormValues) => {
      if (isSending || !isConnected || !conversationId) return
      setIsSending(true)
      stopTyping()
      sendMessage({ conversationId, type: 'text', content: values.content, isSupport })
      
      // Send push notification to recipient
      triggerPushNotification(values.content, 'text')

      form.reset()
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto'
          textareaRef.current.focus()
        }
        setIsSending(false)
      })
      onSend?.()
    },
    [isSending, isConnected, conversationId, isSupport, sendMessage, stopTyping, form, onSend, triggerPushNotification],
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      form.handleSubmit(onSubmit)()
    }
  }

  /* ── Image capture ── */
  const handleImageCapture = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file || !conversationId) return
      e.target.value = ''

      setIsUploading(true)
      try {
        const url = await messageService.uploadChatImage(file)
        sendMessage({ conversationId, type: 'image', content: url, isSupport })

        // Send push notification to recipient
        triggerPushNotification(url, 'image')

        onSend?.()
      } catch {
        toast.error('Failed to upload image')
      } finally {
        setIsUploading(false)
      }
    },
    [conversationId, isSupport, sendMessage, onSend, triggerPushNotification],
  )

  const isDisabled = isSending || !isConnected || isUploading

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Hidden camera/image input */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleImageCapture}
        />

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
                    className="shrink-0 px-3 py-1.5 rounded-full bg-white border border-gray-100 text-xs text-gray-600 font-medium hover:bg-gray-50 hover:border-gray-400 transition-colors whitespace-nowrap"
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
          {/* Camera button */}
          <button
            type="button"
            disabled={isDisabled}
            onClick={() => cameraInputRef.current?.click()}
            className="shrink-0 p-2 rounded-full text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-40"
            aria-label="Send photo"
          >
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Camera className="w-6 h-6 text-primary" strokeWidth={2} />
            )}
          </button>

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
                      'bg-gray-200 border-0 outline-none ring-0',
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

          {/* Send button */}
          <button
            type="submit"
            disabled={isDisabled || !hasText}
            className="shrink-0 p-2 rounded-full text-[#0095f6] hover:text-[#1877f2] transition-colors disabled:opacity-40"
            aria-label="Send"
          >
            {isSending ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Send className="w-6 h-6 text-primary" strokeWidth={2} />
            )}
          </button>
        </div>
      </form>
    </Form>
  )
}
