import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { BacktrackHeader } from '@/components/shared/backtrack-header'
import { Card } from '@/components/ui/card'
import { Loader2, CheckCircle } from 'lucide-react'
import { useAuth, useSignInAnonymous } from '@/hooks/use-auth'
import { useUpsertUser } from '@/hooks/use-user'

export const Route = createFileRoute('/chat/anonymous')({
  component: AnonymousChatPage,
})


function AnonymousChatPage() {
  const { profile: backendProfile, loading: authLoading } = useAuth();
  const signInMutation = useSignInAnonymous();
  const createProfileMutation = useUpsertUser();

  const [hasInitialized, setHasInitialized] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (authLoading || hasInitialized) return;
    if (backendProfile) return;

    setHasInitialized(true);

    signInMutation.mutateAsync()
      .then(() => createProfileMutation.mutateAsync())
      .catch((e) => setError(e));

  }, [authLoading, backendProfile, hasInitialized]);

  const getLoadingMessage = () => {
    if (authLoading) return 'Checking authentication status...';
    if (signInMutation.isPending) return 'Signing in anonymously...';
    if (createProfileMutation.isPending) return 'Creating user profile...';
    return '';
  }

  const loadingMessage = getLoadingMessage()

  if (authLoading || signInMutation.isPending || createProfileMutation.isPending) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BacktrackHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-medium text-lg">{loadingMessage}</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BacktrackHeader />
        <div className="px-6 py-12 max-w-2xl mx-auto">
          <Card className="p-8 bg-red-50 border-2 border-red-200">
            <h2 className="text-xl font-bold text-red-900 mb-4">Authentication Error</h2>
            <p className="text-red-700">
              {error instanceof Error ? error.message : 'An error occurred'}
            </p>
          </Card>
        </div>
      </div>
    )
  }

  // Success state - Show only IDs
  return (
    <div className="min-h-screen bg-gray-50">
      <BacktrackHeader />
      <main className="px-6 py-12 max-w-md mx-auto text-center">
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Authentication Complete
        </h1>
        <p className="text-gray-600 mb-8">
          Anonymous user created successfully
        </p>

        <Card className="p-6 text-left">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Backend Profile ID</p>
            <p className="text-sm font-mono text-gray-900 bg-gray-100 p-3 rounded break-all">
              {backendProfile?.id}
            </p>
          </div>
        </Card>
      </main>
    </div>
  )
}
