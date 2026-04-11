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
    <div className="min-h-screen flex">
      {/* ── Back button ── */}
      <button
        type="button"
        onClick={() => navigate({ to: '/' })}
        aria-label="Back to home"
        className="absolute top-5 left-5 z-30 w-9 h-9 flex items-center justify-center
                   rounded-full bg-white border border-[#E5E7EB] shadow-sm
                   hover:bg-[#F9FAFB] transition-colors duration-150 cursor-pointer
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
      >
        <ArrowLeft className="w-4 h-4 text-[#555]" />
      </button>

      {/* ── Left: dark hero panel ── */}
      <SignInHero />

      {/* ── Right: form panel ── */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-16">
        <div className="w-full max-w-[400px]">
          <SignInForm />
        </div>
      </div>
    </div>
  )
}
