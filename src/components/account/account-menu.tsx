import React from 'react'
import { Bell, Shield, HelpCircle, ChevronRight, LogOut, QrCode, WalletCardsIcon } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
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
      className="group w-full flex items-center gap-4 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors duration-150 rounded-2xl"
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-150 ${danger ? 'bg-red-50 group-hover:bg-red-100' : 'bg-gray-100 group-hover:bg-gray-200'
          }`}
      >
        <Icon className={`w-5 h-5 ${danger ? 'text-red-500' : 'text-gray-600'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm leading-tight ${danger ? 'text-red-500' : 'text-gray-900'}`}>
          {label}
        </p>
        {description && (
          <p className="text-xs text-gray-400 mt-0.5 truncate">{description}</p>
        )}
      </div>
      {!danger && <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />}
    </button>
  )
}

interface AccountMenuProps {
  onLogout?: () => void
}

export function AccountMenu({ onLogout }: Readonly<AccountMenuProps>) {
  const navigate = useNavigate()

  const sections: { heading: string; items: AccountMenuItem[] }[] = [
    {
      heading: 'Membership',
      items: [
        {
          icon: QrCode,
          label: 'My QR Codes',
          description: 'Digital backtrack profile',
        },
        {
          icon: WalletCardsIcon,
          label: 'Billing Information',
          description: 'Manage payment methods and invoices',
          onClick: () => navigate({ to: '/account/billing' }),
        }
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
      {/* Subscription status card */}
      <SubscriptionCard />

      {/* Sections – single column on mobile, 2-column grid on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sections.map((section) => (
          <div key={section.heading} className="bg-white rounded-3xl px-2 py-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-4 pt-2 pb-1">
              {section.heading}
            </p>
            <div className="flex flex-col">
              {section.items.map((item, i) => (
                <div key={item.label}>
                  <MenuItem {...item} />
                  {i < section.items.length - 1 && <Separator className="mx-4" />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sign out – mobile only (desktop shows it in the profile sidebar) */}
      <div className="bg-white rounded-3xl px-2 py-2 lg:hidden">
        <MenuItem icon={LogOut} label="Sign Out" onClick={onLogout} danger />
      </div>
    </div>
  )
}
