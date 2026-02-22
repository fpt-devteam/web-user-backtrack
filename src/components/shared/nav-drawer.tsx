import React, { useState } from 'react'
import { User, Star, QrCode, Download, Info, HelpCircle, ChevronRight, Menu, X } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────

interface PrimaryMenuItem {
  icon: React.ElementType
  title: string
  subtitle: string
  onClick?: () => void
  highlighted?: boolean
}

interface SecondaryMenuItem {
  icon: React.ElementType
  label: string
}

// ── Constants ─────────────────────────────────────────────────

const GUEST_PRIMARY_ITEMS: PrimaryMenuItem[] = [
  {
    icon: User,
    title: 'Sign In / Sign Up',
    subtitle: 'Manage your account',
  },
  {
    icon: Star,
    title: 'Backtrack Premium',
    subtitle: 'Upgrade for more features',
  },
  {
    icon: QrCode,
    title: 'Scan QR',
    subtitle: 'Quick connect devices',
  },
  {
    icon: Download,
    title: 'Download App',
    subtitle: 'Get the full mobile experience',
  },
]

const SIGNED_IN_PRIMARY_ITEMS: PrimaryMenuItem[] = [
  {
    icon: User,
    title: 'My Account',
    subtitle: 'View and edit your profile',
    highlighted: true,
  },
  {
    icon: Star,
    title: 'Backtrack Premium',
    subtitle: 'Upgrade for more features',
  },
  {
    icon: QrCode,
    title: 'Scan QR',
    subtitle: 'Quick connect devices',
  },
  {
    icon: Download,
    title: 'Download App',
    subtitle: 'Get the full mobile experience',
  },
]

const SECONDARY_MENU_ITEMS: SecondaryMenuItem[] = [
  { icon: Info, label: 'How it Works' },
  { icon: HelpCircle, label: 'Help Center' },
]

// ── Sub-components ────────────────────────────────────────────

function PrimaryItem({ icon: Icon, title, subtitle, onClick, highlighted }: Readonly<PrimaryMenuItem>) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group w-full flex items-center gap-4 transition-all duration-200 rounded-2xl px-4 py-3.5 text-left',
        highlighted
          ? 'bg-blue-50 hover:bg-blue-500'
          : 'hover:bg-blue-500',
      )}
    >
      <div
        className={cn(
          'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-200',
          highlighted
            ? 'bg-blue-100 group-hover:bg-white/20'
            : 'bg-gray-100 group-hover:bg-white/20',
        )}
      >
        <Icon
          className={cn(
            'w-6 h-6 transition-colors duration-200 group-hover:text-white',
            highlighted ? 'text-blue-500' : 'text-gray-600',
          )}
        />
      </div>
      <div>
        <p
          className={cn(
            'font-bold text-base leading-tight transition-colors duration-200 group-hover:text-white',
            highlighted ? 'text-blue-600' : 'text-gray-900',
          )}
        >
          {title}
        </p>
        <p className="text-sm mt-0.5 text-gray-500 group-hover:text-blue-100 transition-colors duration-200">
          {subtitle}
        </p>
      </div>
    </button>
  )
}

function SecondaryItem({ icon: Icon, label }: Readonly<SecondaryMenuItem>) {
  return (
    <button className="group w-full flex items-center gap-3 hover:bg-blue-500 transition-all duration-200 rounded-xl px-2 py-3 text-left">
      <div className="w-8 h-8 rounded-full border border-gray-200 bg-gray-50 group-hover:bg-white/20 group-hover:border-white/20 flex items-center justify-center shrink-0 transition-colors duration-200">
        <Icon className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors duration-200" />
      </div>
      <span className="flex-1 text-gray-800 group-hover:text-white font-medium text-base transition-colors duration-200">
        {label}
      </span>
      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white/70 transition-colors duration-200" />
    </button>
  )
}

function getInitials(displayName?: string | null, email?: string | null): string {
  if (displayName) {
    return displayName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  if (email) return email[0].toUpperCase()
  return 'U'
}

interface UserSectionProps {
  displayName?: string | null
  email?: string | null
  role: string
}

function UserSection({ displayName, email, role }: Readonly<UserSectionProps>) {
  const name = displayName ?? email ?? 'User'
  const initials = getInitials(displayName, email)

  return (
    <div className="flex items-center gap-3 px-4 py-4 mb-1">
      <div className="relative shrink-0">
        <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
          <AvatarImage src={undefined} alt={name} />
          <AvatarFallback className="bg-blue-100 text-blue-600 font-bold text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-white" />
      </div>
      <div>
        <p className="font-bold text-gray-900 text-base leading-tight">
          Hi, {displayName ?? 'there'}!
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{role}</p>
      </div>
    </div>
  )
}

// ── NavDrawer ─────────────────────────────────────────────────

export function NavDrawer() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const { profile } = useAuth()

  const isSignedIn = profile !== null

  const handleSignIn = () => {
    setOpen(false)
    navigate({ to: '/sign-in' })
  }

  const handleMyAccount = () => {
    setOpen(false)
    navigate({ to: '/account' })
  }

  const primaryItems = isSignedIn ? SIGNED_IN_PRIMARY_ITEMS : GUEST_PRIMARY_ITEMS

  const getClickHandler = (title: string) => {
    if (title === 'Sign In / Sign Up') return handleSignIn
    if (title === 'My Account') return handleMyAccount
    return undefined
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu" className="rounded-xl">
          <Menu className="w-5 h-5 text-gray-700" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-[85%] sm:max-w-sm p-0 flex flex-col gap-0"
      >
        {/* Close button */}
        <SheetClose asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close menu"
            className="absolute top-4 right-4 z-10 rounded-xl text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </Button>
        </SheetClose>

        {/* Primary menu */}
        <div className="flex-1 overflow-y-auto pt-12 px-5 pb-4 flex flex-col gap-1">
          {isSignedIn && (
            <UserSection
              displayName={profile.displayName}
              email={profile.email}
              role={profile.globalRole === 'PlatformSuperAdmin' ? 'Admin' : 'Standard Member'}
            />
          )}

          {primaryItems.map((item) => (
            <PrimaryItem
              key={item.title}
              {...item}
              onClick={getClickHandler(item.title)}
            />
          ))}
        </div>

        {/* Secondary menu + footer */}
        <div className="px-5 pb-6">
          <Separator className="mb-4" />
          <div className="flex flex-col gap-0.5">
            {SECONDARY_MENU_ITEMS.map((item) => (
              <SecondaryItem key={item.label} {...item} />
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">Backtrack App v1.0.0</p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
