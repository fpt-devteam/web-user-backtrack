import { Button } from "@/components/ui/button";
import { useAuth, useSignInAnonymous } from "@/hooks/use-auth";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate } from "@tanstack/react-router";
import { useCreateUser } from "@/hooks/use-user";

export function StartChatButton(
  { partnerId }: { readonly partnerId: string; readonly itemName?: string }
) {
  const { profile, syncProfile } = useAuth();
  const { mutateAsync: signInAnonymous, isPending: isSigningIn } = useSignInAnonymous();
  const { mutateAsync: createUser, isPending: isCreatingUser } = useCreateUser();
  const isLoading = isSigningIn || isCreatingUser;
  const navigate = useNavigate();

  const handleStartChat = async () => {
    // Only sign in anonymously if not already authenticated
    if (!profile) {
      await signInAnonymous();
      await createUser();
      await syncProfile();
    }
    navigate({ to: "/chat/new/dm/$partnerId", params: { partnerId } });
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