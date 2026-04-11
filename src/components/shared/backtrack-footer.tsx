import { useNavigate } from '@tanstack/react-router'

const FOOTER_LINKS = [
  {
    heading: 'Product',
    items: [
      { label: 'Organizations', to: '/organizations' },
      { label: 'Pricing',       to: '/premium'       },
      { label: 'Download',      to: '/download'      },
    ],
  },
  {
    heading: 'Account',
    items: [
      { label: 'My Account', to: '/account'   },
      { label: 'Messages',   to: '/message'   },
      { label: 'Sign in',    to: '/sign-in'   },
    ],
  },
  {
    heading: 'Support',
    items: [
      { label: 'Help Center',        to: '/help'      },
      { label: 'Privacy & Security', to: '/help'      },
      { label: 'Contact us',         to: '/help'      },
    ],
  },
]

export function BacktrackFooter() {
  const navigate = useNavigate()

  return (
    <footer className="border-t border-[#EBEBEB] bg-white shrink-0">
      <div className="max-w-screen-xl mx-auto px-5 lg:px-10 py-10">

        {/* Top — logo + links */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">
          {/* Logo + tagline */}
          <div className="shrink-0">
            <button
              onClick={() => navigate({ to: '/' })}
              className="bg-transparent border-0 p-0 cursor-pointer focus:outline-none"
              aria-label="Go to homepage"
            >
              <img
                src="/backtrack-logo.svg"
                alt="Backtrack"
                className="h-6 w-auto"
                draggable={false}
              />
            </button>
            <p className="text-xs text-[#aaa] mt-2 font-medium max-w-[180px] leading-relaxed">
              Reuniting people with what matters.
            </p>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {FOOTER_LINKS.map(({ heading, items }) => (
              <div key={heading}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#aaa] mb-3">
                  {heading}
                </p>
                <ul className="space-y-2">
                  {items.map(({ label, to }) => (
                    <li key={label}>
                      <button
                        onClick={() => navigate({ to })}
                        className="text-sm text-[#555] hover:text-[#111] font-medium
                                   transition-colors duration-150 cursor-pointer text-left"
                      >
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-[#F3F4F6] flex flex-col sm:flex-row
                        items-center justify-between gap-3">
          <p className="text-xs text-[#bbb] font-medium">
            © {new Date().getFullYear()} Backtrack. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate({ to: '/help' })}
              className="text-xs text-[#bbb] hover:text-[#555] font-medium
                         transition-colors duration-150 cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate({ to: '/help' })}
              className="text-xs text-[#bbb] hover:text-[#555] font-medium
                         transition-colors duration-150 cursor-pointer"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
