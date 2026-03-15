import { Sparkles, MapPin, Clock, ArrowRight, ImageIcon, FileText, Navigation } from 'lucide-react'

interface MatchDimension {
  icon: React.ElementType
  label: string
  score: number
  color: string
  barColor: string
}

const MATCH_DIMENSIONS: MatchDimension[] = [
  { icon: FileText, label: 'Description', score: 92, color: 'text-blue-400', barColor: 'bg-blue-500' },
  { icon: ImageIcon, label: 'Image Recognition', score: 87, color: 'text-purple-400', barColor: 'bg-purple-500' },
  { icon: Navigation, label: 'Location Proximity', score: 95, color: 'text-teal-400', barColor: 'bg-teal-500' },
  { icon: Clock, label: 'Time Correlation', score: 78, color: 'text-amber-400', barColor: 'bg-amber-500' },
]

function LostCard() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-[280px] lg:max-w-none">
      {/* Image placeholder */}
      <div className="relative h-36 lg:h-44 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
        {/* Stylised bag SVG */}
        <svg viewBox="0 0 120 100" className="w-24 h-20 opacity-60" fill="none">
          <rect x="30" y="35" width="60" height="50" rx="8" fill="#64748b" />
          <path d="M45 35 Q45 20 60 20 Q75 20 75 35" stroke="#64748b" strokeWidth="5" fill="none" strokeLinecap="round" />
          <rect x="50" y="55" width="20" height="12" rx="3" fill="#94a3b8" />
        </svg>
        <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide shadow">
          Lost
        </div>
        <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm text-gray-500 text-[10px] font-medium px-2 py-1 rounded-lg flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" />
          2 days ago
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-sm mb-1">Blue North Face Backpack</h3>
        <p className="text-xs text-gray-500 leading-relaxed mb-3">
          Medium-sized blue backpack, contains a laptop &amp; gym clothes. Last seen near the fountain.
        </p>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">Central Park, New York</span>
        </div>
      </div>
    </div>
  )
}

function FoundCard() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-[280px] lg:max-w-none">
      {/* Image placeholder */}
      <div className="relative h-36 lg:h-44 bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center">
        <svg viewBox="0 0 120 100" className="w-24 h-20 opacity-70" fill="none">
          <rect x="30" y="35" width="60" height="50" rx="8" fill="#0d9488" />
          <path d="M45 35 Q45 20 60 20 Q75 20 75 35" stroke="#0d9488" strokeWidth="5" fill="none" strokeLinecap="round" />
          <rect x="50" y="55" width="20" height="12" rx="3" fill="#2dd4bf" />
        </svg>
        <div className="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide shadow">
          Found
        </div>
        <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm text-gray-500 text-[10px] font-medium px-2 py-1 rounded-lg flex items-center gap-1">
          <Clock className="w-2.5 h-2.5" />
          1 day ago
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-sm mb-1">Found a Blue Backpack</h3>
        <p className="text-xs text-gray-500 leading-relaxed mb-3">
          Blue backpack with a laptop inside, found by the park fountain area. Owner please claim!
        </p>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">Central Park, New York</span>
        </div>
      </div>
    </div>
  )
}

function MatchScoreRing() {
  const score = 89
  const r = 36
  const circumference = 2 * Math.PI * r
  const dash = (score / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24 lg:w-28 lg:h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88">
          {/* Track */}
          <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
          {/* Progress */}
          <circle
            cx="44" cy="44" r={r}
            fill="none"
            stroke="url(#scoreGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
          />
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl lg:text-3xl font-extrabold text-white leading-none">{score}%</span>
          <span className="text-[9px] text-white/60 font-semibold uppercase tracking-wide">Match</span>
        </div>
      </div>
      <div className="bg-green-400/20 border border-green-400/30 text-green-300 text-xs font-bold px-3 py-1 rounded-full">
        High Confidence
      </div>
    </div>
  )
}

export function AiMatchingSection() {
  return (
    <section className="bg-slate-900 relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-800/10 rounded-full blur-3xl" />
      </div>

      <div className="relative px-5 lg:px-10 py-16 lg:py-24 w-full max-w-md lg:max-w-screen-xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white/80 text-xs font-semibold px-4 py-2 rounded-full mb-5">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            AI-Powered Matching Engine
          </div>
          <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
            We find matches you'd never<br className="hidden lg:block" />
            <span className="bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
              {' '}spot yourself.
            </span>
          </h2>
          <p className="text-white/50 text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            Our AI cross-references every lost &amp; found report in real time —
            analyzing descriptions, photos, location, and timing to surface the
            best possible matches automatically.
          </p>
        </div>

        {/* ── Match demo ── */}
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-4 mb-14 lg:mb-16">

          {/* Lost card */}
          <div className="w-full lg:flex-1">
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3 text-center lg:text-left">
              Report #1 — Lost
            </p>
            <LostCard />
          </div>

          {/* Center: AI connector */}
          <div className="flex lg:flex-col items-center justify-center gap-4 shrink-0 lg:w-44">
            {/* Dashed line left (mobile: hidden, desktop: dashed) */}
            <div className="hidden lg:block h-px w-full border-t-2 border-dashed border-white/10" />

            <div className="flex flex-col items-center gap-3">
              {/* Sparkles brain */}
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-500 to-blue-600 blur-xl opacity-50" />
                <div className="relative w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
              </div>
              <MatchScoreRing />
            </div>

            <div className="hidden lg:block h-px w-full border-t-2 border-dashed border-white/10" />

            {/* Mobile arrows */}
            <div className="flex lg:hidden items-center gap-2 text-white/30">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Found card */}
          <div className="w-full lg:flex-1">
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3 text-center lg:text-right">
              Report #2 — Found
            </p>
            <FoundCard />
          </div>
        </div>

        {/* ── Matching dimensions ── */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 lg:p-8">
          <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-6 text-center">
            How the AI scores this match
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-x-16 lg:gap-y-5">
            {MATCH_DIMENSIONS.map(({ icon: Icon, label, score, color, barColor }) => (
              <div key={label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                    <span className="text-white/70 text-xs font-medium">{label}</span>
                  </div>
                  <span className="text-white text-xs font-bold">{score}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${barColor} rounded-full`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
            <p className="text-white/50 text-sm text-center sm:text-left">
              Backtrack scans <span className="text-white font-semibold">thousands of reports</span> every minute — automatically.
            </p>
            <button className="flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-50 active:scale-95 font-semibold text-sm py-3 px-6 rounded-2xl transition-all duration-200 shadow-lg whitespace-nowrap shrink-0">
              Try AI Search
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}
