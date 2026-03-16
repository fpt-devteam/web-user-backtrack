import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useMemo,
} from 'react';
import type { UserProfile } from '@/types/user.type';
import {
  onAuthStateChanged, signOut, signInAnonymously,
  getAuth, signInWithEmailAndPassword, EmailAuthProvider,
  linkWithCredential, createUserWithEmailAndPassword, sendEmailVerification,
  GoogleAuthProvider, signInWithPopup, linkWithPopup, signInWithCredential,
  type AuthError,
} from 'firebase/auth';
import { auth } from '@/lib/firebase.ts'
import { userKeys } from '@/hooks/use-user';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { toast } from '@/lib/toast';
import type { CheckEmailStatusRequest, SignInWithEmailAndPasswordInput } from '@/types/auth.type';
import { authService } from '@/services/auth.service';

interface AuthContextValue {
  profile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  syncProfile: () => Promise<void>;
}
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { readonly children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const queryClient = useQueryClient();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser && !firebaseUser.isAnonymous) {
          // Anonymous users have no backend profile yet — skip getMe() to
          // avoid a 401. The caller (e.g. handleStartChat) must call
          // createUser() then syncProfile() explicitly.
          const backendProfile = await userService.getMe();
          setProfile(backendProfile);
        } else if (!firebaseUser) {
          setProfile(null);
        }
        // firebaseUser.isAnonymous → leave profile unchanged; let the
        // downstream flow (createUser → syncProfile) set it.
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [])

  const syncProfile = async () => {
    try {
      const backendProfile = await userService.getMe();
      setProfile(backendProfile);
    } catch (error) {
      console.error('Error syncing user profile:', error);
      setProfile(null);
    }
  }

  const logout = async () => {
    await signOut(auth)
    queryClient.removeQueries({ queryKey: userKeys.all })
  }

  const value = useMemo<AuthContextValue>(() => {
    return {
      profile,
      loading,
      logout,
      syncProfile
    }
  }, [profile, loading, logout, syncProfile])

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
      console.error('Firebase sign-in error:', error);
      toast.fromError(error);
    },
  })
}

export function useSignInWithEmailAndPassword() {
  const { syncProfile } = useAuth()

  return useMutation({
    mutationFn: async ({ email, password }: SignInWithEmailAndPasswordInput) => {
      const currentUser = auth.currentUser;

      if (currentUser?.isAnonymous) {
        const credential = EmailAuthProvider.credential(email, password);
        try {
          await linkWithCredential(currentUser, credential);
        } catch (err) {
          const authErr = err as AuthError;
          if (authErr.code === 'auth/credential-already-in-use' || authErr.code === 'auth/email-already-in-use') {
            // Credential belongs to an existing account — sign out anonymous then sign in normally
            await signOut(auth);
            await signInWithEmailAndPassword(auth, email, password);
          } else {
            throw err;
          }
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    },
    onSuccess: async () => {
      await userService.createUser()
      await syncProfile()
    },
    onError: (error) => {
      toast.fromError(error)
    },
  });
}

export function useSignInWithGoogle() {
  const { syncProfile } = useAuth()

  return useMutation({
    mutationFn: async () => {
      const provider = new GoogleAuthProvider()
      const currentUser = auth.currentUser

      if (currentUser?.isAnonymous) {
        try {
          await linkWithPopup(currentUser, provider)
        } catch (err) {
          const authErr = err as AuthError;
          if (authErr.code === 'auth/credential-already-in-use') {
            // Google account already exists as a separate Firebase user.
            // Sign out the anonymous session, then sign in with the returned credential.
            const credential = GoogleAuthProvider.credentialFromError(authErr);
            await signOut(auth);
            if (credential) {
              await signInWithCredential(auth, credential);
            } else {
              // Fallback: open a fresh Google popup
              await signInWithPopup(auth, provider);
            }
          } else {
            throw err;
          }
        }
      } else {
        await signInWithPopup(auth, provider)
      }
    },
    onSuccess: async () => {
      await userService.createUser()
      await syncProfile()
    },
    onError: (error) => {
      toast.fromError(error)
    },
  })
}

export function useCreateAccount() {
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      await sendEmailVerification(user)
    },
    onError: (error) => {
      toast.fromError(error)
    },
  })
}

export function useResendVerificationEmail() {
  return useMutation({
    mutationFn: async () => {
      const user = auth.currentUser
      if (!user) throw new Error('No authenticated user found')
      await sendEmailVerification(user)
    },
    onSuccess: () => {
      toast.success('Verification email resent!')
    },
    onError: (error) => {
      toast.fromError(error)
    },
  })
}

export function useSignOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await signOut(auth);
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: userKeys.all });
    },
    onError: (error) => {
      console.error('Firebase sign-out error:', error);
      toast.fromError(error);
    }
  });
}

export function useCheckEmailStatus() {
  return useMutation({
    mutationFn: async (request: CheckEmailStatusRequest) => {
      return authService.checkEmailStatus(request);
    },
    onError: (error) => {
      console.error('Error checking email status:', error);
      toast.fromError(error);
    }
  })
}