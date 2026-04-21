import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useMemo,
} from 'react';
import type { User as FirebaseUser } from 'firebase/auth';
import type { UserProfile } from '@/types/user.type';
import {
  onAuthStateChanged, signOut, signInAnonymously,
  getAuth, signInWithEmailAndPassword, EmailAuthProvider,
  linkWithCredential, createUserWithEmailAndPassword, sendEmailVerification,
  GoogleAuthProvider, signInWithPopup, linkWithPopup, signInWithCredential,
  reauthenticateWithCredential, updatePassword,
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
  firebaseUser: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  syncProfile: () => Promise<void>;
}
const AuthContext = createContext<AuthContextValue | null>(null);

// Prevents auto-anonymous sign-in when we deliberately signOut before a real sign-in
let skipAnonymousSignIn = false;

export function AuthProvider({ children }: { readonly children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const queryClient = useQueryClient();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          if (skipAnonymousSignIn) {
            skipAnonymousSignIn = false;
            return;
          }
          // No session at all — sign in anonymously so every visitor has a
          // valid Firebase token (needed for the chat socket and other calls).
          await signInAnonymously(auth);
          // onAuthStateChanged will fire again with the anonymous user.
          return;
        }

        setFirebaseUser(user);

        if (!user.isAnonymous) {
          // Authenticated (non-anonymous) user — fetch backend profile.
          const backendProfile = await userService.getMe();
          setProfile(backendProfile);
          queryClient.setQueryData(userKeys.me(), backendProfile);
        }
        // Anonymous user → firebaseUser is set but profile stays null.
        // The socket can still connect using the anonymous Firebase token.
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [])

  // Keep auth profile state in sync with TanStack Query cache so that
  // mutations like useUpdateMe / useUploadAvatar are reflected immediately.
  useEffect(() => {
    return queryClient.getQueryCache().subscribe((event) => {
      if (
        event.type === 'updated' &&
        JSON.stringify(event.query.queryKey) === JSON.stringify(userKeys.me())
      ) {
        const data = queryClient.getQueryData<UserProfile>(userKeys.me())
        if (data) setProfile(data)
      }
    })
  }, [queryClient])

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
    skipAnonymousSignIn = true
    await signOut(auth)
    setFirebaseUser(null)
    setProfile(null)
    queryClient.removeQueries({ queryKey: userKeys.all })
  }

  const value = useMemo<AuthContextValue>(() => {
    return {
      firebaseUser,
      profile,
      loading,
      logout,
      syncProfile
    }
  }, [firebaseUser, profile, loading, logout, syncProfile])

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
            // Credential belongs to an existing account — sign out anonymous then sign in normally.
            // Set flag so onAuthStateChanged doesn't re-create an anonymous session during the gap.
            skipAnonymousSignIn = true;
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
            skipAnonymousSignIn = true;
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
      const currentUser = auth.currentUser;
      if (currentUser?.isAnonymous) {
        // Upgrade anonymous session → real account (preserves anonymous data)
        const credential = EmailAuthProvider.credential(email, password);
        try {
          const { user } = await linkWithCredential(currentUser, credential);
          await sendEmailVerification(user);
        } catch (err) {
          const authErr = err as AuthError;
          if (authErr.code === 'auth/email-already-in-use') {
            // Email belongs to an existing account — sign out anonymous and
            // create a new account normally; the user should sign in instead.
            throw new Error('An account with this email already exists. Please sign in.')
          }
          throw err;
        }
      } else {
        const { user } = await createUserWithEmailAndPassword(auth, email, password)
        await sendEmailVerification(user)
      }
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
      skipAnonymousSignIn = true
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

export function useUpdatePassword() {
  return useMutation({
    mutationFn: async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => {
      const user = auth.currentUser
      if (!user || !user.email) throw new Error('No authenticated user')
      const credential = EmailAuthProvider.credential(user.email, currentPassword)
      await reauthenticateWithCredential(user, credential)
      await updatePassword(user, newPassword)
    },
    onSuccess: () => {
      toast.success('Password updated successfully')
    },
    onError: (error) => {
      toast.fromError(error)
    },
  })
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