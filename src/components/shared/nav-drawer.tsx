import React, { useState } from 'react'
import {
  Building2,
  ChevronRight,
  Download,
  HelpCircle,
  Info,
  LogOut,
  Menu,
  MessageCircle,
  Sparkles,
  User,
  X,
} from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/use-auth'

// ── Types ─────────────────────────────────────────────────────

interface PrimaryMenuItem {
  icon: React.ElementType
  title: string
  subtitle: string
  onClick?: () => void
}

interface SecondaryMenuItem {
  icon: React.ElementType
  label: string
  onClick?: () => void
}

// ── Helpers ───────────────────────────────────────────────────

function getInitials(displayName?: string | null, email?: string | null): string {
  if (displayName) {
    return displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
  }
  if (email) return email[0].toUpperCase()
  return 'U'
}

// ── Sub-components ────────────────────────────────────────────

function UserSection({
  displayName,
  email,
  role,
}: {
  displayName?: string | null
  email?: string | null
  role: string
}) {
  const name     = displayName ?? email ?? 'User'
  const initials = getInitials(displayName, email)

  return (
    <div className="flex items-center gap-3 px-4 py-4">
      <div className="relative shrink-0">
        <Avatar className="w-11 h-11 border border-[#E5E7EB]">
          <AvatarImage src={undefined} alt={name} />
          <AvatarFallback className="bg-[#222] text-white font-bold text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-white" />
      </div>
      <div>
        <p className="font-bold text-[#111] text-[15px] leading-tight">
          Hi, {displayName ?? 'there'}!
        </p>
        <p className="text-xs text-[#888] mt-0.5">{role}</p>
      </div>
    </div>
  )
}

function PrimaryItem({ icon: Icon, title, subtitle, onClick }: Readonly<PrimaryMenuItem>) {
  return (
    <button
      onClick={onClick}
      className="group w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl text-left
                 hover:bg-[#F7F7F7] transition-colors duration-150 cursor-pointer"
    >
      <span className="w-10 h-10 rounded-xl bg-[#F3F4F6] group-hover:bg-[#E9EAEC]
                       flex items-center justify-center shrink-0 transition-colors duration-150">
        <Icon className="w-5 h-5 text-[#555]" strokeWidth={1.8} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold text-[#111] leading-tight">{title}</p>
        <p className="text-xs text-[#aaa] mt-0.5 truncate">{subtitle}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-[#ccc] shrink-0 group-hover:text-[#888] transition-colors duration-150" />
    </button>
  )
}

function SecondaryItem({ icon: Icon, label, onClick }: Readonly<SecondaryMenuItem>) {
  return (
    <button
      onClick={onClick}
      className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
                 hover:bg-[#F7F7F7] transition-colors duration-150 cursor-pointer"
    >
      <span className="w-8 h-8 rounded-full border border-[#E5E7EB] bg-[#F9FAFB]
                       flex items-center justify-center shrink-0 transition-colors duration-150">
        <Icon className="w-4 h-4 text-[#555]" strokeWidth={1.8} />
      </span>
      <span className="flex-1 text-[14px] font-medium text-[#333]">{label}</span>
      <ChevronRight className="w-4 h-4 text-[#ccc] shrink-0 group-hover:text-[#888] transition-colors duration-150" />
    </button>
  )
}

// ── NavDrawer ─────────────────────────────────────────────────

export function NavDrawer() {
  const navigate  = useNavigate()
  const [open, setOpen] = useState(false)
  const { profile, logout } = useAuth()

  const isSignedIn = profile !== null

  const go = (to: string) => { setOpen(false); navigate({ to }) }

  const handleLogout = async () => {
    setOpen(false)
    await logout()
    navigate({ to: '/' })
  }

  const primaryItems: Array<PrimaryMenuItem> = isSignedIn
    ? [
        { icon: User,          title: 'My Account',        subtitle: 'View and edit your profile',    onClick: () => go('/account')       },
        { icon: MessageCircle, title: 'Messages',          subtitle: 'View your conversations',       onClick: () => go('/message')       },
        { icon: Building2,     title: 'Organizations',     subtitle: 'Manage your organizations',     onClick: () => go('/organizations') },
        { icon: Sparkles,      title: 'Backtrack Premium', subtitle: 'Upgrade for more features',     onClick: () => go('/premium')       },
        { icon: Download,      title: 'Download App',      subtitle: 'Get the full mobile experience'                                    },
      ]
    : [
        { icon: User,          title: 'Sign In / Sign Up',  subtitle: 'Manage your account',           onClick: () => go('/sign-in')       },
        { icon: MessageCircle, title: 'Messages',           subtitle: 'View your conversations',       onClick: () => go('/message')       },
        { icon: Building2,     title: 'Organizations',      subtitle: 'Manage your organizations',     onClick: () => go('/organizations') },
        { icon: Sparkles,      title: 'Backtrack Premium',  subtitle: 'Upgrade for more features',     onClick: () => go('/premium')       },
        { icon: Download,      title: 'Download App',       subtitle: 'Get the full mobile experience'                                    },
      ]

  const secondaryItems: Array<SecondaryMenuItem> = [
    { icon: Info,       label: 'How it Works' },
    { icon: HelpCircle, label: 'Help Center',  onClick: () => go('/help') },
  ]

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
        className="w-[85%] sm:max-w-sm p-0 flex flex-col gap-0 bg-white"
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">Main navigation drawer</SheetDescription>

        {/* Close button */}
        <SheetClose asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close menu"
            className="absolute top-4 right-4 z-10 rounded-xl text-[#aaa] hover:text-[#333] hover:bg-[#F3F4F6]"
          >
            <X className="w-5 h-5" />
          </Button>
        </SheetClose>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto pt-12 px-4 pb-4 flex flex-col gap-0.5">

          {/* User info */}
          {isSignedIn && (
            <>
              <UserSection
                displayName={profile.displayName}
                email={profile.email}
                role={profile.globalRole === 'PlatformSuperAdmin' ? 'Admin' : 'Standard Member'}
              />
              <div className="h-px bg-[#F3F4F6] mx-3 mb-2" />
            </>
          )}

          {/* Primary items */}
          {primaryItems.map((item) => (
            <PrimaryItem key={item.title} {...item} />
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 pb-6">
          <div className="h-px bg-[#F3F4F6] mb-3" />

          <div className="flex flex-col gap-0.5">
            {secondaryItems.map((item) => (
              <SecondaryItem key={item.label} {...item} />
            ))}

            {isSignedIn && (
              <button
                onClick={handleLogout}
                className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
                           hover:bg-red-50 transition-colors duration-150 cursor-pointer mt-1"
              >
                <span className="w-8 h-8 rounded-full bg-red-50 group-hover:bg-red-100
                                 flex items-center justify-center shrink-0 transition-colors duration-150">
                  <LogOut className="w-4 h-4 text-red-400" strokeWidth={1.8} />
                </span>
                <span className="text-[14px] font-medium text-red-400 group-hover:text-red-500">Sign out</span>
              </button>
            )}
          </div>

          <p className="text-center text-xs text-[#ccc] mt-5">Backtrack App v1.0.0</p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
