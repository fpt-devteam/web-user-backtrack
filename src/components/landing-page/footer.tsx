import { Twitter, Github, Instagram } from 'lucide-react'

const NAV_LINKS = ['How it works', 'Premium', 'Download', 'Privacy', 'Terms'] as const

export function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #E8E8E4', backgroundColor: 'var(--background)' }}>
      <div className="px-5 lg:px-10 py-8 lg:py-10 w-full max-w-md lg:max-w-screen-xl mx-auto">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          {/* Logo + tagline */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              {/* Indigo logo mark */}
              <div className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#4F46E5,#6366F1)' }}>
                <div className="w-2.5 h-2.5 rounded-full bg-white" />
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
                className="text-sm text-[#777] hover:text-indigo-500 font-medium transition-colors duration-200"
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
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#aaa] transition-all duration-200"
                  style={{ border: '1px solid #E8E8E4' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#4F46E5'
                    e.currentTarget.style.borderColor = 'rgba(79,70,229,0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#aaa'
                    e.currentTarget.style.borderColor = '#E8E8E4'
                  }}
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
