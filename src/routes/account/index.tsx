import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { HelpCircle, LogOut, QrCode, WalletCardsIcon } from 'lucide-react'
import { AboutTab } from '@/components/account/about-tab'
import { SectionCard } from '@/components/account/section-card'
import { SettingsTab } from '@/components/account/settings-tab'
import { SubscriptionCard } from '@/components/account/subscription/subscription-card'
import { useAuth } from '@/hooks/use-auth'

export const Route = createFileRoute('/account/')({
  component: AccountPage,
})

type Tab = 'about' | 'membership' | 'settings' | 'support'

function getInitials(name?: string | null, email?: string | null) {
  if (name) return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
  if (email) return email[0].toUpperCase()
  return 'U'
}

function AccountPage() {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('about')

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/' })
  }

  if (!profile) {
    navigate({ to: '/' })
    return null
  }

  const initials    = getInitials(profile.displayName, profile.email)
  const displayName = profile.displayName ?? profile.email ?? 'User'
  const isAdmin     = profile.globalRole === 'PlatformSuperAdmin'
  const roleLabel   = isAdmin ? 'Admin' : 'Member'

  const SIDEBAR_TABS: Array<{ id: Tab; label: string; initial: string }> = [
    { id: 'about',      label: 'About me',   initial: initials },
    { id: 'membership', label: 'Membership', initial: 'M'      },
    { id: 'settings',   label: 'Settings',   initial: 'S'      },
    { id: 'support',    label: 'Support',    initial: '?'      },
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-20 py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row lg:items-start">

          {/* ── LEFT SIDEBAR ── */}
          <aside className="lg:w-64 lg:shrink-0 lg:pr-10">
            <h1 className="text-[2rem] font-extrabold text-[#222] tracking-tight mb-7">
              Profile
            </h1>

            <nav className="flex flex-col gap-1">
              {SIDEBAR_TABS.map(({ id, label, initial }) => {
                const active = tab === id
                return (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    className={[
                      'flex items-center gap-3.5 w-full px-3 py-2.5 rounded-2xl text-left',
                      'transition-colors duration-150 cursor-pointer focus:outline-none',
                      active ? 'bg-[#F7F7F7]' : 'hover:bg-[#F7F7F7]',
                    ].join(' ')}
                  >
                    <span className={[
                      'w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-sm font-bold',
                      active ? 'bg-[#222] text-white' : 'bg-[#EBEBEB] text-[#555]',
                    ].join(' ')}>
                      {initial}
                    </span>
                    <span className={[
                      'text-[15px]',
                      active ? 'font-semibold text-[#111]' : 'font-medium text-[#444] hover:text-[#111]',
                    ].join(' ')}>
                      {label}
                    </span>
                  </button>
                )
              })}

              <div className="h-px bg-[#EBEBEB] my-2 mx-3" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-3.5 w-full px-3 py-2.5 rounded-2xl text-left
                           hover:bg-red-50 transition-colors duration-150 cursor-pointer group"
              >
                <span className="w-9 h-9 rounded-full bg-[#EBEBEB] group-hover:bg-red-100
                                 flex items-center justify-center shrink-0 transition-colors duration-150">
                  <LogOut className="w-4 h-4 text-[#555] group-hover:text-red-500 transition-colors" strokeWidth={1.8} />
                </span>
                <span className="text-[15px] font-medium text-[#444] group-hover:text-red-500 transition-colors">
                  Sign out
                </span>
              </button>
            </nav>
          </aside>

          {/* ── VERTICAL DIVIDER ── */}
          <div className="hidden lg:block w-px bg-[#DDDDDD] self-stretch mx-4 shrink-0" />

          {/* ── RIGHT CONTENT ── */}
          <main className="flex-1 min-w-0 mt-8 lg:mt-0 lg:pl-10">

            {tab === 'about' && (
              <AboutTab
                profile={profile}
                initials={initials}
                displayName={displayName}
                roleLabel={roleLabel}
                onGoToSettings={() => setTab('settings')}
              />
            )}

            {tab === 'membership' && (
              <section>
                <h2 className="text-[1.75rem] font-extrabold text-[#222] tracking-tight mb-8">
                  Membership
                </h2>
                <div className="flex flex-col gap-4">
                  <SubscriptionCard />
                  <SectionCard
                    items={[
                      { icon: QrCode,          label: 'My QR Codes', description: 'Digital Backtrack profile'       },
                      { icon: WalletCardsIcon, label: 'Billing',     description: 'Payment methods and invoices',
                        onClick: () => navigate({ to: '/account/billing' }) },
                    ]}
                  />
                </div>
              </section>
            )}

            {tab === 'settings' && (
              <SettingsTab profile={profile} />
            )}

            {tab === 'support' && (
              <section>
                <h2 className="text-[1.75rem] font-extrabold text-[#222] tracking-tight mb-8">
                  Support
                </h2>
                <SectionCard
                  items={[
                    { icon: HelpCircle, label: 'Help Center', description: 'FAQs and contact support',
                      onClick: () => navigate({ to: '/help' }) },
                  ]}
                />
              </section>
            )}

          </main>
        </div>
      </div>
    </div>
  )
}
