import { UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  ResponsiveDialogRoot,
  ResponsiveDialogContent,
  ResponsiveDialogClose,
} from '@/components/shared/responsive-dialog'

interface AccountExistsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  email: string
  onLogIn?: () => void
}

export function AccountExistsModal({
  open,
  onOpenChange,
  email,
  onLogIn,
}: Readonly<AccountExistsModalProps>) {
  return (
    <ResponsiveDialogRoot open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent aria-describedby="account-exists-desc">
        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
            <UserCheck className="w-9 h-9 text-blue-500" />
          </div>
        </div>

        {/* Text */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-gray-900 leading-tight mb-3">
            Account already exists
          </h2>
          <p id="account-exists-desc" className="text-gray-500 text-base leading-relaxed">
            It looks like you've already signed up with{' '}
            <span className="font-bold text-gray-800">{email}</span>. Would you like to log in
            instead?
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1">
          <Button
            onClick={onLogIn}
            className="w-full h-14 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-base shadow-lg shadow-blue-200 active:scale-95 transition-all duration-200"
          >
            Log In
          </Button>

          <ResponsiveDialogClose asChild>
            <button
              type="button"
              className="w-full py-3 text-base font-medium text-gray-400 hover:text-gray-600 transition-colors"
            >
              Cancel
            </button>
          </ResponsiveDialogClose>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialogRoot>
  )
}
