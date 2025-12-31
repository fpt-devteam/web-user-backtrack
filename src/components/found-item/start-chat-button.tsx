import { useCreateConversation } from "@/hooks/use-chat";
import { Button } from "@/components/ui/button";
import type { CreateConversationRequest } from "@/types/chat.types";
import { useSignInAnonymous } from "@/hooks/use-auth";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate } from "@tanstack/react-router"
import { useCreateUser } from "@/hooks/use-user";

export function StartChatButton(
  { partnerId, itemName }: { readonly partnerId: string; readonly itemName?: string }
) {
  const { mutateAsync: createConversation, isPending: isCreatingConversation } = useCreateConversation();
  const { mutateAsync: signInAnonymous, isPending: isSigningIn } = useSignInAnonymous();
  const { mutateAsync: createUser, isPending: isCreatingUser } = useCreateUser();
  const isLoading = isCreatingConversation || isSigningIn || isCreatingUser;
  const navigate = useNavigate();

  const createConversationRequest: CreateConversationRequest = {
    partnerId,
    creatorKeyName: `${itemName} finder`,
    partnerKeyName: `${itemName} seeker`,
  };
  const handleStartChat = async () => {
    signInAnonymous()
      .then(() => createUser())
      .then(() => createConversation(createConversationRequest))
      .then((res) => {
        navigate({ to: "/chat/conversation/$id", params: { id: res.conversationId } })
      })
      .catch(() => { console.error('Error starting chat conversation'); });
  };

  return (
    <Button onClick={handleStartChat} disabled={isLoading} className="relative w-full max-w-sm h-14 rounded-full text-base font-semibold mx-auto block">
      {isLoading && (
        <span className="absolute inset-0 grid place-items-center">
          <Spinner size="sm" />
        </span>
      )}

      <span className={isLoading ? "opacity-0" : "opacity-100"}>
        Start Chat
      </span>
    </Button>
  )
}