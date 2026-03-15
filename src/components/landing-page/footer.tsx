import { Twitter, Github, Instagram } from 'lucide-react'

const NAV_LINKS = ['How it works', 'Premium', 'Download', 'Privacy', 'Terms'] as const

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="px-5 lg:px-10 py-8 lg:py-10 w-full max-w-md lg:max-w-screen-xl mx-auto">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          {/* Logo + tagline */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-white" />
              </div>
              <span className="text-blue-500 font-extrabold text-lg tracking-tight">Backtrack</span>
            </div>
            <p className="text-xs text-gray-400">Everything has a way back.</p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {NAV_LINKS.map((link) => (
              <button
                key={link}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200"
              >
                {link}
              </button>
            ))}
          </nav>

          {/* Social + copyright */}
          <div className="flex flex-col items-start lg:items-end gap-3">
            <div className="flex items-center gap-3">
              {[Twitter, Github, Instagram].map((Icon, i) => (
                <button
                  key={i}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-300 transition-colors duration-200"
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400">© 2026 Backtrack Inc. All rights reserved.</p>
          </div>

        </div>
      </div>
    </footer>
  )
}
