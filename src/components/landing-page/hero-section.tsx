import { ScanLine, ArrowRight, Star, Shield, Zap, CheckCircle, Sparkles } from 'lucide-react'

export function HeroSection() {
  return (
    /* 1. Off-white solid background — no grid */
    <section className="relative overflow-hidden min-h-screen flex items-center"
      style={{ backgroundColor: 'var(--background)' }}>

      {/* Very subtle warm radial wash — depth without grid noise */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 70% 40%, color-mix(in oklch, var(--brand-500) 8%, transparent) 0%, transparent 70%),' +
            'radial-gradient(ellipse 60% 50% at 20% 80%, color-mix(in oklch, var(--brand-700) 6%, transparent) 0%, transparent 60%)',
        }} />

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to top, var(--background), transparent)' }} />

      <div className="relative px-5 lg:px-10 pt-12 lg:pt-24 pb-12 lg:pb-28 w-full max-w-md lg:max-w-screen-xl mx-auto">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">

          {/* ── Left: text content ── */}
          <div className="space-y-7">

            {/* Badge — refined, dark-toned */}
            <div className="inline-flex items-center gap-2 bg-brand-600/6 border border-brand-600/15 text-[#444] text-xs font-semibold px-4 py-2 rounded-full w-fit tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              AI-Powered Lost &amp; Found
            </div>

            {/* 3. Headline — elegant contrast: thin + bold + italic accent */}
            <h1 className="font-black text-[#0F0F0F] leading-[1.0] tracking-tight"
              style={{ fontSize: 'clamp(2.6rem, 5vw, 4.8rem)' }}>
              Everything has a{' '}
              <span
                className="font-black italic"
                style={{
                  /* Brand indigo → violet gradient */
                  backgroundImage: 'linear-gradient(135deg, var(--brand-600) 0%, var(--brand-500) 45%, #7C3AED 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  /* Decorative underline */
                  textDecoration: 'underline',
                  textDecorationColor: 'color-mix(in oklch, var(--brand-primary) 35%, transparent)',
                  textDecorationThickness: '3px',
                  textUnderlineOffset: '6px',
                }}
              >
                way&nbsp;back
              </span>
              .
            </h1>

            <p className="text-[#6B6B6B] text-base lg:text-lg leading-relaxed max-w-lg font-normal">
              Attach a smart QR tag to anything you value. Lost something without a tag?
              Our AI automatically matches lost &amp; found reports by description, photo,
              location, and time — so you get reunited faster.
            </p>

            {/* AI feature pill — neutral tones */}
            <div className="flex items-center gap-2 text-sm text-[#555] bg-white border border-brand-200 rounded-full px-5 py-3 w-fit font-medium shadow-sm">
              <Sparkles className="w-4 h-4 text-brand-600 shrink-0" />
              <span>AI matches by <strong className="text-[#111] font-bold">description · image · location · time</strong></span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Primary — deep indigo pill */}
              <div className="relative w-fit">
                <span className="absolute inset-0 rounded-full bg-brand-600/15 animate-ping motion-reduce:hidden" style={{ animationDuration: '2.4s' }} />
                <button
                  style={{ background: 'var(--btn-dark-gradient)' }}
                  className={
                    'relative flex items-center justify-center gap-2.5 ' +
                    'text-white font-bold ' +
                    'py-4 px-8 rounded-full text-sm tracking-wide ' +
                    'shadow-lg shadow-black/10 ' +
                    'hover:-translate-y-1 hover:shadow-xl hover:shadow-black/15 ' +
                    'active:translate-y-0 active:scale-95 ' +
                    'transition-all duration-200 ease-out'
                  }
                >
                  <ScanLine className="w-5 h-5" />
                  Scan to Return
                </button>
              </div>

              {/* Secondary — outline with brand hover */}
              <button
                className={
                  'flex items-center justify-center gap-2 group ' +
                  'text-[#111] hover:text-brand-600 font-bold ' +
                  'py-4 px-8 rounded-full text-sm tracking-wide ' +
                  'border-2 border-[#D0D0C8] hover:border-brand-600 hover:bg-brand-600/5 ' +
                  'shadow-sm hover:-translate-y-1 hover:shadow-md hover:shadow-brand-600/15 ' +
                  'active:translate-y-0 active:scale-95 ' +
                  'transition-all duration-200 ease-out'
                }
              >
                Get the App
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-6 pt-1">
              {[
                { value: '50K+', label: 'Items returned' },
                { value: '120+', label: 'Countries' },
              ].map((s) => (
                <div key={s.label} className="shake-on-hover cursor-default select-none">
                  <p className="text-3xl font-black text-[#111]">{s.value}</p>
                  <p className="text-xs text-[#999] mt-0.5 font-medium">{s.label}</p>
                </div>
              ))}
              <div className="w-px h-10 bg-[#E0E0D8]" />
              <div className="shake-on-hover cursor-default select-none">
                <div className="flex items-center gap-1">
                  <p className="text-3xl font-black text-[#111]">4.9</p>
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <p className="text-xs text-[#999] mt-0.5 font-medium">App rating</p>
              </div>
            </div>
          </div>


          {/* ── Right: phone mockup ── */}
          <div className="mt-14 lg:mt-0 relative flex items-center justify-center">

            {/* 4. Ultra-soft shadow blob — brand indigo glow */}
            <div className="absolute w-72 h-72 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, color-mix(in oklch, var(--brand-500) 16%, transparent) 0%, transparent 70%)',
                filter: 'blur(48px)',
              }} />

            <div className="relative z-10 w-[200px] lg:w-[240px]">

              {/* 5. Phone shell — Titanium-style: multi-layer metallic gradient border */}
              <div className="animate-[float_4s_ease-in-out_infinite]" style={{ transformOrigin: 'center' }}>
                <div className="relative rounded-[2.6rem] p-[3px]"
                  style={{
                    background: 'linear-gradient(160deg,#C8C9CB 0%,#8A8D91 30%,#AEAFB1 55%,#D4D5D7 80%,#9A9B9D 100%)',
                    /* 4. Soft realistic drop shadow — no cyan glow */
                    boxShadow:
                      '0 8px 20px rgba(0,0,0,0.08),' +
                      '0 24px 60px rgba(0,0,0,0.10),' +
                      '0 60px 120px rgba(0,0,0,0.06)',
                  }}>

                  {/* Inner bezel highlight */}
                  <div className="absolute inset-[3px] rounded-[2.4rem] pointer-events-none z-10"
                    style={{
                      background: 'linear-gradient(170deg,rgba(255,255,255,0.18) 0%,transparent 50%)',
                    }} />

                  {/* Notch */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#0D0D0D] rounded-b-xl z-20" />

                  {/* Screen */}
                  <div className="relative bg-[#FAFAFA] rounded-[2.3rem] overflow-hidden" style={{ paddingBottom: '210%' }}>
                    <div className="absolute inset-0 flex flex-col">
                      <div className="h-8 shrink-0" />

                      {/* App header — brand indigo dark */}
                      <div className="px-3.5 py-2.5 flex items-center justify-between shrink-0
                            opacity-0 animate-[fadeIn_0.4s_ease_0.1s_forwards]"
                        style={{ background: 'linear-gradient(90deg, var(--brand-950) 0%, var(--brand-800) 100%)' }}>
                        <span className="text-white text-[10px] font-black tracking-wider">BACKTRACK</span>
                        <Shield className="w-3 h-3 text-white/50" />
                      </div>

                      {/* ── Main content ── */}
                      <div className="flex-1 flex flex-col justify-between px-2.5 pt-2.5 pb-3 overflow-hidden">

                        {/* ── Row 1: 2 images ── */}
                        <div className="flex gap-2 shrink-0
                              opacity-0 animate-[fadeSlideUp_0.45s_ease_0.15s_forwards]">

                          {/* LOST */}
                          <div className="flex-1 flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[6px] font-black text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-full leading-tight">LOST</span>
                              <span className="text-[5.5px] text-[#aaa]">2h ago</span>
                            </div>
                            <div className="w-full rounded-xl overflow-hidden relative" style={{ aspectRatio: '1' }}>
                              <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-rose-50 to-orange-50 flex items-center justify-center">
                                <span style={{ fontSize: 30 }}>🎒</span>
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-rose-900/60 to-transparent px-1.5 py-1">
                                <p className="text-[5.5px] font-bold text-white truncate">North Face</p>
                                <p className="text-[5px] text-white/70 truncate">Bến Thành, HCM</p>
                              </div>
                            </div>
                          </div>

                          {/* VS connector */}
                          <div className="flex flex-col items-center justify-center gap-1 pt-4 shrink-0 w-7">
                            <div className="w-px flex-1 bg-gradient-to-b from-transparent via-gray-200 to-transparent" />
                            <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                              style={{ background: 'linear-gradient(135deg,#22C55E,#16A34A)', boxShadow: '0 2px 8px rgba(34,197,94,0.3)' }}>
                              <CheckCircle className="w-3.5 h-3.5 text-white fill-white" />
                            </div>
                            <div className="w-px flex-1 bg-gradient-to-b from-transparent via-gray-200 to-transparent" />
                          </div>

                          {/* FOUND */}
                          <div className="flex-1 flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[6px] font-black text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded-full leading-tight">FOUND</span>
                              <span className="text-[5.5px] text-[#aaa]">1h ago</span>
                            </div>
                            <div className="w-full rounded-xl overflow-hidden relative" style={{ aspectRatio: '1' }}>
                              <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-blue-50 to-slate-50 flex items-center justify-center">
                                <span style={{ fontSize: 30 }}>🎒</span>
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-900/60 to-transparent px-1.5 py-1">
                                <p className="text-[5.5px] font-bold text-white truncate">Black Backpack</p>
                                <p className="text-[5px] text-white/70 truncate">Exit B, Bến Thành</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* ── Row 2: Score badge ── */}
                        <div className="flex items-center justify-center gap-2 shrink-0
                              opacity-0 animate-[fadeIn_0.4s_ease_0.45s_forwards]">
                          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-green-200" />
                          <div className="rounded-full px-2.5 py-1 flex items-center gap-1"
                            style={{
                              background: 'linear-gradient(135deg,#16A34A,#22C55E)',
                              boxShadow: '0 2px 10px rgba(22,163,74,0.25)',
                            }}>
                            <span className="text-[7.5px] font-black text-white">✦ AI Match</span>
                            <span className="text-[9px] font-black text-green-100">97%</span>
                          </div>
                          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-green-200" />
                        </div>

                        {/* ── Row 3: Stats card — glassmorphism ── */}
                        <div className="rounded-2xl overflow-hidden shrink-0
                              opacity-0 animate-[fadeSlideUp_0.45s_ease_0.6s_forwards]"
                          style={{
                            background: 'rgba(255,255,255,0.80)',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255,255,255,0.9)',
                            boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                          }}>
                          {[
                            { label: 'Color', value: 'Black', pct: 98, grad: 'linear-gradient(90deg,#F43F5E,#E11D48)' },
                            { label: 'Shape', value: 'Backpack', pct: 95, grad: 'linear-gradient(90deg,#8B5CF6,#6D28D9)' },
                            { label: 'Brand', value: 'North Face', pct: 92, grad: 'linear-gradient(90deg,#3B82F6,#1D4ED8)' },
                            { label: 'Location', value: '0.3 km', pct: 88, grad: 'linear-gradient(90deg,#06B6D4,#0891B2)' },
                          ].map(({ label, value, pct, grad }, i) => (
                            <div key={label}
                              className={`flex items-center px-2.5 py-1.5 gap-2${i !== 0 ? ' border-t border-black/[0.04]' : ''}`}>
                              <p className="text-[6.5px] text-[#999] w-9 shrink-0 font-medium">{label}</p>
                              <div className="flex-1 h-[3px] bg-black/[0.06] rounded-full overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: grad }} />
                              </div>
                              <p className="text-[6.5px] font-black text-[#222] w-[38px] text-right shrink-0 truncate">{value}</p>
                            </div>
                          ))}
                        </div>

                        {/* ── Row 4: CTA button — deep navy gradient ── */}
                        <div className="w-full rounded-xl overflow-hidden shrink-0
                              opacity-0 animate-[fadeSlideUp_0.45s_ease_0.75s_forwards]">
                          <div className="py-2 flex items-center justify-center"
                            style={{ background: 'linear-gradient(90deg, var(--brand-950) 0%, var(--brand-700) 100%)' }}>
                            <span className="text-[9px] font-black text-white tracking-wide">Contact Owner</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Glassmorphism floating badge — QR Scanned */}
              <div className="absolute -right-10 top-14 lg:-right-16 rounded-2xl z-20 whitespace-nowrap
                    opacity-0 animate-[badgeRight_0.5s_cubic-bezier(0.34,1.56,0.64,1)_1.3s_forwards]"
                style={{
                  background: 'rgba(255,255,255,0.82)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.95)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  animationName: 'badgeRight, wiggle',
                  animationDuration: '0.5s, 3s',
                  animationTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1), ease-in-out',
                  animationDelay: '1.3s, 1.8s',
                  animationIterationCount: '1, infinite',
                  animationFillMode: 'forwards, none',
                } as React.CSSProperties}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(135deg, color-mix(in oklch, var(--brand-500) 20%, transparent), color-mix(in oklch, var(--brand-500) 10%, transparent))' }}>
                  <Zap className="w-3.5 h-3.5 text-brand-600" />
                </div>
                <div>
                  <p className="text-[9px] text-[#999]">Just now</p>
                  <p className="text-[10px] font-black text-[#111]">QR Scanned!</p>
                </div>
              </div>

              {/* 5. Glassmorphism floating badge — 100% Private */}
              <div className="absolute -left-10 bottom-24 lg:-left-16 rounded-2xl z-20 whitespace-nowrap
                    opacity-0 animate-[badgeLeft_0.5s_cubic-bezier(0.34,1.56,0.64,1)_1.5s_forwards]"
                style={{
                  background: 'rgba(255,255,255,0.82)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.95)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  animationName: 'badgeLeft, wiggle',
                  animationDuration: '0.5s, 3s',
                  animationTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1), ease-in-out',
                  animationDelay: '1.5s, 2.4s',
                  animationIterationCount: '1, infinite',
                  animationFillMode: 'forwards, none',
                } as React.CSSProperties}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(135deg, color-mix(in oklch, var(--brand-500) 20%, transparent), color-mix(in oklch, var(--brand-500) 10%, transparent))' }}>
                  <Shield className="w-3.5 h-3.5 text-brand-600" />
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
    </section>
  )
}
