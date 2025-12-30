// src/components/chat/message-input.tsx
import { useState, type FormEvent } from 'react';
import { useSendMessage } from '@/hooks/use-chat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2 } from 'lucide-react';

interface MessageInputProps {
  readonly conversationId: string;
}

export function MessageInput({ conversationId }: MessageInputProps) {
  const [content, setContent] = useState('');
  const { mutate: sendMessage, isPending } = useSendMessage(conversationId);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isPending) return;

    sendMessage(content.trim(), {
      onSuccess: () => setContent(''),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
      <Input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type a message..."
        disabled={isPending}
        className="flex-1"
      />
      <Button type="submit" disabled={!content.trim() || isPending}>
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
}