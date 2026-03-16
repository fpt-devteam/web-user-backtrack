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
    <div className="bg-[#111]/10 hover:bg-[#111]/15 border border-[#111]/15 rounded-[1.5rem] p-4 transition-colors duration-200 cursor-default">
      <div className="w-9 h-9 bg-[#111]/15 rounded-xl flex items-center justify-center mb-3">
        <Icon className="w-4 h-4 text-[#111]" />
      </div>
      <p className="text-[#111] text-sm font-bold mb-1">{label}</p>
      <p className="text-[#111]/60 text-xs leading-relaxed font-medium">{desc}</p>
    </div>
  )
}

export function CTASection() {
  return (
    <section className="px-5 lg:px-10 pt-8 pb-8 lg:pt-14 lg:pb-14 w-full max-w-md lg:max-w-screen-xl mx-auto">
      {/* Moneda signature: solid Cyan block, NO gradient, text is BLACK */}
      <div className="relative overflow-hidden bg-[#00D2FE] rounded-[2rem] p-7 lg:p-12 shadow-2xl shadow-[#00D2FE]/30">
        {/* Subtle grid on Cyan */}
        <div
          className="absolute inset-0 rounded-[2rem] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Subtle highlight top-right */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 lg:flex lg:items-center lg:gap-14">

          {/* Left: text + QR badge */}
          <div className="lg:flex-1">
            <div className="inline-flex items-center gap-2 bg-[#111]/10 border border-[#111]/15 text-[#111] text-xs font-bold px-4 py-2 rounded-full mb-5 uppercase tracking-wider">
              <QrCode className="w-3.5 h-3.5" />
              Your Item's Digital Identity
            </div>
            <h2 className="text-2xl lg:text-5xl font-black text-[#111] mb-3 leading-tight tracking-tighter">
              One scan.<br className="hidden lg:block" />
              Instant connection.
            </h2>
            <p className="text-[#111]/65 text-sm lg:text-base leading-relaxed mb-7 max-w-md font-medium">
              Attach a smart QR tag to everything you value. Get notified the moment
              it's found — anywhere in the world.
            </p>

            {/* Mini QR tag preview */}
            <div className="inline-flex items-center gap-4 bg-[#111]/10 backdrop-blur-sm border border-[#111]/15 rounded-[1.5rem] px-5 py-3.5">
              {/* QR grid */}
              <div className="w-11 h-11 bg-white rounded-xl p-1.5 shrink-0 shadow-sm">
                <div className="w-full h-full grid grid-cols-5 gap-[1px]">
                  {[1,1,1,1,1, 1,0,0,0,1, 1,0,1,0,1, 1,0,0,0,1, 1,1,1,1,1].map((v, i) => (
                    <div key={i} className={`rounded-[1px] ${v ? 'bg-[#111]' : 'bg-transparent'}`} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[#111] text-sm font-black tracking-wide">BTK-4K9RZE</p>
                <p className="text-[#111]/60 text-xs mt-0.5 font-medium">Linked · Active</p>
              </div>
              <div className="ml-2 flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-700 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-700" />
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
    </section>
  )
}
