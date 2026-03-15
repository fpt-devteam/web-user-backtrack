import { ScanLine, ArrowRight, Star, Shield, Zap, CheckCircle, Sparkles } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-50 rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl opacity-50 pointer-events-none" />

      <div className="relative px-5 lg:px-10 pt-10 lg:pt-20 pb-10 lg:pb-24 w-full max-w-md lg:max-w-screen-xl mx-auto">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">

          {/* ── Left: text content ── */}
          <div className="space-y-6">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold px-3.5 py-1.5 rounded-full w-fit">
              <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
              AI-Powered Lost &amp; Found
            </div>

            {/* Headline */}
            <h1 className="text-[2.6rem] lg:text-[3.75rem] font-extrabold text-gray-900 leading-[1.1] tracking-tight">
              Everything has a{' '}
              <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
                way&nbsp;back
              </span>
              .
            </h1>

            <p className="text-gray-500 text-base lg:text-lg leading-relaxed max-w-lg">
              Attach a smart QR tag to anything you value. Lost something without a tag?
              Our AI automatically matches lost &amp; found reports by description, photo,
              location, and time — so you get reunited faster.
            </p>

            {/* AI feature pill */}
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-2.5 w-fit">
              <Sparkles className="w-4 h-4 text-yellow-500 shrink-0" />
              <span>AI matches posts by <strong className="text-gray-900">description · image · location · time</strong></span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex items-center justify-center gap-2.5 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-semibold py-4 px-7 rounded-2xl transition-all duration-200 shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:shadow-lg">
                <ScanLine className="w-5 h-5" />
                Scan to Return
              </button>
              <button className="flex items-center justify-center gap-2 text-gray-700 hover:text-blue-600 font-semibold py-4 px-7 rounded-2xl border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-all duration-200">
                Get the App
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-5 pt-1">
              <div>
                <p className="text-2xl font-extrabold text-gray-900">50K+</p>
                <p className="text-xs text-gray-400 mt-0.5">Items returned</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div>
                <p className="text-2xl font-extrabold text-gray-900">120+</p>
                <p className="text-xs text-gray-400 mt-0.5">Countries</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-2xl font-extrabold text-gray-900">4.9</p>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
                <p className="text-xs text-gray-400 mt-0.5">App rating</p>
              </div>
            </div>
          </div>

          {/* ── Right: phone mockup ── */}
          <div className="mt-12 lg:mt-0 relative flex items-center justify-center">
            {/* Soft glow */}
            <div className="absolute w-72 h-72 bg-blue-300 rounded-full blur-3xl opacity-20 pointer-events-none" />

            <div className="relative z-10 w-[200px] lg:w-[240px]">
              {/* Phone shell */}
              <div className="relative bg-gray-900 rounded-[2.5rem] p-[3px] shadow-[0_40px_80px_-20px_rgba(59,130,246,0.35)]">
                <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-b from-gray-700 to-gray-900" />
                {/* Notch */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-900 rounded-b-xl z-20" />

                {/* Screen */}
                <div className="relative bg-slate-50 rounded-[2.3rem] overflow-hidden" style={{ paddingBottom: '210%' }}>
                  <div className="absolute inset-0 flex flex-col">
                    {/* Status bar gap */}
                    <div className="h-8 shrink-0" />
                    {/* App header */}
                    <div className="bg-blue-500 px-3.5 py-2.5 flex items-center justify-between shrink-0">
                      <span className="text-white text-[10px] font-bold tracking-wide">BACKTRACK</span>
                      <Shield className="w-3 h-3 text-white/80" />
                    </div>
                    {/* Content */}
                    <div className="flex-1 flex flex-col items-center px-3.5 py-4 gap-3 overflow-hidden">
                      {/* Check */}
                      <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                        <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center shadow-md shadow-green-200">
                          <CheckCircle className="w-5 h-5 text-white fill-white" />
                        </div>
                      </div>
                      <div className="text-center shrink-0">
                        <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">Item Located</p>
                        <p className="text-[11px] font-bold text-gray-900 mt-0.5">North Face Backpack</p>
                      </div>
                      {/* Owner row */}
                      <div className="w-full bg-white rounded-xl p-2 flex items-center gap-2 shadow-sm border border-gray-100 shrink-0">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shrink-0">
                          <span className="text-white text-[8px] font-bold">AJ</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[8px] text-gray-400">Owner</p>
                          <p className="text-[10px] font-bold text-gray-900 truncate">Alex Johnson</p>
                        </div>
                        <div className="ml-auto w-4 h-4 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        </div>
                      </div>
                      {/* Message button */}
                      <div className="w-full bg-blue-500 rounded-xl py-2 text-center shrink-0">
                        <span className="text-white text-[10px] font-bold">Message Owner</span>
                      </div>
                      {/* Chat bubbles */}
                      <div className="w-full space-y-1.5">
                        <div className="flex justify-start">
                          <div className="bg-gray-100 rounded-xl rounded-bl-sm px-2.5 py-1.5 max-w-[80%]">
                            <p className="text-[8px] text-gray-600">Found your bag! 🎒</p>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <div className="bg-blue-500 rounded-xl rounded-br-sm px-2.5 py-1.5 max-w-[80%]">
                            <p className="text-[8px] text-white">Thank you so much!!</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating — QR scanned */}
              <div className="absolute -right-10 top-14 lg:-right-16 bg-white rounded-2xl shadow-xl border border-gray-100 px-3 py-2.5 flex items-center gap-2 z-20 whitespace-nowrap">
                <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <Zap className="w-3.5 h-3.5 text-green-600" />
                </div>
                <div>
                  <p className="text-[9px] text-gray-400">Just now</p>
                  <p className="text-[10px] font-bold text-gray-900">QR Scanned!</p>
                </div>
              </div>

              {/* Floating — anonymous */}
              <div className="absolute -left-10 bottom-24 lg:-left-16 bg-white rounded-2xl shadow-xl border border-gray-100 px-3 py-2.5 flex items-center gap-2 z-20 whitespace-nowrap">
                <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                  <Shield className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-900">100% Private</p>
                  <p className="text-[9px] text-gray-400">No info shared</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
