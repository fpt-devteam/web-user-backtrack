import { useState } from 'react'
import { Eye, EyeOff, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight } from 'lucide-react'

interface PasswordRule {
  label: string
  test: (pw: string) => boolean
}

const RULES: PasswordRule[] = [
  { label: 'Minimum 8 characters', test: (pw) => pw.length >= 8 },
  { label: 'At least one number', test: (pw) => /\d/.test(pw) },
  { label: 'At least one special character', test: (pw) => /[^a-zA-Z0-9]/.test(pw) },
]

interface StepPasswordProps {
  isPending?: boolean
  onNext: (password: string) => void
}

export function StepPassword({ isPending, onNext }: Readonly<StepPasswordProps>) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const ruleResults = RULES.map((rule) => rule.test(password))
  const allPassed = ruleResults.every(Boolean)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!allPassed) return
    onNext(password)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col flex-1 lg:flex-none">
      {/* Heading */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-foreground mb-2 leading-tight">
          Create a password
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          Ensure your account is secure with a strong password.
        </p>
      </div>

      {/* Password input */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-foreground">Password</label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="h-14 pr-12 rounded-2xl border-border bg-background text-base placeholder:text-muted-foreground/50 focus-visible:ring-brand-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Validation rules */}
        <div className="flex flex-col gap-3 pt-1">
          {RULES.map((rule, i) => {
            const passed = ruleResults[i]
            return (
              <div key={rule.label} className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
                    passed ? 'bg-emerald-100' : 'bg-muted border-2 border-border'
                  }`}
                >
                  {passed && <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />}
                </div>
                <span
                  className={`text-sm font-medium transition-colors duration-200 ${
                    passed ? 'text-emerald-500' : 'text-muted-foreground'
                  }`}
                >
                  {rule.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Spacer – pushes button to bottom on mobile, collapses on desktop */}
      <div className="flex-1 lg:hidden" />
      <div className="lg:mt-10" />

      {/* Next button */}
      <Button
        type="submit"
        disabled={!allPassed || isPending}
        className="w-full h-14 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-base shadow-lg shadow-brand-200 active:scale-95 transition-all duration-200 disabled:opacity-40 flex items-center justify-center gap-2"
      >
        {isPending ? 'Creating account…' : (
          <>
            Next <ArrowRight className="w-5 h-5" />
          </>
        )}
      </Button>
    </form>
  )
}
