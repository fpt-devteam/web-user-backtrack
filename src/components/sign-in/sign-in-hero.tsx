import { ShieldCheck, MapPin, Package } from 'lucide-react'

const TRUST_ITEMS = [
  { icon: ShieldCheck, text: 'Verified organisations' },
  { icon: MapPin,      text: 'Real-time drop locations' },
  { icon: Package,     text: '10 000+ items reunited' },
]

export function SignInHero() {
  return (
    <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between overflow-hidden bg-[#0c0c0c] px-16 py-14">

      {/* subtle dot-grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* brand glow blob */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-brand-500/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-64 h-64 rounded-full bg-brand-400/10 blur-[80px]" />

      {/* ── Logo wordmark ── */}
      <div className="relative z-10">
        <img src="/backtrack-logo.svg" alt="Backtrack" className="h-7 w-auto brightness-0 invert" draggable={false} />
      </div>

      {/* ── Centre copy ── */}
      <div className="relative z-10 space-y-6">
        <div className="space-y-3">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-brand-400">
            Lost & Found · Reimagined
          </p>
          <h1 className="text-4xl xl:text-5xl font-black text-white leading-[1.1] tracking-tight">
            Reunite people<br />with what matters.
          </h1>
          <p className="text-[15px] text-white/50 leading-relaxed max-w-sm">
            A trusted network connecting lost items to their owners — across verified organisations nationwide.
          </p>
        </div>

        {/* trust signals */}
        <div className="space-y-3 pt-2">
          {TRUST_ITEMS.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-brand-400" strokeWidth={2} />
              </span>
              <span className="text-sm text-white/70 font-medium">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom quote ── */}
      <div className="relative z-10 border-t border-white/10 pt-8">
        <p className="text-sm text-white/40 leading-relaxed italic max-w-xs">
          "Found my laptop bag the same day I lost it. Incredible service."
        </p>
        <p className="mt-2 text-xs text-white/30 font-semibold tracking-wide">— Nguyen T., HCMC</p>
      </div>
    </div>
  )
}
