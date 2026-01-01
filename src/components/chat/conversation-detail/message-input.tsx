// src/components/chat/message-input.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSendMessage } from '@/hooks/use-chat'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Loader2, Smile } from 'lucide-react'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

const messageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').trim(),
})

type MessageFormValues = z.infer<typeof messageSchema>

interface MessageInputProps {
  readonly conversationId: string
  readonly onSend?: () => void
}

export function MessageInput({ conversationId, onSend }: MessageInputProps) {
  const { mutateAsync: sendMessage, isPending } = useSendMessage(conversationId)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
    },
  })

  const watchContent = form.watch('content')

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [watchContent])

  useEffect(() => {
    // Auto-focus on mount
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  const onSubmit = async (values: MessageFormValues) => {
    if (isPending) return

    try {
      await sendMessage(values.content)
      form.reset()
      onSend?.()

      // Ensure focus returns to textarea after sending
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto'
          textareaRef.current.focus()
        }
      })
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      form.handleSubmit(onSubmit)()
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-background"
      >
        <div className="p-4">
          <div className="flex items-end gap-2">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        {...field}
                        ref={textareaRef}
                        placeholder="Type a message..."
                        disabled={isPending}
                        onKeyDown={handleKeyDown}
                        className={cn(
                          "min-h-[44px] max-h-[120px] resize-none pr-10 rounded-2xl",
                          "focus-visible:ring-2 focus-visible:ring-primary transition-all"
                        )}
                        rows={1}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 bottom-2 h-7 w-7 text-muted-foreground hover:text-foreground"
                      >
                        <Smile className="h-4 w-4" />
                      </Button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isPending || !watchContent?.trim()}
              className={cn(
                "h-11 w-11 rounded-full transition-all shrink-0",
                watchContent?.trim() ? "bg-primary hover:bg-primary/90 scale-100" : "scale-95 opacity-50"
              )}
            >
              {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground text-center">
            Press Enter to send, Shift + Enter for new line
          </p>
        </div>
      </form>
    </Form>
  )
}