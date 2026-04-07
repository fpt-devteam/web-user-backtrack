import { QrCode, Printer, Bell, Globe, Shield } from 'lucide-react'

interface FeatureCardProps {
  icon: React.ElementType
  label: string
  desc: string
}

const FEATURES: FeatureCardProps[] = [
  { icon: Printer, label: 'Unlimited Print', desc: 'Print as many QR tags as you need, forever free.' },
  { icon: Bell,    label: 'Instant Alerts',  desc: 'Real-time push & SMS when your tag is scanned.' },
  { icon: Globe,   label: 'Works Worldwide', desc: 'Recognised and scannable in 120+ countries.' },
  { icon: Shield,  label: 'Stay Private',    desc: 'Your contact info is never exposed to finders.' },
]

function FeatureCard({ icon: Icon, label, desc }: FeatureCardProps) {
  return (
    <div className="bg-white/12 hover:bg-white/18 border border-white/20 rounded-[1.5rem] p-4 transition-all duration-200 cursor-default backdrop-blur-sm">
      <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center mb-3">
        <Icon className="w-4 h-4 text-white" />
      </div>
      <p className="text-white text-sm font-bold mb-1">{label}</p>
      <p className="text-white/70 text-xs leading-relaxed font-medium">{desc}</p>
    </div>
  )
}

export function CTASection() {
  return (
    <section className="w-full" style={{ backgroundColor: 'var(--background)' }}>
      <div className="px-5 lg:px-10 py-14 lg:py-20 w-full max-w-md lg:max-w-screen-xl mx-auto">

        {/* Rose gradient card */}
        <div className="relative overflow-hidden rounded-[2rem] p-7 lg:p-12"
          style={{
            background: 'var(--brand-600)',
            boxShadow: '0 24px 64px -12px color-mix(in srgb, var(--brand-600) 45%, transparent), 0 4px 24px rgba(0,0,0,0.12)',
          }}>

          {/* Bright rose bloom — top left */}
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 65%)' }} />

          {/* Warm amber glow — bottom right */}
          <div className="absolute -bottom-20 -right-16 w-72 h-72 rounded-full blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, oklch(0.900 0.180 40 / 0.25) 0%, transparent 65%)' }} />

          {/* Violet depth — top right */}
          <div className="absolute -top-10 right-1/3 w-64 h-64 rounded-full blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle, oklch(0.550 0.200 310 / 0.20) 0%, transparent 65%)' }} />

          {/* Fine dot grid overlay */}
          <div className="absolute inset-0 rounded-[2rem] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
              opacity: 0.5,
            }} />

          <div className="relative z-10 lg:flex lg:items-center lg:gap-14">

            {/* Left: text + QR badge */}
            <div className="lg:flex-1">
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white/90 text-xs font-bold px-4 py-2 rounded-full mb-5 uppercase tracking-wider backdrop-blur-sm">
                <QrCode className="w-3.5 h-3.5 text-white" />
                Your Item's Digital Identity
              </div>
              <h2 className="text-2xl lg:text-5xl font-black text-white mb-3 leading-tight tracking-tighter drop-shadow-sm">
                One scan.<br className="hidden lg:block" />
                Instant connection.
              </h2>
              <p className="text-white/70 text-sm lg:text-base leading-relaxed mb-7 max-w-md font-medium">
                Attach a smart QR tag to everything you value. Get notified the moment
                it's found — anywhere in the world.
              </p>

              {/* Mini QR tag preview */}
              <div className="inline-flex items-center gap-4 bg-white/12 backdrop-blur-sm border border-white/20 rounded-[1.5rem] px-5 py-3.5">
                {/* QR grid */}
                <div className="w-11 h-11 bg-white rounded-xl p-1.5 shrink-0 shadow-sm">
                  <div className="w-full h-full grid grid-cols-5 gap-[1px]">
                    {[1,1,1,1,1, 1,0,0,0,1, 1,0,1,0,1, 1,0,0,0,1, 1,1,1,1,1].map((v, i) => (
                      <div key={i} className={`rounded-[1px] ${v ? 'bg-[#111]' : 'bg-transparent'}`} />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-white text-sm font-black tracking-wide">BTK-4K9RZE</p>
                  <p className="text-white/55 text-xs mt-0.5 font-medium">Linked · Active</p>
                </div>
                <div className="ml-2 flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300" />
                  </span>
                </div>
              </div>
            </div>

            {/* Right: feature grid */}
            <div className="mt-8 lg:mt-0 grid grid-cols-2 gap-3 lg:w-80 shrink-0">
              {FEATURES.map((feat) => (
                <FeatureCard key={feat.label} {...feat} />
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
