import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useCheckEmailStatus, useCreateAccount, useResendVerificationEmail } from '@/hooks/use-auth'
import { EmailStatus } from '@/types/auth.type'

import { BacktrackLogo } from '@/components/shared/backtrack-logo'
import { SignUpProgress } from '@/components/sign-up/sign-up-progress'
import { StepEmail } from '@/components/sign-up/step-email'
import { StepPassword } from '@/components/sign-up/step-password'
import { StepVerifyEmail } from '@/components/sign-up/step-verify-email'
import { AccountNotVerifiedModal } from '@/components/auth-modal/account-not-verified-modal'
import { AccountExistsModal } from '@/components/auth-modal/account-exists-modal'

export const Route = createFileRoute('/sign-up/')({
  component: SignUpPage,
})

type Step = 'email' | 'password' | 'verify'
type Modal = 'notVerified' | 'exists' | null

const STEP_INDEX: Record<Step, number> = { email: 1, password: 2, verify: 3 }
const TOTAL_STEPS = 3

const STEP_LABELS: Record<Step, { heading: string; sub: string }> = {
  email: {
    heading: 'Start your journey',
    sub: 'Enter your email to create a free Backtrack account.',
  },
  password: {
    heading: 'Secure your account',
    sub: 'A strong password keeps your lost items safe.',
  },
  verify: {
    heading: 'Almost there!',
    sub: 'Check your inbox to verify your email and activate your account.',
  },
}

function SignUpPage() {
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [modal, setModal] = useState<Modal>(null)

  const checkEmail = useCheckEmailStatus()
  const createAccount = useCreateAccount()
  const resendVerificationEmail = useResendVerificationEmail()

  // ── Step handlers ────────────────────────────────────────────

  const handleEmailNext = async (emailValue: string) => {
    setEmail(emailValue)
    const result = await checkEmail.mutateAsync({ email: emailValue })

    if (result.status === EmailStatus.NotVerified) {
      setModal('notVerified')
    } else if (result.status === EmailStatus.Verified) {
      setModal('exists')
    } else {
      setStep('password')
    }
  }

  const handlePasswordNext = async (password: string) => {
    await createAccount.mutateAsync({ email, password })
    setStep('verify')
  }

  const handleBack = () => {
    if (step === 'email') navigate({ to: '/sign-in' })
    else if (step === 'password') setStep('email')
    else if (step === 'verify') setStep('password')
  }

  const handleOpenEmailApp = () => {
    globalThis.location.href = 'mailto:'
  }

  const handleResendEmail = async () => {
    await resendVerificationEmail.mutateAsync()
  }

  const handleLogIn = () => {
    setModal(null)
    navigate({ to: '/sign-in' })
  }

  const showProgress = step !== 'verify'
  const stepLabel = STEP_LABELS[step]

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">

      {/* ── Left panel – desktop only ──────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] bg-linear-to-br from-slate-800 via-blue-900 to-blue-700 flex-col justify-between px-14 py-12 shrink-0">

        {/* Logo */}
        <BacktrackLogo width={130} height={30} className="brightness-0 invert opacity-90" />

        {/* Messaging */}
        <div>
          <p className="text-blue-300 text-sm font-semibold uppercase tracking-widest mb-4">
            Step {STEP_INDEX[step]} of {TOTAL_STEPS}
          </p>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            {stepLabel.heading}
          </h2>
          <p className="text-blue-200 text-lg leading-relaxed max-w-xs">
            {stepLabel.sub}
          </p>
        </div>

        {/* Progress bar */}
        {showProgress && (
          <div className="space-y-2">
            <SignUpProgress currentStep={STEP_INDEX[step]} totalSteps={TOTAL_STEPS} />
          </div>
        )}
      </div>

      {/* ── Right panel ────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 lg:overflow-y-auto">

        {/* Header (back + mobile progress) */}
        <div className="flex items-center gap-4 px-5 py-5 lg:px-10 lg:py-6">
          <button
            type="button"
            onClick={handleBack}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          {/* Mobile only: progress bar */}
          {showProgress && (
            <div className="flex-1 lg:hidden">
              <SignUpProgress currentStep={STEP_INDEX[step]} totalSteps={TOTAL_STEPS} />
            </div>
          )}
        </div>

        {/* Form – centered on desktop */}
        <div className="flex flex-col flex-1 px-6 pt-2 pb-10 lg:flex-none lg:w-full lg:max-w-lg lg:mx-auto lg:px-10 lg:pt-6 lg:pb-16">
          {step === 'email' && (
            <StepEmail
              defaultEmail={email}
              isPending={checkEmail.isPending}
              onNext={handleEmailNext}
            />
          )}
          {step === 'password' && (
            <StepPassword
              isPending={createAccount.isPending}
              onNext={handlePasswordNext}
            />
          )}
          {step === 'verify' && (
            <StepVerifyEmail
              email={email}
              onOpenEmailApp={handleOpenEmailApp}
              onResend={handleResendEmail}
              onSignIn={() => navigate({ to: '/sign-in' })}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <AccountNotVerifiedModal
        open={modal === 'notVerified'}
        onOpenChange={(open) => !open && setModal(null)}
      />
      <AccountExistsModal
        open={modal === 'exists'}
        onOpenChange={(open) => !open && setModal(null)}
        email={email}
        onLogIn={handleLogIn}
      />
    </div>
  )
}
