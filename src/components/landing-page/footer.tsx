import { Twitter, Github, Instagram } from 'lucide-react'

const NAV_LINKS = ['How it works', 'Premium', 'Download', 'Privacy', 'Terms'] as const

export function Footer() {
  return (
    <footer className="border-t border-[#e5e5e5] bg-white">
      <div className="px-5 lg:px-10 py-8 lg:py-10 w-full max-w-md lg:max-w-screen-xl mx-auto">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          {/* Logo + tagline */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              {/* Cyan logo mark — Moneda style geometric circle */}
              <div className="w-6 h-6 rounded-full bg-[#00D2FE] flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#111]" />
              </div>
              <span className="text-[#111] font-black text-lg tracking-tight">Backtrack</span>
            </div>
            <p className="text-xs text-[#aaa] font-medium">Everything has a way back.</p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                className="text-sm text-[#777] hover:text-[#00D2FE] font-medium transition-colors duration-200"
              >
                {link}
              </button>
            ))}
          </nav>

          {/* Social + copyright */}
          <div className="flex flex-col items-start lg:items-end gap-3">
            <div className="flex items-center gap-2.5">
              {[Twitter, Github, Instagram].map((Icon, i) => (
                <button
                  key={i}
                  className="w-8 h-8 rounded-full border border-[#e5e5e5] flex items-center justify-center text-[#aaa] hover:text-[#00D2FE] hover:border-[#00D2FE]/50 transition-all duration-200"
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
            <p className="text-xs text-[#bbb] font-medium">© 2026 Backtrack Inc. All rights reserved.</p>
          </div>

        </div>
      </div>
    </footer>
  )
}
