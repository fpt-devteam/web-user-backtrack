import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCheckEmailStatus, useSignInWithEmailAndPassword, useSignInWithGoogle } from '@/hooks/use-auth'
import { useNavigate } from '@tanstack/react-router'
import { GoogleIcon } from '@/components/shared/google-icon'
import { EmailStatus } from '@/types/auth.type'
import { AccountNotVerifiedModal } from '@/components/auth-modal/account-not-verified-modal'
import { toast } from 'sonner'

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [notVerifiedOpen, setNotVerifiedOpen] = useState(false)

  const navigate         = useNavigate()
  const signIn           = useSignInWithEmailAndPassword()
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
      toast.error('Email not found. Please check your email or sign up.')
      return
    }
    if (emailStatus.status === EmailStatus.NotVerified) {
      setNotVerifiedOpen(true)
      return
    }
    await signIn.mutateAsync({ email, password })
    navigate({ to: '/account' })
  }

  const isPending = signIn.isPending || checkEmailStatus.isPending

  return (
    <div className="w-full">
      <AccountNotVerifiedModal open={notVerifiedOpen} onOpenChange={setNotVerifiedOpen} />

      {/* ── Header ── */}
      <div className="mb-8">
        {/* Mobile-only logo */}
        <div className="flex justify-center mb-8 lg:hidden">
          <img src="/backtrack-logo.svg" alt="Backtrack" className="h-6 w-auto" draggable={false} />
        </div>
        <h2 className="text-2xl font-black text-[#111] tracking-tight">
          Welcome back
        </h2>
        <p className="text-[15px] text-[#888] mt-1 font-medium">
          Sign in to your Backtrack account
        </p>
      </div>

      {/* ── Google button — top CTA ── */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={signInWithGoogle.isPending}
        className="w-full h-12 flex items-center justify-center gap-3 rounded-xl
                   border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB]
                   text-sm font-semibold text-[#222] transition-all duration-150
                   cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
        aria-label="Continue with Google"
      >
        {signInWithGoogle.isPending
          ? <span className="w-4 h-4 border-2 border-[#ccc] border-t-[#555] rounded-full animate-spin" />
          : <GoogleIcon />
        }
        Continue with Google
      </button>

      {/* ── Divider ── */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-[#E5E7EB]" />
        <span className="text-xs font-semibold text-[#aaa] tracking-widest uppercase">or</span>
        <div className="flex-1 h-px bg-[#E5E7EB]" />
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-bold text-[#555] uppercase tracking-widest">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bbb] pointer-events-none" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-11 h-12 rounded-xl border-[#E5E7EB] bg-[#FAFAFA] text-[15px] text-[#111]
                         placeholder:text-[#C4C4C4] focus-visible:ring-2 focus-visible:ring-brand-400
                         focus-visible:border-transparent transition-all duration-150"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs font-bold text-[#555] uppercase tracking-widest">
              Password
            </Label>
            <button
              type="button"
              className="text-xs font-semibold text-brand-500 hover:text-brand-600 transition-colors cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bbb] pointer-events-none" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-11 pr-12 h-12 rounded-xl border-[#E5E7EB] bg-[#FAFAFA] text-[15px] text-[#111]
                         placeholder:text-[#C4C4C4] focus-visible:ring-2 focus-visible:ring-brand-400
                         focus-visible:border-transparent transition-all duration-150"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#bbb] hover:text-[#555]
                         transition-colors duration-150 cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-12 rounded-xl bg-[#111] hover:bg-[#222] text-white text-sm font-bold
                     flex items-center justify-center gap-2 mt-2
                     transition-all duration-150 cursor-pointer
                     disabled:opacity-50 disabled:cursor-not-allowed
                     focus-visible:ring-2 focus-visible:ring-[#111] focus-visible:ring-offset-2"
        >
          {isPending
            ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : (
              <>
                Sign in
                <ArrowRight className="w-4 h-4" />
              </>
            )
          }
        </Button>
      </form>

      {/* ── Sign up link ── */}
      <p className="text-center text-[14px] text-[#888] mt-6">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={() => navigate({ to: '/sign-up' })}
          className="font-bold text-[#111] hover:text-brand-600 transition-colors cursor-pointer"
        >
          Sign up free
        </button>
      </p>
    </div>
  )
}
