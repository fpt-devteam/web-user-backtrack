import { Skeleton } from "@/components/ui/skeleton";
import { useGetConversationById } from "@/hooks/use-chat";
import { Avatar } from "@radix-ui/react-avatar";

type ConversationHeaderProps = {
  readonly conversationId: string;
}

export function ConversationHeader({
  conversationId
}: ConversationHeaderProps) {
  const { data: conversation, isLoading } = useGetConversationById(conversationId);
  const subtitle = 'Chatting as Good Samaritan';
  const title = isLoading ? 'Loading...' : conversation?.partner.displayName || 'Conversation';
  return (
    <header className="sticky top-0 z-20 w-full border-b bg-background/80 backdrop-blur">
      {(isLoading) ?
        <Skeleton className="h-12 w-64 rounded-lg" />
        :
        <div className="flex items-center p-4">
          <Avatar className="inline-block h-10 w-10 rounded-full mr-4 align-middle" >
            <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
              <span className="text-lg font-semibold text-white">
                {conversation?.partner.displayName?.charAt(0).toUpperCase() || '?'}
              </span>
            </div>
          </Avatar>
          <div>
            <div className="truncate text-xl font-semibold leading-tight">{title}</div>
            <div className="truncate text-sm text-muted-foreground">
              {subtitle}
            </div>
          </div>
        </div>
      }
    </header >
  )
}
