// src/components/chat/message-input.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSendMessage } from '@/hooks/use-chat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';

const messageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').trim(),
});

type MessageFormValues = z.infer<typeof messageSchema>;

interface MessageInputProps {
  readonly conversationId: string;
  readonly onSend?: () => void;
}

export function MessageInput({ conversationId, onSend }: MessageInputProps) {
  const { mutateAsync: sendMessage, isPending } = useSendMessage(conversationId);

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
    },
  });

  const onSubmit = async (values: MessageFormValues) => {
    if (isPending) return

    await sendMessage(values.content, {
      onSuccess: () => {
        form.reset();
        onSend?.();
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 border-t flex gap-2">
        <FormField control={form.control} name="content" render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <Input {...field} placeholder="Type a message..." disabled={isPending} />
            </FormControl>
          </FormItem>
        )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </Form>
  );
}