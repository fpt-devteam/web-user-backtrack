import { useState, useEffect } from 'react'
import { ScanLine, ArrowRight, Star, Sparkles, Zap, Shield } from 'lucide-react'

function Bag({ teal }: { teal?: boolean }) {
  const base = teal ? '#22D3EE' : '#f472b6'
  const mid  = teal ? '#06B6D4' : '#ec4899'
  const dark = teal ? '#0891B2' : '#db2777'
  return (
    <svg width="56" height="66" viewBox="0 0 56 66" fill="none">
      <path d="M21 12 Q21 5 28 5 Q35 5 35 12" stroke={dark} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <rect x="8" y="18" width="4" height="22" rx="2" fill={dark} opacity=".55"/>
      <rect x="10" y="12" width="36" height="44" rx="11" fill={base}/>
      <rect x="10" y="12" width="36" height="44" rx="11" fill="url(#shineGrad)"/>
      <rect x="15" y="38" width="26" height="14" rx="7" fill={mid} opacity=".55"/>
      <line x1="17" y1="38" x2="39" y2="38" stroke="#fcd34d" strokeWidth="1.5" strokeLinecap="round"/>
      <ellipse cx="19" cy="22" rx="3" ry="7" fill="white" opacity=".22" transform="rotate(-10 19 22)"/>
      <defs>
        <linearGradient id="shineGrad" x1="10" y1="12" x2="46" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity=".18"/>
          <stop offset="1" stopColor="black" stopOpacity=".10"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

function Portal() {
  return (
    <div style={{ position: 'relative', width: 54, height: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1.5px solid rgba(6,182,212,.35)', animation: 'spinCCW 8s linear infinite' }} />
      <div style={{ position: 'absolute', inset: 8, borderRadius: '50%', border: '1.5px dashed rgba(6,182,212,.55)', animation: 'spinCW 5s linear infinite' }} />
      {[0, 0.7].map((delay) => (
        <div key={delay} style={{ position: 'absolute', inset: 14, borderRadius: '50%', border: '1.5px solid rgba(6,182,212,.6)', animation: `pulseRing 2s ease-out ${delay}s infinite` }} />
      ))}
      <div style={{ width: 14, height: 14, borderRadius: '50%', zIndex: 1, background: 'linear-gradient(135deg,#2dd4bf,#0891B2)', boxShadow: '0 0 10px rgba(6,182,212,.7)' }} />
    </div>
  )
}

export function HeroSection() {
  const [on, setOn] = useState(false)
  useEffect(() => { const t = setTimeout(() => setOn(true), 300); return () => clearTimeout(t) }, [])

  const bars = [
    { label: 'Color',    val: 'Pink',       pct: 0.70, color: '#f472b6' },
    { label: 'Shape',    val: 'Backpack',   pct: 0.55, color: '#a78bfa' },
    { label: 'Brand',    val: 'North Face', pct: 0.60, color: '#38bdf8' },
    { label: 'Distance', val: '0.3 km',     pct: 0.28, color: '#2dd4bf' },
  ]

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
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle,oklch(0.609 0.126 221.7 / 0.07) 0%,transparent 70%)' }} />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle,oklch(0.520 0.105 223.1 / 0.05) 0%,transparent 70%)' }} />
      <div className="relative px-5 lg:px-10 pt-12 lg:pt-24 pb-12 lg:pb-28 w-full max-w-md lg:max-w-screen-xl mx-auto">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">

          {/* ── Left: text content ── */}
          <div className="space-y-7">

            {/* Badge — refined, dark-toned */}
            <div className="inline-flex items-center gap-2 bg-brand-600/6 border border-brand-600/15 text-[#444] text-xs font-semibold px-4 py-2 rounded-full w-fit tracking-widest uppercase">
              <Sparkles className="w-3 h-3 text-brand-400" />
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
                  backgroundImage: 'linear-gradient(135deg,var(--brand-400) 0%,var(--brand-600) 50%,var(--brand-500) 100%)',
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

            {/* AI feature pill — neutral tones
            <div className="flex items-center gap-2 text-sm text-[#555] bg-white border border-brand-200 rounded-full px-5 py-3 w-fit font-medium shadow-sm">
              <Sparkles className="w-4 h-4 text-brand-600 shrink-0" />
              <span>AI matches by <strong className="text-[#111] font-bold">description · image · location · time</strong></span>
            </div> */}

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
          <div className="mt-14 lg:mt-0 flex items-center justify-center relative">
            <div style={{
              animation: 'float 6s ease-in-out infinite',
              position: 'relative', width: 280, height: 580,
              borderRadius: 40,
              background: 'linear-gradient(170deg,#1e2d3d 0%,#0f1e2b 100%)',
              boxShadow: '0 0 0 1px rgba(255,255,255,.10), 0 0 0 2px rgba(0,0,0,.35), 0 2px 0 3px rgba(255,255,255,.06), 0 8px 32px rgba(0,0,0,.45), 0 32px 64px rgba(0,0,0,.30)',
            }}>
              {/* Side buttons left */}
              {[100, 140].map(y => (
                <div key={y} style={{ position: 'absolute', left: -3, top: y, width: 3, height: 28, borderRadius: '2px 0 0 2px', background: 'linear-gradient(180deg,#2a3d50,#1a2d3d)', boxShadow: '-1px 0 3px rgba(0,0,0,.5)' }} />
              ))}
              {/* Side button right */}
              <div style={{ position: 'absolute', right: -3, top: 120, width: 3, height: 44, borderRadius: '0 2px 2px 0', background: 'linear-gradient(180deg,#2a3d50,#1a2d3d)', boxShadow: '1px 0 3px rgba(0,0,0,.5)' }} />
              {/* Dynamic island */}
              <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 90, height: 26, borderRadius: 13, background: '#080e14', boxShadow: 'inset 0 1px 3px rgba(0,0,0,.8), 0 0 0 1px rgba(255,255,255,.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, zIndex: 20 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0d1a24', border: '1.5px solid #1a2d3d' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#0d1a24', border: '2px solid #1a2d3d', boxShadow: 'inset 0 0 4px rgba(0,0,0,.9), 0 0 0 1px rgba(255,255,255,.04)' }} />
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#06B6D4', opacity: 0.7 }} />
              </div>

              {/* Screen */}
              <div style={{ position: 'absolute', top: 6, bottom: 6, left: 6, right: 6, borderRadius: 34, overflow: 'hidden', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
                {/* Status bar */}
                <div style={{ height: 44, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 20px 6px', background: '#0f2a35', flexShrink: 0 }}>
                  <span style={{ color: 'white', fontSize: 11, fontWeight: 600, letterSpacing: 0.3 }}>9:41</span>
                  <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                    <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                      {[0, 3, 6, 9, 12].map((x, i) => <rect key={x} x={x} y={10 - (i + 1) * 2} width="2.2" height={(i + 1) * 2} rx=".8" fill={i < 4 ? 'white' : 'rgba(255,255,255,.3)'} />)}
                    </svg>
                    <div style={{ position: 'relative', width: 20, height: 10 }}>
                      <div style={{ position: 'absolute', inset: 0, border: '1.2px solid rgba(255,255,255,.7)', borderRadius: 2.5 }} />
                      <div style={{ position: 'absolute', top: 2, left: 2, bottom: 2, right: 5, background: '#4ade80', borderRadius: 1.2 }} />
                    </div>
                  </div>
                </div>

                {/* App header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 18px 8px', background: '#0f2a35', borderBottom: '1px solid rgba(255,255,255,.07)', flexShrink: 0 }}>
                  <span style={{ color: 'white', fontWeight: 800, fontSize: 13, letterSpacing: 3 }}>BACKTRACK</span>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" fill="rgba(255,255,255,.7)"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="rgba(255,255,255,.7)"/></svg>
                  </div>
                </div>

                {/* Match area */}
                <div style={{ background: 'linear-gradient(170deg,#ecfeff 0%,#f8fafc 100%)', padding: '14px 16px 10px', position: 'relative', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, animation: on ? 'floatA 3.2s ease-in-out infinite' : 'none' }}>
                      <div style={{ background: 'white', borderRadius: 16, padding: '10px 10px 6px', boxShadow: '0 4px 16px rgba(0,0,0,.08), 0 0 0 1px rgba(0,0,0,.04)' }}>
                        <Bag />
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 8, fontWeight: 700, color: '#374151' }}>North Face</div>
                        <div style={{ fontSize: 7, color: '#9ca3af' }}>Bến Thành, HCMC</div>
                      </div>
                    </div>
                    <Portal />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, animation: on ? 'floatB 3.8s ease-in-out infinite' : 'none' }}>
                      <div style={{ background: 'white', borderRadius: 16, padding: '10px 10px 6px', boxShadow: '0 4px 16px rgba(0,0,0,.08), 0 0 0 1px rgba(0,0,0,.04)', position: 'relative' }}>
                        <Bag teal />
                        <div style={{ position: 'absolute', top: -5, right: -5, width: 16, height: 16, borderRadius: '50%', background: '#06B6D4', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="8" height="8" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 8, fontWeight: 700, color: '#374151' }}>North Face</div>
                        <div style={{ fontSize: 7, color: '#9ca3af' }}>East Gate, HCMC</div>
                      </div>
                    </div>
                  </div>
                  {/* AI Match badge */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg,#06B6D4,#0891B2)', borderRadius: 20, padding: '6px 14px', boxShadow: '0 4px 14px rgba(6,182,212,.4)', animation: on ? 'popIn .55s cubic-bezier(.34,1.56,.64,1) .55s both' : 'none' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,.6)' }} />
                      <span style={{ color: 'white', fontWeight: 700, fontSize: 11 }}>+ AI Match  97%</span>
                      <div style={{ background: 'rgba(255,255,255,.2)', borderRadius: 8, padding: '1px 5px', fontSize: 7, color: 'white', fontWeight: 600, letterSpacing: 0.5 }}>AI core</div>
                    </div>
                  </div>
                </div>

                {/* Analysis panel */}
                <div style={{ background: 'white', borderTop: '1px solid #f1f5f9', padding: '12px 18px', flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 3, height: 14, borderRadius: 2, background: '#06B6D4' }} />
                      <span style={{ fontSize: 9.5, fontWeight: 700, color: '#374151', letterSpacing: 0.5 }}>Deep Analysis</span>
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {['#06B6D4', '#a78bfa', '#f472b6'].map(c => <div key={c} style={{ width: 5, height: 5, borderRadius: '50%', background: c }} />)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {bars.map((b, i) => (
                      <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 8, animation: on ? `slideUp .4s ease ${0.7 + i * 0.08}s both` : 'none' }}>
                        <span style={{ width: 46, fontSize: 8, color: '#9ca3af', fontWeight: 500, flexShrink: 0 }}>{b.label}</span>
                        <div style={{ flex: 1, height: 5, borderRadius: 3, background: '#f1f5f9', overflow: 'hidden' }}>
                          <div style={{ height: '100%', borderRadius: 3, background: `linear-gradient(90deg,${b.color}aa,${b.color})`, width: on ? `${b.pct * 100}%` : '0%', transition: `width .8s cubic-bezier(.4,0,.2,1) ${0.75 + i * 0.08}s` }} />
                        </div>
                        <span style={{ width: 52, fontSize: 8, fontWeight: 600, color: '#374151', textAlign: 'right', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.val}</span>
                      </div>
                    ))}
                  </div>
                  {/* Mini map */}
                  <div style={{ marginTop: 12, borderRadius: 12, overflow: 'hidden', height: 54, border: '1px solid #e2e8f0', position: 'relative', animation: on ? 'slideUp .4s ease 1.1s both' : 'none' }}>
                    <svg width="100%" height="54" viewBox="0 0 230 54" preserveAspectRatio="xMidYMid slice">
                      <rect width="230" height="54" fill="#ecfeff"/>
                      <line x1="0" y1="27" x2="230" y2="27" stroke="#a5f3fc" strokeWidth="6"/>
                      <line x1="115" y1="0" x2="115" y2="54" stroke="#a5f3fc" strokeWidth="4"/>
                      <rect x="10" y="5" width="45" height="18" rx="2" fill="#a5f3fc" opacity=".6"/>
                      <rect x="60" y="32" width="35" height="16" rx="2" fill="#a5f3fc" opacity=".6"/>
                      <rect x="130" y="5" width="40" height="20" rx="2" fill="#a5f3fc" opacity=".6"/>
                      <rect x="175" y="32" width="45" height="17" rx="2" fill="#a5f3fc" opacity=".6"/>
                      <circle cx="115" cy="27" r="12" fill="rgba(6,182,212,.15)"/>
                      <circle cx="115" cy="27" r="7" fill="white" stroke="#06B6D4" strokeWidth="2"/>
                      <circle cx="115" cy="27" r="3.5" fill="#06B6D4"/>
                    </svg>
                    <div style={{ position: 'absolute', bottom: 4, right: 8, fontSize: 7, fontWeight: 600, color: '#0891B2' }}>Chợ Bến Thành, HCMC</div>
                  </div>
                </div>

                {/* Contact button */}
                <div style={{ padding: '10px 14px 14px', background: 'white', borderTop: '1px solid #f1f5f9', flexShrink: 0 }}>
                  <div style={{ width: '100%', padding: '12px', borderRadius: 16, background: 'linear-gradient(135deg,#0f2a35 0%,#0E7490 100%)', color: 'white', fontWeight: 700, fontSize: 12, letterSpacing: 0.5, boxShadow: '0 4px 16px rgba(15,42,53,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.06 1.19 2 2 0 012.05 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" fill="white"/></svg>
                    Contact Owner
                  </div>
                </div>
                {/* Home bar */}
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0 8px', background: 'white', flexShrink: 0 }}>
                  <div style={{ width: 90, height: 4, borderRadius: 2, background: '#d1d5db' }} />
                </div>
              </div>

              {/* Badge: QR Scanned — sticks out right edge of phone */}
              <div
                style={{
                  position: 'absolute',
                  right: -75,
                  top: 80,
                  zIndex: 30,
                  whiteSpace: 'nowrap',
                  background: 'rgba(255,255,255,0.92)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.95)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  borderRadius: 16,
                  animation:
                    'badgeRight 0.5s cubic-bezier(0.34,1.56,0.64,1) 1.3s both,' +
                    'floatWiggle 4s ease-in-out 1.8s infinite',
                  opacity: 0,
                }}
              >
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(6,182,212,0.22),rgba(6,182,212,0.10))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Zap style={{ width: 14, height: 14, color: 'var(--brand-600)' }} />
                </div>
                <div>
                  <p style={{ fontSize: 9, color: '#999', margin: 0 }}>Just now</p>
                  <p style={{ fontSize: 10, fontWeight: 900, color: '#111', margin: 0 }}>QR Scanned!</p>
                </div>
              </div>

              {/* Badge: 100% Private — sticks out left edge of phone */}
              <div
                style={{
                  position: 'absolute',
                  left: -75,
                  bottom: 130,
                  zIndex: 30,
                  whiteSpace: 'nowrap',
                  background: 'rgba(255,255,255,0.92)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.95)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  borderRadius: 16,
                  animation:
                    'badgeLeft 0.5s cubic-bezier(0.34,1.56,0.64,1) 1.5s both,' +
                    'floatWiggle 5s ease-in-out 2.0s infinite',
                  opacity: 0,
                }}
              >
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(6,182,212,0.22),rgba(6,182,212,0.10))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Shield style={{ width: 14, height: 14, color: 'var(--brand-600)' }} />
                </div>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 900, color: '#111', margin: 0 }}>100% Private</p>
                  <p style={{ fontSize: 9, color: '#999', margin: 0 }}>No info shared</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
