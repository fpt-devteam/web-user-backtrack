import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useMemo,
} from 'react';
import type { UserProfile } from '@/types/user.types';
import { onAuthStateChanged, signOut, signInAnonymously, getAuth } from 'firebase/auth';
import { auth } from '@/lib/firebase.ts'
import { userKeys } from '@/hooks/use-user';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { userService } from '@/services/user.service';

interface AuthContextValue {
  profile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
}
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { readonly children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const queryClient = useQueryClient()

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const backendProfile = await userService.getMe();
          setProfile(backendProfile);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [])


  const logout = async () => {
    await signOut(auth)
    queryClient.removeQueries({ queryKey: userKeys.all })
  }

  const value = useMemo<AuthContextValue>(() => {
    return {
      profile,
      loading,
      logout,
    }
  }, [profile, loading, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useSignInAnonymous() {
  return useMutation({
    mutationFn: async () => {
      await signInAnonymously(auth)
    },
    onError: (error) => {
      console.error('Firebase sign-in error:', error)
    },
  })
}