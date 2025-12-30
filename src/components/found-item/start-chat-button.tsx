import { useCreateConversation } from "@/hooks/use-chat";
import { Button } from "@/components/ui/button";
import type { CreateConversationRequest } from "@/types/chat.types";
import { useSignInAnonymous } from "@/hooks/use-auth";
import { Spinner } from "@/components/ui/spinner";

export function StartChatButton(
  { partnerId, itemName }: { readonly partnerId: string; readonly itemName?: string }
) {
  const { mutateAsync: createConversation, isPending: isCreatingConversation, error: createConversationError, data: conversationResponse } = useCreateConversation();
  const { mutateAsync: signInAnonymous, isPending: isSigningIn, error: signInError } = useSignInAnonymous();
  const isLoading = isCreatingConversation || isSigningIn;
  const createConversationRequest: CreateConversationRequest = {
    partnerId,
    creatorKeyName: `${itemName} finder`,
    partnerKeyName: `${itemName} seeker`,
  };
  const handleStartChat = async () => {
    signInAnonymous()
      .catch((error) => {
        console.error("Error signing in anonymously:", error);
        throw error;
      })
      .then(() => createConversation(createConversationRequest))
      .catch((error) => {
        console.error("Error starting chat:", error);
        throw error;
      })
      .finally(() => {
        console.log("Start chat process completed.");
        console.log("Conversation Response:", conversationResponse);
      });
  };

  return (
    <Button onClick={handleStartChat} disabled={isLoading}>
      {isLoading ? <Spinner size="sm" /> : "Start Chat"}
    </Button>
  )
}