import { useState } from 'react'
import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCheckEmailStatus } from '@/hooks/use-auth'
import { EmailStatus } from '@/types/auth.type'
import { AccountNotVerifiedModal } from '@/components/auth-modal/account-not-verified-modal'
import { AccountExistsModal } from '@/components/auth-modal/account-exists-modal'
import { useNavigate } from '@tanstack/react-router'

export function SignUpForm() {
  const [email, setEmail] = useState('')
  const [modal, setModal] = useState<'notVerified' | 'exists' | null>(null)

  const navigate = useNavigate()
  const checkEmail = useCheckEmailStatus()

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await checkEmail.mutateAsync({ email })

    if (result.status === EmailStatus.NotVerified) {
      setModal('notVerified')
    } else if (result.status === EmailStatus.Verified) {
      setModal('exists')
    }
    // EmailStatus.NotFound → account doesn't exist, proceed normally
    // (registration flow TBD)
  }

  const handleLogIn = () => {
    setModal(null)
    navigate({ to: '/sign-in' })
  }

  return (
    <>
      <form onSubmit={handleContinue} className="space-y-5">
        <div className="space-y-2">
          <Label className="text-gray-500 font-medium text-sm">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="email"
              placeholder="hello@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-11 h-14 rounded-2xl border-gray-200 bg-gray-50 text-base placeholder:text-gray-300 focus-visible:ring-blue-400"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={checkEmail.isPending}
          className="w-full h-14 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-base shadow-lg shadow-blue-200 active:scale-95 transition-all duration-200"
        >
          {checkEmail.isPending ? 'Checking…' : 'Continue'}
        </Button>
      </form>

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
    </>
  )
}
