import { Button } from '@/components/ui/button'

interface StepVerifyEmailProps {
  email: string
  onOpenEmailApp: () => void
  onResend: () => void
  onSignIn: () => void
}

function VerifyEmailIllustration() {
  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Teal rounded square background */}
      <div className="absolute inset-0 bg-teal-400/70 rounded-[3.5rem]" />

      {/* Envelope SVG centered */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 120 90"
          className="w-44 h-auto drop-shadow-lg"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Envelope body */}
          <rect x="5" y="10" width="110" height="70" rx="8" fill="#dde8ff" />
          {/* Envelope flap fold lines */}
          <path d="M5 18 L60 52 L115 18" fill="none" stroke="#b8c9f0" strokeWidth="2" />
          {/* Heart */}
          <path
            d="M60 62 C60 62 40 50 40 38 C40 31 46 27 52 29 C55 30 58 32 60 35 C62 32 65 30 68 29 C74 27 80 31 80 38 C80 50 60 62 60 62Z"
            fill="#4fa8d5"
          />
          {/* Wing left */}
          <path d="M5 18 L30 42 L5 62" fill="#c5d8f5" />
          {/* Wing right */}
          <path d="M115 18 L90 42 L115 62" fill="#c5d8f5" />
        </svg>
      </div>

      {/* Blue heart badge — top right */}
      <div className="absolute -top-3 -right-3 w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center shadow-md">
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>
    </div>
  )
}

export function StepVerifyEmail({
  email,
  onOpenEmailApp,
  onResend,
  onSignIn,
}: Readonly<StepVerifyEmailProps>) {
  return (
    <div className="flex flex-col flex-1 lg:flex-none lg:items-center">
      {/* Illustration */}
      <div className="flex-1 lg:flex-none flex items-center justify-center py-10 lg:py-12">
        <VerifyEmailIllustration />
      </div>

      {/* Text */}
      <div className="text-center px-2 mb-10 lg:max-w-sm lg:mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Verify your email</h1>
        <p className="text-gray-500 text-base leading-relaxed">
          We've sent a verification link to{' '}
          <span className="font-bold text-gray-800">{email}</span>. Please click the link to
          secure your account.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 lg:max-w-sm lg:mx-auto lg:w-full">
        <Button
          onClick={onOpenEmailApp}
          className="w-full h-14 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-base shadow-lg shadow-blue-200 active:scale-95 transition-all duration-200"
        >
          Open Email App
        </Button>
        <button
          type="button"
          onClick={onResend}
          className="w-full py-3 text-base font-bold text-gray-800 hover:text-gray-600 transition-colors"
        >
          I didn't get an email
        </button>

        <div className="flex items-center justify-center gap-1.5 pt-1">
          <span className="text-sm text-gray-400">Already verified?</span>
          <button
            type="button"
            onClick={onSignIn}
            className="text-sm font-semibold text-blue-500 hover:text-blue-600 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  )
}
