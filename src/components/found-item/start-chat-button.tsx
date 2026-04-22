import { Button } from "@/components/ui/button";
import { useAuth, useSignInAnonymous } from "@/hooks/use-auth";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate } from "@tanstack/react-router";
import { useCreateUser } from "@/hooks/use-user";
import { useCreateDirectConversation } from "@/hooks/use-message";
import { toast } from "@/lib/toast";

export function StartChatButton({
  partnerId,
  fallbackName,
  fallbackAvatarUrl,
}: {
  readonly partnerId: string
  readonly itemName?: string
  readonly fallbackName?: string
  readonly fallbackAvatarUrl?: string
}) {
  const { profile, syncProfile } = useAuth();
  const { mutateAsync: signInAnonymous, isPending: isSigningIn } = useSignInAnonymous();
  const { mutateAsync: createUser, isPending: isCreatingUser } = useCreateUser();
  const { mutateAsync: createDirectConv, isPending: isCreatingConv } = useCreateDirectConversation();
  const isLoading = isSigningIn || isCreatingUser || isCreatingConv;
  const navigate = useNavigate();

  const handleStartChat = async () => {
    if (!partnerId) {
      console.error('[StartChatButton] partnerId is empty — cannot create conversation');
      toast.error('Unable to start chat: user ID is missing');
      return;
    }
    try {
      if (!profile) {
        await signInAnonymous();
        await createUser();
        await syncProfile();
      }
      const conv = await createDirectConv(partnerId);
      navigate({
        to: '/message',
        search: {
          selectedId: conv.conversationId,
          isSupport: false,
          fallbackName: fallbackName ?? undefined,
          fallbackAvatarUrl: fallbackAvatarUrl ?? undefined,
        },
      });
    } catch (err) {
      console.error('[StartChatButton] handleStartChat error:', err);
      toast.error('Failed to start chat. Please try again.');
    }
  };

  return (
    <Button
      onClick={handleStartChat}
      disabled={isLoading}
      className="relative w-full max-w-sm h-14 rounded-full text-base font-semibold mx-auto block"
    >
      {isLoading && (
        <span className="absolute inset-0 grid place-items-center">
          <Spinner size="sm" />
        </span>
      )}
      <span className={isLoading ? "opacity-0" : "opacity-100"}>
        Start Chat
      </span>
    </Button>
  );
}