import React from 'react'
import { ArrowRight, Clock, FileText, ImageIcon, MapPin, Navigation, Sparkles } from 'lucide-react'

interface MatchDimension {
  icon: React.ElementType
  label: string
  score: number
  color: string
  barGrad: string
}

const MATCH_DIMENSIONS: Array<MatchDimension> = [
  { icon: FileText,   label: 'Description',       score: 92, color: 'text-brand-300',  barGrad: 'linear-gradient(90deg,var(--brand-400),var(--brand-600))' },
  { icon: ImageIcon,  label: 'Image Recognition',  score: 87, color: 'text-brand-200',  barGrad: 'linear-gradient(90deg,var(--brand-300),var(--brand-500))' },
  { icon: Navigation, label: 'Location Proximity', score: 95, color: 'text-emerald-300', barGrad: 'linear-gradient(90deg,#34D399,#10B981)' },
  { icon: Clock,      label: 'Time Correlation',   score: 78, color: 'text-amber-300',   barGrad: 'linear-gradient(90deg,#FCD34D,#F59E0B)' },
]

function LostCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-xl shadow-black/10 w-full">
      {/* Real product photo */}
      <div className="relative h-52 lg:h-60 bg-slate-50">
        <img
          src="/package1.jpg"
          alt="Lost black Elly handbag"
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle dark scrim so badges stay readable */}
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-2 left-2 bg-brand-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
          Lost
        </div>
        <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm text-[#555] text-[9px] font-medium px-1.5 py-0.5 rounded-full flex items-center gap-1">
          <Clock className="w-2 h-2" />
          2 days ago
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-black text-[#111] text-xs mb-0.5">Black Elly Handbag</h3>
        <p className="text-[11px] text-[#777] leading-relaxed mb-2">
          Black quilted leather handbag with brand scarf, silver buckle. Lost at shopping mall.
        </p>
        <div className="flex items-center gap-1 text-[11px] text-[#aaa]">
          <MapPin className="w-2.5 h-2.5 shrink-0" />
          <span className="truncate">Vincom Center, Ha Noi</span>
        </div>
      </div>
    </div>
  )
}

function FoundCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-xl shadow-black/10 w-full">
      {/* Bag with contents — signals it's been opened & verified */}
      <div className="relative h-52 lg:h-60 bg-slate-50">
        <img
          src="/package2.jpg"
          alt="Found Elly handbag with contents"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
          Found
        </div>
        <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm text-[#555] text-[9px] font-medium px-1.5 py-0.5 rounded-full flex items-center gap-1">
          <Clock className="w-2 h-2" />
          1 day ago
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-black text-[#111] text-xs mb-0.5">Found: Elly Handbag + Items</h3>
        <p className="text-[11px] text-[#777] leading-relaxed mb-2">
          Black quilted bag with phone, tablet &amp; notebook inside. Found near entrance. Owner claim!
        </p>
        <div className="flex items-center gap-1 text-[11px] text-[#aaa]">
          <MapPin className="w-2.5 h-2.5 shrink-0" />
          <span className="truncate">Vincom Center, Ha Noi</span>
        </div>
      </div>
    </div>
  )
}

function MatchScoreRing() {
  const score = 89
  const r = 30
  const circumference = 2 * Math.PI * r
  const dash = (score / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-16 h-16 lg:w-20 lg:h-20">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="5" />
          <circle
            cx="36" cy="36" r={r}
            fill="none"
            stroke="url(#scoreGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
          />
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--brand-400)" />
              <stop offset="100%" stopColor="var(--brand-600)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base lg:text-xl font-black text-[#111] leading-none">{score}%</span>
          <span className="text-[8px] text-[#888] font-bold uppercase tracking-wide">Match</span>
        </div>
      </div>
      <div className="bg-brand-500/10 border border-brand-500/20 text-brand-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
        High Confidence
      </div>
    </div>
  )
}

