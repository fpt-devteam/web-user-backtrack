import { QrCode, Printer, Bell, Globe, Shield } from 'lucide-react'

interface FeatureCardProps {
  icon: React.ElementType
  label: string
  desc: string
}

const FEATURES: FeatureCardProps[] = [
  { icon: Printer, label: 'Unlimited Print', desc: 'Print as many QR tags as you need, forever free.' },
  { icon: Bell, label: 'Instant Alerts', desc: 'Real-time push & SMS when your tag is scanned.' },
  { icon: Globe, label: 'Works Worldwide', desc: 'Recognized and scannable in 120+ countries.' },
  { icon: Shield, label: 'Stay Private', desc: 'Your contact info is never exposed to finders.' },
]

function FeatureCard({ icon: Icon, label, desc }: FeatureCardProps) {
  return (
    <div className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl p-4 transition-colors duration-200 cursor-default">
      <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center mb-3">
        <Icon className="w-4 h-4 text-white" />
      </div>
      <p className="text-white text-sm font-semibold mb-1">{label}</p>
      <p className="text-blue-200 text-xs leading-relaxed">{desc}</p>
    </div>
  )
}

export function CTASection() {
  return (
    <section className="px-5 lg:px-10 pb-8 lg:pb-14 w-full max-w-md lg:max-w-screen-xl mx-auto">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 rounded-3xl p-7 lg:p-12 shadow-2xl shadow-blue-200/60">
        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-900/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 lg:flex lg:items-center lg:gap-14">

          {/* Left: text + QR badge */}
          <div className="lg:flex-1">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full mb-5">
              <QrCode className="w-3.5 h-3.5" />
              Your Item's Digital Identity
            </div>
            <h2 className="text-2xl lg:text-4xl font-extrabold text-white mb-3 leading-tight">
              One scan.<br className="hidden lg:block" />
              Instant connection.
            </h2>
            <p className="text-blue-100 text-sm lg:text-base leading-relaxed mb-7 max-w-md">
              Attach a smart QR tag to everything you value. Get notified the moment
              it's found — anywhere in the world.
            </p>

            {/* Mini QR tag preview */}
            <div className="inline-flex items-center gap-4 bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl px-5 py-3.5">
              {/* QR grid */}
              <div className="w-11 h-11 bg-white rounded-xl p-1.5 shrink-0">
                <div className="w-full h-full grid grid-cols-5 gap-[1px]">
                  {[1,1,1,1,1, 1,0,0,0,1, 1,0,1,0,1, 1,0,0,0,1, 1,1,1,1,1].map((v, i) => (
                    <div key={i} className={`rounded-[1px] ${v ? 'bg-gray-900' : 'bg-transparent'}`} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-white text-sm font-bold tracking-wide">BTK-4K9RZE</p>
                <p className="text-blue-200 text-xs mt-0.5">Linked · Active</p>
              </div>
              <div className="ml-2 flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
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
