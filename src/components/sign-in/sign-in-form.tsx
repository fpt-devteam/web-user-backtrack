import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useCheckEmailStatus, useSignInWithEmailAndPassword, useSignInWithGoogle } from '@/hooks/use-auth'
import { useNavigate } from '@tanstack/react-router'
import { GoogleIcon } from '@/components/shared/google-icon'
import { EmailStatus } from '@/types/auth.type'
import { AccountNotVerifiedModal } from '@/components/auth-modal/account-not-verified-modal'
import { toast } from 'sonner'

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [notVerifiedOpen, setNotVerifiedOpen] = useState(false)

  const navigate = useNavigate()
  const signIn = useSignInWithEmailAndPassword()
  const signInWithGoogle = useSignInWithGoogle()
  const checkEmailStatus = useCheckEmailStatus()

  const handleGoogleSignIn = async () => {
    await signInWithGoogle.mutateAsync()
    navigate({ to: '/account' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const emailStatus = await checkEmailStatus.mutateAsync({ email })
    if (emailStatus.status === EmailStatus.NotFound) {
      toast.error('Email not found. Please check your email or sign up for a new account.')
      return
    }
    if (emailStatus.status === EmailStatus.NotVerified) {
      setNotVerifiedOpen(true)
      return
    }
    await signIn.mutateAsync({ email, password })
    navigate({ to: '/account' })
  }

  return (
    <div className="w-full">
      <AccountNotVerifiedModal
        open={notVerifiedOpen}
        onOpenChange={setNotVerifiedOpen}
      />
      <h2 className="text-2xl lg:text-3xl font-extrabold text-foreground text-center mb-8">
        Welcome back!
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div className="space-y-2">
          <Label className="text-muted-foreground font-medium text-sm">Email</Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="muhammad04@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-11 h-14 rounded-2xl border-border bg-muted/50 text-base placeholder:text-muted-foreground/50 focus-visible:ring-brand-400"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label className="text-muted-foreground font-medium text-sm">Password</Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-11 pr-12 h-14 rounded-2xl border-border bg-muted/50 text-base placeholder:text-muted-foreground/50 focus-visible:ring-brand-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Forgot password */}
        <div className="flex justify-end -mt-1">
          <button
            type="button"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Forget Password
          </button>
        </div>

        {/* Sign in button */}
        <Button
          type="submit"
          disabled={signIn.isPending || checkEmailStatus.isPending}
          className="w-full h-14 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-base shadow-lg shadow-brand-200 active:scale-95 transition-all duration-200"
        >
          {(checkEmailStatus.isPending || signIn.isPending) ? 'Signing in…' : 'Sign in'}
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-4 pt-1">
          <Separator className="flex-1" />
          <span className="text-sm text-muted-foreground whitespace-nowrap">Or continue with</span>
          <Separator className="flex-1" />
        </div>

        {/* Google button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={signInWithGoogle.isPending}
            className="w-14 h-14 rounded-full bg-background border border-border hover:bg-muted/50 hover:border-brand-200 flex items-center justify-center shadow-sm transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            aria-label="Sign in with Google"
          >
            {signInWithGoogle.isPending
              ? <span className="w-5 h-5 border-2 border-border border-t-brand-500 rounded-full animate-spin" />
              : <GoogleIcon />
            }
          </button>
        </div>

        {/* Sign up link */}
        <p className="text-center text-muted-foreground text-sm pt-1">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => navigate({ to: '/sign-up' })}
            className="text-brand-500 font-semibold hover:text-brand-600 transition-colors"
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  )
}