export function AiMatchingSection() {
  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>

      {/* ── Mesh gradient blobs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large rose bloom — top left */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, oklch(0.820 0.155 14.8 / 0.22) 0%, transparent 65%)' }} />
        {/* Violet accent — top right */}
        <div className="absolute -top-16 right-0 w-[360px] h-[360px] rounded-full"
          style={{ background: 'radial-gradient(circle, oklch(0.720 0.180 310 / 0.14) 0%, transparent 65%)' }} />
        {/* Rose mid — center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, oklch(0.880 0.090 14.8 / 0.18) 0%, transparent 65%)' }} />
        {/* Amber warm — bottom right */}
        <div className="absolute -bottom-24 -right-24 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, oklch(0.900 0.120 60 / 0.16) 0%, transparent 65%)' }} />
        {/* Soft rose — bottom left */}
        <div className="absolute -bottom-16 left-1/4 w-[320px] h-[320px] rounded-full"
          style={{ background: 'radial-gradient(circle, oklch(0.840 0.130 14.8 / 0.13) 0%, transparent 65%)' }} />
        {/* Noise texture overlay for depth */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '200px 200px' }} />
      </div>

      <div className="relative px-5 lg:px-10 py-10 lg:py-14 w-full max-w-md lg:max-w-5xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-8 lg:mb-10">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 text-brand-700 text-[11px] font-bold px-3 py-1.5 rounded-full mb-3 uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-brand-500" />
            AI-Powered Matching Engine
          </div>
          <h2 className="text-2xl lg:text-4xl font-black text-[#111] mb-3 leading-tight tracking-tighter">
            We find matches you'd never
            <br className="hidden lg:block" />
            <span
              style={{
                backgroundImage: 'linear-gradient(135deg,var(--brand-400) 0%,var(--brand-600) 60%,var(--brand-300) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {' '}spot yourself.
            </span>
          </h2>
          <p className="text-[#666] text-sm lg:text-base max-w-xl mx-auto leading-relaxed font-medium">
            Our AI cross-references every lost &amp; found report in real time —
            analyzing descriptions, photos, location, and timing automatically.
          </p>
        </div>

        {/* Match demo */}
        <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-3 mb-8 lg:mb-10">

          <div className="w-full lg:flex-1">
            <LostCard />
          </div>

          {/* Center: AI connector */}
          <div className="flex lg:flex-col items-center justify-center gap-3 shrink-0 lg:w-36">
            <div className="hidden lg:block h-px w-full border-t border-dashed border-[#e5e7eb]" />
            <div className="flex flex-col items-center gap-2">
              {/* Indigo AI brain */}
              <div className="relative">
                <div className="absolute inset-0 rounded-xl blur-lg opacity-40"
                  style={{ background: 'linear-gradient(135deg,var(--brand-600),var(--brand-400))' }} />
                <div className="relative w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center shadow-xl"
                  style={{ background: 'linear-gradient(135deg,var(--brand-700),var(--brand-600))' }}>
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
              <MatchScoreRing />
            </div>
            <div className="hidden lg:block h-px w-full border-t border-dashed border-[#e5e7eb]" />
            <div className="flex lg:hidden items-center gap-2 text-[#bbb]">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="w-full lg:flex-1">
            <FoundCard />
          </div>
        </div>

        {/* Matching dimensions */}
        <div className="bg-white/60 backdrop-blur-sm border border-white/80 rounded-2xl p-4 lg:p-6 shadow-sm">
          <p className="text-[#999] text-[10px] font-black uppercase tracking-widest mb-4 text-center">
            How the AI scores this match
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-x-12 lg:gap-y-3">
            {MATCH_DIMENSIONS.map(({ icon: Icon, label, score, color, barGrad }) => (
              <div key={label} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-3 h-3 ${color}`} />
                    <span className="text-[#555] text-xs font-semibold">{label}</span>
                  </div>
                  <span className="text-[#111] text-xs font-black">{score}%</span>
                </div>
                <div className="h-1 bg-black/[0.07] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${score}%`, background: barGrad }} />
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#f0f0ee]">
            <p className="text-[#888] text-xs text-center sm:text-left font-medium">
              Backtrack scans <span className="text-[#111] font-black">thousands of reports</span> every minute — automatically.
            </p>
            <button
              className="flex items-center gap-2 font-black text-xs py-2.5 px-6 rounded-full transition-all duration-200 shadow-lg whitespace-nowrap shrink-0 tracking-wide text-white hover:-translate-y-0.5 hover:shadow-brand-600/25 hover:shadow-xl active:scale-95 shadow-brand-500/20"
              style={{ background: 'linear-gradient(135deg,var(--brand-700),var(--brand-600))' }}
            >
              Try AI Search
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}
