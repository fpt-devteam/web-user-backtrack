import { ScanLine } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="px-5 lg:px-10 pt-8 lg:pt-16 pb-5 lg:pb-14 w-full max-w-md lg:max-w-screen-xl mx-auto">
      <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">

        {/* Text content */}
        <div>
          <h1 className="text-[2.4rem] lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-3">
            Everything has a way back.
          </h1>
          <p className="text-gray-500 text-base lg:text-lg mb-6 lg:mb-10">
            The smart community for lost and found.
          </p>
          {/* Desktop button — inside text col */}
          <button className="hidden lg:flex w-auto items-center gap-2.5 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg">
            <ScanLine className="w-5 h-5" />
            Scan to Return
          </button>
        </div>

        {/* Hero visual */}
        <div className="mt-6 lg:mt-0 relative w-full rounded-3xl overflow-hidden h-52 lg:h-80 bg-gradient-to-br from-teal-900 via-teal-700 to-teal-600">
          <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-teal-500/30 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-teal-800/50 blur-2xl" />

          <svg
            className="absolute bottom-0 right-8 w-24 h-40 lg:w-36 lg:h-60 opacity-60"
            viewBox="0 0 96 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M48 160 Q48 100 48 80" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" />
            <path d="M48 100 Q30 80 10 85" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M48 115 Q65 95 85 100" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" />
            <ellipse cx="10" cy="82" rx="14" ry="10" fill="#16a34a" opacity="0.8" />
            <ellipse cx="85" cy="97" rx="14" ry="10" fill="#16a34a" opacity="0.8" />
            <ellipse cx="48" cy="75" rx="10" ry="14" fill="#15803d" opacity="0.9" />
          </svg>

          <div className="absolute bottom-4 left-6 w-14 h-20 lg:w-20 lg:h-32 rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm" />
        </div>

        {/* Mobile button — below visual, hidden on desktop */}
        <div className="lg:hidden mt-4">
          <button className="w-full flex items-center justify-center gap-2.5 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg">
            <ScanLine className="w-5 h-5" />
            Scan to Return
          </button>
        </div>

      </div>
    </section>
  )
}
