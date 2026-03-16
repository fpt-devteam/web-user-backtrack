import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { SignInHero } from '@/components/sign-in/sign-in-hero'
import { SignInForm } from '@/components/sign-in/sign-in-form'

export const Route = createFileRoute('/sign-in/')({
  component: SignInPage,
})

function SignInPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Back to home – absolute on mobile, top-left corner */}
      <button
        type="button"
        onClick={() => navigate({ to: '/' })}
        aria-label="Back to home"
        className="absolute top-4 left-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4 text-gray-700" />
      </button>

      <SignInHero />
      <div
        className="
          bg-white rounded-t-[2.5rem] -mt-6 relative z-10 flex-1
          lg:mt-0 lg:rounded-none
          lg:w-1/2 lg:flex lg:items-center lg:justify-center
        "
      >
        <div className="w-full px-7 pt-10 pb-14 lg:max-w-md lg:px-0 lg:py-0">
          <SignInForm />
        </div>
      </div>

    </div>
  )
}
