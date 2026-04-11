import React from 'react'
import {
  Bell,
  ChevronRight,
  HelpCircle,
  LogOut,
  QrCode,
  Shield,
  WalletCardsIcon,
} from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { SubscriptionCard } from '@/components/account/subscription/subscription-card'

interface AccountMenuItem {
  icon: React.ElementType
  label: string
  description?: string
  onClick?: () => void
  danger?: boolean
}

function MenuItem({ icon: Icon, label, description, onClick, danger }: Readonly<AccountMenuItem>) {
  return (
    <button
      onClick={onClick}
      className={[
        'group w-full flex items-center gap-3.5 px-4 py-3.5 text-left cursor-pointer',
        'transition-colors duration-150 focus:outline-none',
        danger
          ? 'hover:bg-red-50 rounded-xl'
          : 'hover:bg-[#F7F7F7] rounded-xl',
      ].join(' ')}
    >
      <span className={[
        'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-150',
        danger
          ? 'bg-red-50 group-hover:bg-red-100'
          : 'bg-[#F3F4F6] group-hover:bg-[#E9EAEC]',
      ].join(' ')}>
        <Icon className={`w-4.5 h-4.5 ${danger ? 'text-red-500' : 'text-[#555]'}`} strokeWidth={1.8} />
      </span>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold leading-tight ${danger ? 'text-red-500' : 'text-[#111]'}`}>
          {label}
        </p>
        {description && (
          <p className="text-xs text-[#aaa] mt-0.5 truncate">{description}</p>
        )}
      </div>

      {!danger && (
        <ChevronRight className="w-4 h-4 text-[#ccc] shrink-0 group-hover:text-[#888] transition-colors duration-150" />
      )}
    </button>
  )
}

interface AccountMenuProps {
  onLogout?: () => void
}

export function AccountMenu({ onLogout }: Readonly<AccountMenuProps>) {
  const navigate = useNavigate()

  const sections: Array<{ heading: string; items: Array<AccountMenuItem> }> = [
    {
      heading: 'Membership',
      items: [
        {
          icon: QrCode,
          label: 'My QR Codes',
          description: 'Digital Backtrack profile',
        },
        {
          icon: WalletCardsIcon,
          label: 'Billing',
          description: 'Manage payment methods and invoices',
          onClick: () => navigate({ to: '/account/billing' }),
        },
      ],
    },
    {
      heading: 'Settings',
      items: [
        {
          icon: Bell,
          label: 'Notifications',
          description: 'Manage alerts and updates',
        },
        {
          icon: Shield,
          label: 'Privacy & Security',
          description: 'Password, data, permissions',
        },
      ],
    },
    {
      heading: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help Center',
          description: 'FAQs and contact support',
        },
      ],
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      {/* Subscription card */}
      <SubscriptionCard />

      {/* Menu sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sections.map((section) => (
          <div
            key={section.heading}
            className="bg-white rounded-2xl border border-[#EBEBEB] px-2 py-2
                       shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
          >
            <p className="text-[10px] font-bold text-[#bbb] uppercase tracking-widest px-4 pt-2 pb-1">
              {section.heading}
            </p>
            <div className="flex flex-col">
              {section.items.map((item, i) => (
                <React.Fragment key={item.label}>
                  <MenuItem {...item} />
                  {i < section.items.length - 1 && (
                    <div className="h-px bg-[#F3F4F6] mx-4" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sign out — mobile only */}
      <div className="bg-white rounded-2xl border border-[#EBEBEB] px-2 py-2
                      shadow-[0_2px_8px_rgba(0,0,0,0.05)] lg:hidden">
        <MenuItem icon={LogOut} label="Sign Out" onClick={onLogout} danger />
      </div>
    </div>
  )
}
