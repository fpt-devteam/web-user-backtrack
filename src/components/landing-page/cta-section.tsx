import { QrCode, Printer, Bell, Globe, Shield } from 'lucide-react'

interface FeatureCardProps {
  icon: React.ElementType
  label: string
  desc: string
}

const FEATURES: FeatureCardProps[] = [
  { icon: Printer, label: 'Unlimited Print', desc: 'Print as many QR tags as you need, forever free.' },
  { icon: Bell, label: 'Instant Alerts', desc: 'Real-time push & SMS when your tag is scanned.' },
  { icon: Globe, label: 'Works Worldwide', desc: 'Recognised and scannable in 120+ countries.' },
  { icon: Shield, label: 'Stay Private', desc: 'Your contact info is never exposed to finders.' },
]

function FeatureCard({ icon: Icon, label, desc }: FeatureCardProps) {
  return (
    <div className="bg-white/10 hover:bg-white/15 border border-white/15 rounded-[1.5rem] p-4 transition-colors duration-200 cursor-default">
      <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center mb-3">
        <Icon className="w-4 h-4 text-white" />
      </div>
      <p className="text-white text-sm font-bold mb-1">{label}</p>
      <p className="text-white/65 text-xs leading-relaxed font-medium">{desc}</p>
    </div>
  )
}

export function CTASection() {
  return (
    <section className="w-full" style={{ backgroundColor: 'var(--background)' }}>
      <div className="px-5 lg:px-10 py-14 lg:py-20 w-full max-w-md lg:max-w-screen-xl mx-auto">

        {/* Deep navy block replaces flat cyan */}
        <div className="relative overflow-hidden rounded-[2rem] p-7 lg:p-12 shadow-2xl shadow-black/15"
          style={{ background: 'linear-gradient(135deg,#0F172A 0%,#1E3A5F 60%,#1E1B4B 100%)' }}>

          {/* Subtle brand glow top-right */}
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl pointer-events-none"
            style={{ background: 'radial-gradient(circle,oklch(0.609 0.126 221.7 / 0.25) 0%,transparent 70%)' }} />

          {/* Fine noise texture overlay */}
          <div className="absolute inset-0 rounded-[2rem] pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }} />

          <div className="relative z-10 lg:flex lg:items-center lg:gap-14">

            {/* Left: text + QR badge */}
            <div className="lg:flex-1">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white/70 text-xs font-bold px-4 py-2 rounded-full mb-5 uppercase tracking-wider">
                <QrCode className="w-3.5 h-3.5 text-brand-300" />
                Your Item's Digital Identity
              </div>
              <h2 className="text-2xl lg:text-5xl font-black text-white mb-3 leading-tight tracking-tighter">
                One scan.<br className="hidden lg:block" />
                Instant connection.
              </h2>
              <p className="text-white/55 text-sm lg:text-base leading-relaxed mb-7 max-w-md font-medium">
                Attach a smart QR tag to everything you value. Get notified the moment
                it's found — anywhere in the world.
              </p>

              {/* Mini QR tag preview */}
              <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-sm border border-white/15 rounded-[1.5rem] px-5 py-3.5">
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
                  <p className="text-white/50 text-xs mt-0.5 font-medium">Linked · Active</p>
                </div>
                <div className="ml-2 flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
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
