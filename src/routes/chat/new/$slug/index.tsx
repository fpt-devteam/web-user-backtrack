import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useGetOrgBySlug } from '@/hooks/use-org'
import { useAuth, useSignInAnonymous } from '@/hooks/use-auth'
import { useCreateUser } from '@/hooks/use-user'
import { useGetConversationByOrgId } from '@/hooks/use-chat'
import { ConversationHeader } from '@/components/chat/conversation-detail/conversation-header'
import { MessageList } from '@/components/chat/conversation-detail/message-list'
import { MessageInput } from '@/components/chat/conversation-detail/message-input'

export const Route = createFileRoute('/chat/new/$slug/')({
  component: NewChatPage,
})

function NewChatPage() {
  const { slug } = Route.useParams()
  const navigate = useNavigate()

  // Holds the conversationId created by sending the first message
  const [createdConversationId, setCreatedConversationId] = useState<string | undefined>()

  const { data: org } = useGetOrgBySlug(slug)
  const { profile, syncProfile } = useAuth()
  const { mutateAsync: signInAnonymous } = useSignInAnonymous()
  const { mutateAsync: createUser } = useCreateUser()

  // Auto-authenticate anonymous users so they can send messages
  useEffect(() => {
    if (profile) return
    const run = async () => {
      try {
        await signInAnonymous()
        await createUser()
        await syncProfile()
      } catch (err) {
        console.error('[NewChatPage] auto-auth failed:', err)
      }
    }
    run()
  }, [createUser, profile, signInAnonymous, syncProfile])

  const { data: existingConversation, isLoading: isCheckingConversation } =
    useGetConversationByOrgId(org?.id ?? '', !!profile && !!org?.id)

  // If an existing conversation is found, redirect directly to it
  useEffect(() => {
    if (existingConversation?.conversationId) {
      navigate({
        to: '/chat/conversation/$id',
        params: { id: existingConversation.conversationId },
        replace: true,
      })
    }
  }, [existingConversation?.conversationId, navigate])

  // Derive synchronously: prefer newly-created, then existing from server
  const activeConversationId = createdConversationId ?? existingConversation?.conversationId

  // Don't render until we know whether a conversation exists
  const shouldWait = (!!profile && !!org?.id && isCheckingConversation) || !!existingConversation?.conversationId
  if (shouldWait) return null

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      <ConversationHeader
        conversationId={activeConversationId}
        fallback={{ name: org?.name ?? '', avatarUrl: org?.logoUrl }}
        onClose={() => navigate({ to: '/organizations/$slug', params: { slug } })}
      />

      <div className="flex-1 min-h-0 bg-white">
        <MessageList conversationId={activeConversationId} />
      </div>

      <div className="shrink-0 border-t border-gray-100 bg-white">
        <MessageInput
          conversationId={activeConversationId}
          orgId={activeConversationId ? undefined : (org?.id ?? '')}
          onConversationCreated={setCreatedConversationId}
        />
      </div>
    </div>
  )
}
