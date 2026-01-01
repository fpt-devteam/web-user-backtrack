import { Skeleton } from "@/components/ui/skeleton"
import { useGetConversationById } from "@/hooks/use-chat"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type ConversationHeaderProps = {
  readonly conversationId: string
}

export function ConversationHeader({ conversationId }: ConversationHeaderProps) {
  const { data: conversation, isLoading } = useGetConversationById(conversationId)
  const subtitle = 'Chatting as Good Samaritan'
  const title = conversation?.partner.displayName || 'Conversation'

  if (isLoading) {
    return (
      <header className="sticky top-0 z-20 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-3 p-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-20 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="flex items-center gap-4 p-4">
        <div className="relative">
          <Avatar className="h-12 w-12 border-2 border-primary/20">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white text-lg font-semibold">
              {title.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="truncate text-lg font-semibold">{title}</h2>
          <p className="truncate text-sm text-muted-foreground">
            {subtitle}
          </p>
        </div>
      </div>
    </header>
  )
}
