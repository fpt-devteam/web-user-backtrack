import { useState } from 'react'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface StepEmailProps {
  defaultEmail?: string
  isPending?: boolean
  onNext: (email: string) => void
}

export function StepEmail({ defaultEmail = '', isPending, onNext }: Readonly<StepEmailProps>) {
  const [email, setEmail] = useState(defaultEmail)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(email)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-1 lg:flex-none">
      {/* Heading */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 leading-tight">
          What's your email?
        </h1>
        <p className="text-gray-500 text-base leading-relaxed">
          We'll send you a verification code to get you started.
        </p>
      </div>

      {/* Email input */}
      <div className="space-y-2">
        <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">
          Email Address
        </label>
        <Input
          type="email"
          placeholder="e.g., name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
          className="h-14 rounded-2xl border-gray-200 bg-white text-base placeholder:text-gray-300 focus-visible:ring-blue-500 focus-visible:border-blue-500"
        />
        <div className="flex items-center gap-2 pt-1">
          <Lock className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-sm text-gray-400">Your email is safe with us.</span>
        </div>
      </div>

      {/* Spacer – pushes button to bottom on mobile, collapses on desktop */}
      <div className="flex-1 lg:hidden" />
      <div className="lg:mt-10" />

      {/* Next button */}
      <Button
        type="submit"
        disabled={isPending || !email}
        className="w-full h-14 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-base shadow-lg shadow-blue-200 active:scale-95 transition-all duration-200 disabled:opacity-60"
      >
        {isPending ? 'Checking…' : 'Next'}
      </Button>
    </form>
  )
}
