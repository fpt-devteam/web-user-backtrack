import { ScanLine, ArrowRight, Star, Shield, Zap, CheckCircle, Sparkles } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white bg-grid-pattern">
      {/* Very subtle gradient fade at bottom to ease into white */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />

      <div className="relative px-5 lg:px-10 pt-12 lg:pt-24 pb-12 lg:pb-28 w-full max-w-md lg:max-w-screen-xl mx-auto">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">

          {/* ── Left: text content ── */}
          <div className="space-y-7">
            {/* Badge — Moneda pill style */}
            <div className="inline-flex items-center gap-2 bg-[#00D2FE]/10 border border-[#00D2FE]/30 text-[#0099BB] text-xs font-bold px-4 py-2 rounded-full w-fit uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#00D2FE]" />
              AI-Powered Lost &amp; Found
            </div>

            {/* Headline — Moneda: huge, black, tight */}
            <h1 className="text-[2.8rem] lg:text-[5rem] font-black text-[#111111] leading-[1.0] tracking-tighter">
              Everything has a{' '}
              <span className="text-[#00D2FE]">
                way&nbsp;back
              </span>
              .
            </h1>

            <p className="text-[#555] text-base lg:text-lg leading-relaxed max-w-lg font-medium">
              Attach a smart QR tag to anything you value. Lost something without a tag?
              Our AI automatically matches lost &amp; found reports by description, photo,
              location, and time — so you get reunited faster.
            </p>

            {/* AI feature pill */}
            <div className="flex items-center gap-2 text-sm text-[#555] bg-[#f5f5f5] border border-[#e5e5e5] rounded-full px-5 py-3 w-fit font-medium">
              <Sparkles className="w-4 h-4 text-[#00D2FE] shrink-0" />
              <span>AI matches by <strong className="text-[#111] font-bold">description · image · location · time</strong></span>
            </div>

            {/* CTAs — animated, pill-shaped */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Primary — black pill, lifts + glows on hover, pulse ring */}
              <div className="relative w-fit">
                {/* Pulse ring — subtle Cyan halo behind the button */}
                <span className="absolute inset-0 rounded-full bg-[#00D2FE]/20 animate-ping motion-reduce:hidden" style={{ animationDuration: '2s' }} />
                <button
                  className={
                    'relative flex items-center justify-center gap-2.5 ' +
                    'bg-[#111111] hover:bg-[#000] text-white font-bold ' +
                    'py-4 px-8 rounded-full text-sm tracking-wide ' +
                    /* lift + shadow bloom */
                    'shadow-lg shadow-black/15 ' +
                    'hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/25 ' +
                    /* press */
                    'active:translate-y-0 active:scale-95 ' +
                    'transition-all duration-200 ease-out'
                  }
                >
                  <ScanLine className="w-5 h-5 transition-transform duration-200 group-hover:rotate-12" />
                  Scan to Return
                </button>
              </div>

              {/* Secondary — outline pill, lifts + border turns Cyan */}
              <button
                className={
                  'flex items-center justify-center gap-2 group ' +
                  'text-[#111] hover:text-[#00D2FE] font-bold ' +
                  'py-4 px-8 rounded-full text-sm tracking-wide ' +
                  'border-2 border-[#111] hover:border-[#00D2FE] hover:bg-[#00D2FE]/5 ' +
                  /* lift + soft cyan shadow */
                  'shadow-sm hover:-translate-y-1 hover:shadow-lg hover:shadow-[#00D2FE]/20 ' +
                  /* press */
                  'active:translate-y-0 active:scale-95 ' +
                  'transition-all duration-200 ease-out'
                }
              >
                Get the App
                {/* Arrow slides right on hover */}
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-6 pt-1">
              <div className="shake-on-hover cursor-default select-none">
                <p className="text-3xl font-black text-[#111]">50K+</p>
                <p className="text-xs text-[#999] mt-0.5 font-medium">Items returned</p>
              </div>
              <div className="w-px h-10 bg-[#e5e5e5]" />
              <div className="shake-on-hover cursor-default select-none">
                <p className="text-3xl font-black text-[#111]">120+</p>
                <p className="text-xs text-[#999] mt-0.5 font-medium">Countries</p>
              </div>
              <div className="w-px h-10 bg-[#e5e5e5]" />
              <div className="shake-on-hover cursor-default select-none">
                <div className="flex items-center gap-1">
                  <p className="text-3xl font-black text-[#111]">4.9</p>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
                <p className="text-xs text-[#999] mt-0.5 font-medium">App rating</p>
              </div>
            </div>
          </div>


          {/* ── Right: phone mockup ── */}
          {/* ── Right: phone mockup ── */}
          <div className="mt-14 lg:mt-0 relative flex items-center justify-center">

            {/* Cyan glow — pulse */}
            <div className="absolute w-80 h-80 bg-[#00D2FE] rounded-full blur-3xl pointer-events-none
                  animate-[glow-pulse_4s_ease-in-out_infinite]" />

            <div className="relative z-10 w-[200px] lg:w-[240px]">

              {/* Phone shell — float */}
              <div className="animate-[float_4s_ease-in-out_infinite]" style={{ transformOrigin: 'center' }}>
                <div className="relative bg-[#111] rounded-[2.5rem] p-[3px] shadow-[0_40px_80px_-20px_rgba(0,210,254,0.25)]">
                  <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-b from-[#222] to-[#111]" />
                  {/* Notch */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#111] rounded-b-xl z-20" />

                  {/* Screen */}
                  <div className="relative bg-slate-50 rounded-[2.3rem] overflow-hidden" style={{ paddingBottom: '210%' }}>
                    <div className="absolute inset-0 flex flex-col">
                      <div className="h-8 shrink-0" />

                      {/* App header */}
                      <div className="bg-[#00D2FE] px-3.5 py-2.5 flex items-center justify-between shrink-0
                            opacity-0 animate-[fadeIn_0.4s_ease_0.1s_forwards]">
                        <span className="text-[#111] text-[10px] font-black tracking-wide">BACKTRACK</span>
                        <Shield className="w-3 h-3 text-[#111]/60" />
                      </div>

                      <div className="flex-1 flex flex-col items-center px-3.5 py-4 gap-3 overflow-hidden">

                        {/* Check icon */}
                        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center shrink-0
                              opacity-0 animate-[scaleIn_0.4s_cubic-bezier(0.34,1.56,0.64,1)_0.25s_forwards]">
                          <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center shadow-md shadow-green-200">
                            <CheckCircle className="w-5 h-5 text-white fill-white" />
                          </div>
                        </div>

                        {/* Item name */}
                        <div className="text-center shrink-0
                              opacity-0 animate-[fadeSlideUp_0.5s_ease_0.4s_forwards]">
                          <p className="text-[9px] font-bold text-[#999] uppercase tracking-widest">Item Located</p>
                          <p className="text-[11px] font-black text-[#111] mt-0.5">North Face Backpack</p>
                        </div>

                        {/* Owner row */}
                        <div className="w-full bg-white rounded-xl p-2 flex items-center gap-2 shadow-sm border border-gray-100 shrink-0
                              opacity-0 animate-[fadeSlideUp_0.5s_ease_0.55s_forwards]">
                          <div className="w-7 h-7 rounded-full bg-[#00D2FE] flex items-center justify-center shrink-0">
                            <span className="text-[#111] text-[8px] font-black">AJ</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-[8px] text-[#999]">Owner</p>
                            <p className="text-[10px] font-black text-[#111] truncate">Alex Johnson</p>
                          </div>
                          <div className="ml-auto w-4 h-4 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          </div>
                        </div>

                        {/* Message button */}
                        <div className="w-full bg-[#00D2FE] rounded-xl py-2 text-center shrink-0
                              opacity-0 animate-[fadeSlideUp_0.5s_ease_0.7s_forwards]">
                          <span className="text-[#111] text-[10px] font-black">Message Owner</span>
                        </div>

                        {/* Chat bubbles */}
                        <div className="w-full space-y-1.5">
                          <div className="flex justify-start
                                opacity-0 animate-[slideInLeft_0.4s_ease_0.9s_forwards]">
                            <div className="bg-gray-100 rounded-xl rounded-bl-sm px-2.5 py-1.5 max-w-[80%]">
                              <p className="text-[8px] text-[#555]">Found your bag! 🎒</p>
                            </div>
                          </div>
                          <div className="flex justify-end
                                opacity-0 animate-[slideInRight_0.4s_ease_1.1s_forwards]">
                            <div className="bg-[#00D2FE] rounded-xl rounded-br-sm px-2.5 py-1.5 max-w-[80%]">
                              <p className="text-[8px] text-[#111] font-semibold">Thank you so much!!</p>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Float{/* Floating badge — QR Scanned */}
              <div className="absolute -right-10 top-14 lg:-right-16 bg-white rounded-2xl shadow-xl border border-[#e5e5e5]
      px-3 py-2.5 flex items-center gap-2 z-20 whitespace-nowrap
      opacity-0 animate-[badgeRight_0.5s_cubic-bezier(0.34,1.56,0.64,1)_1.3s_forwards]"
                style={{
                  animationName: 'badgeRight, wiggle',
                  animationDuration: '0.5s, 3s',
                  animationTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1), ease-in-out',
                  animationDelay: '1.3s, 1.8s',
                  animationIterationCount: '1, infinite',
                  animationFillMode: 'forwards, none',
                }}>
                <div className="w-7 h-7 bg-[#00D2FE]/15 rounded-full flex items-center justify-center shrink-0">
                  <Zap className="w-3.5 h-3.5 text-[#0099BB]" />
                </div>
                <div>
                  <p className="text-[9px] text-[#999]">Just now</p>
                  <p className="text-[10px] font-black text-[#111]">QR Scanned!</p>
                </div>
              </div>

              {/* Floating badge — 100% Private */}
              <div className="absolute -left-10 bottom-24 lg:-left-16 bg-white rounded-2xl shadow-xl border border-[#e5e5e5]
      px-3 py-2.5 flex items-center gap-2 z-20 whitespace-nowrap
      opacity-0 animate-[badgeLeft_0.5s_cubic-bezier(0.34,1.56,0.64,1)_1.5s_forwards]"
                style={{
                  animationName: 'badgeLeft, wiggle',
                  animationDuration: '0.5s, 3s',
                  animationTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1), ease-in-out',
                  animationDelay: '1.5s, 2.4s',
                  animationIterationCount: '1, infinite',
                  animationFillMode: 'forwards, none',
                }}>
                <div className="w-7 h-7 bg-[#00D2FE]/15 rounded-full flex items-center justify-center shrink-0">
                  <Shield className="w-3.5 h-3.5 text-[#0099BB]" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#111]">100% Private</p>
                  <p className="text-[9px] text-[#999]">No info shared</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section >
  )
}
