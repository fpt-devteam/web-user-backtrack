const FOOTER_LINKS = ['How it works', 'Privacy', 'Terms'] as const

export function Footer() {
  return (
    <footer className="py-8 px-5 lg:px-10 w-full max-w-md lg:max-w-screen-xl mx-auto">

      {/* Mobile: centered column */}
      <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
          </div>
          <span className="text-blue-500 font-bold text-lg">Backtrack</span>
        </div>

        {/* Nav links */}
        <nav className="flex items-center gap-6">
          {FOOTER_LINKS.map((link) => (
            <button
              key={link}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              {link}
            </button>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-xs text-gray-400">© 2023 Backtrack Inc. All rights reserved.</p>

      </div>
    </footer>
  )
}
