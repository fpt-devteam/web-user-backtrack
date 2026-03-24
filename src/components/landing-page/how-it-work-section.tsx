import { MapPin, Lock, CheckCircle, ArrowRight, Sparkles, MessageCircle } from 'lucide-react'

interface ChatMessage {
  id: number
  text: string
  isReceived: boolean
}

const CHAT_MESSAGES: ChatMessage[] = [
  { id: 1, text: 'Hi! I found your keys at the park. 🔑', isReceived: true },
  { id: 2, text: 'Oh wow, thank you so much! Still there?', isReceived: false },
  { id: 3, text: 'Yes! Meet at the park entrance?', isReceived: true },
]

function SmartAIRecoveryCard() {
  return (
    <div className="bg-white rounded-[1.5rem] p-6 lg:p-8 shadow-sm border border-[#E8E8E4] h-full flex flex-col">
      {/* Header badges */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-white text-[10px] font-black px-3 py-1 rounded-full tracking-wide uppercase"
          style={{ background: 'linear-gradient(135deg,#4F46E5,#6366F1)' }}>
          New
        </span>
        <span className="text-indigo-500 text-[11px] font-bold uppercase tracking-widest">
          Beta Feature
        </span>
      </div>

      <div className="flex items-start gap-3 mb-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'rgba(99,102,241,0.10)' }}>
          <Sparkles className="w-5 h-5 text-indigo-500" />
        </div>
        <div>
          <h2 className="text-xl lg:text-2xl font-black text-[#111] leading-snug tracking-tight">Smart AI Recovery</h2>
          <p className="text-[#777] text-sm leading-relaxed mt-1">
            Lost something without a tag? Our AI matches items with 80%+ accuracy
            using smart maps &amp; image recognition.
          </p>
        </div>
      </div>

      {/* Map visual — detailed SVG city map */}
      <div className="relative w-full flex-1 min-h-44 lg:min-h-56 rounded-xl overflow-hidden mb-5">
        <svg viewBox="0 0 400 250" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="mapgrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M20 0 L0 0 0 20" fill="none" stroke="#000" strokeWidth="0.3" />
            </pattern>
          </defs>
          {/* Land base */}
          <rect width="400" height="250" fill="#E8E2D5" />
          {/* Parks */}
          <rect x="8" y="8" width="58" height="38" fill="#C5DDA8" rx="3" />
          <rect x="295" y="170" width="75" height="55" fill="#C5DDA8" rx="3" />
          <rect x="158" y="5" width="42" height="28" fill="#C5DDA8" rx="3" />
          <circle cx="25" cy="22" r="4" fill="#A8CD80" />
          <circle cx="40" cy="18" r="3" fill="#A8CD80" />
          <circle cx="55" cy="26" r="4" fill="#A8CD80" />
          <circle cx="32" cy="34" r="3" fill="#A8CD80" />
          <circle cx="48" cy="38" r="3" fill="#A8CD80" />
          {/* River */}
          <path d="M0,215 Q60,205 120,218 Q180,230 240,212 Q300,196 360,210 Q385,216 400,208 L400,250 L0,250 Z" fill="#A8C8E8" opacity="0.85" />
          <path d="M40,225 Q80,220 120,226" stroke="#8FB8D8" strokeWidth="1" fill="none" opacity="0.6" />
          <path d="M200,216 Q250,210 300,218" stroke="#8FB8D8" strokeWidth="1" fill="none" opacity="0.6" />
          {/* City blocks */}
          <rect x="8" y="52" width="28" height="22" fill="#D8D2C5" rx="1.5" />
          <rect x="40" y="52" width="22" height="22" fill="#D8D2C5" rx="1.5" />
          <rect x="8" y="78" width="22" height="18" fill="#D8D2C5" rx="1.5" />
          <rect x="34" y="78" width="28" height="18" fill="#D8D2C5" rx="1.5" />
          <rect x="8" y="100" width="54" height="12" fill="#D8D2C5" rx="1.5" />
          <rect x="8" y="116" width="30" height="20" fill="#D8D2C5" rx="1.5" />
          <rect x="42" y="116" width="20" height="20" fill="#D8D2C5" rx="1.5" />
          <rect x="92" y="8" width="38" height="28" fill="#D8D2C5" rx="1.5" />
          <rect x="92" y="40" width="16" height="22" fill="#D8D2C5" rx="1.5" />
          <rect x="112" y="40" width="18" height="22" fill="#D8D2C5" rx="1.5" />
          <rect x="92" y="66" width="38" height="14" fill="#D8D2C5" rx="1.5" />
          <rect x="92" y="85" width="20" height="20" fill="#D8D2C5" rx="1.5" />
          <rect x="116" y="85" width="14" height="20" fill="#D8D2C5" rx="1.5" />
          <rect x="222" y="8" width="45" height="30" fill="#D8D2C5" rx="1.5" />
          <rect x="271" y="8" width="28" height="30" fill="#D8D2C5" rx="1.5" />
          <rect x="222" y="42" width="32" height="18" fill="#D8D2C5" rx="1.5" />
          <rect x="258" y="42" width="41" height="18" fill="#D8D2C5" rx="1.5" />
          <rect x="306" y="8" width="46" height="18" fill="#D8D2C5" rx="1.5" />
          <rect x="306" y="30" width="46" height="35" fill="#D8D2C5" rx="1.5" />
          <rect x="356" y="8" width="38" height="57" fill="#D8D2C5" rx="1.5" />
          <rect x="8" y="148" width="58" height="28" fill="#D8D2C5" rx="1.5" />
          <rect x="8" y="180" width="28" height="14" fill="#D8D2C5" rx="1.5" />
          <rect x="40" y="180" width="26" height="14" fill="#D8D2C5" rx="1.5" />
          <rect x="92" y="148" width="90" height="22" fill="#D8D2C5" rx="1.5" />
          <rect x="92" y="174" width="42" height="18" fill="#D8D2C5" rx="1.5" />
          <rect x="138" y="174" width="44" height="18" fill="#D8D2C5" rx="1.5" />
          <rect x="222" y="104" width="56" height="30" fill="#D8D2C5" rx="1.5" />
          <rect x="282" y="104" width="38" height="30" fill="#D8D2C5" rx="1.5" />
          <rect x="322" y="92" width="38" height="42" fill="#D8D2C5" rx="1.5" />
          <rect x="364" y="92" width="30" height="42" fill="#D8D2C5" rx="1.5" />
          <rect x="222" y="148" width="50" height="22" fill="#D8D2C5" rx="1.5" />
          <rect x="276" y="148" width="28" height="22" fill="#D8D2C5" rx="1.5" />
          {/* Major roads */}
          <line x1="0" y1="48" x2="400" y2="48" stroke="#FFFFFF" strokeWidth="9" />
          <line x1="0" y1="138" x2="400" y2="138" stroke="#FFFFFF" strokeWidth="9" />
          <line x1="78" y1="0" x2="78" y2="250" stroke="#FFFFFF" strokeWidth="9" />
          <line x1="208" y1="0" x2="208" y2="250" stroke="#FFFFFF" strokeWidth="9" />
          <line x1="318" y1="0" x2="318" y2="250" stroke="#FFFFFF" strokeWidth="9" />
          {/* Minor roads */}
          <line x1="0" y1="98" x2="400" y2="98" stroke="#FFFFFF" strokeWidth="4" />
          <line x1="0" y1="168" x2="400" y2="168" stroke="#FFFFFF" strokeWidth="4" />
          <line x1="148" y1="0" x2="148" y2="138" stroke="#FFFFFF" strokeWidth="4" />
          <line x1="268" y1="0" x2="268" y2="138" stroke="#FFFFFF" strokeWidth="4" />
          <line x1="368" y1="0" x2="368" y2="138" stroke="#FFFFFF" strokeWidth="4" />
          <line x1="38" y1="138" x2="38" y2="210" stroke="#FFFFFF" strokeWidth="4" />
          <line x1="192" y1="138" x2="192" y2="210" stroke="#FFFFFF" strokeWidth="4" />
          <line x1="308" y1="138" x2="308" y2="210" stroke="#FFFFFF" strokeWidth="4" />
          {/* Center dashes */}
          <line x1="0" y1="48" x2="400" y2="48" stroke="#F0C84A" strokeWidth="1.2" strokeDasharray="14,9" opacity="0.5" />
          <line x1="0" y1="138" x2="400" y2="138" stroke="#F0C84A" strokeWidth="1.2" strokeDasharray="14,9" opacity="0.5" />
          <line x1="78" y1="0" x2="78" y2="250" stroke="#F0C84A" strokeWidth="1.2" strokeDasharray="14,9" opacity="0.5" />
          <line x1="208" y1="0" x2="208" y2="250" stroke="#F0C84A" strokeWidth="1.2" strokeDasharray="14,9" opacity="0.5" />
          {/* Roundabouts */}
          <circle cx="78" cy="48" r="9" fill="#FFFFFF" /><circle cx="78" cy="48" r="5" fill="#E8E2D5" />
          <circle cx="208" cy="138" r="9" fill="#FFFFFF" /><circle cx="208" cy="138" r="5" fill="#E8E2D5" />
          <circle cx="318" cy="48" r="9" fill="#FFFFFF" /><circle cx="318" cy="48" r="5" fill="#E8E2D5" />
          {/* Road labels */}
          <text x="143" y="44" fontFamily="system-ui,sans-serif" fontSize="5.5" fontWeight="700" fill="#AAA" textAnchor="middle">Nguyen Hue Blvd</text>
          <text x="263" y="134" fontFamily="system-ui,sans-serif" fontSize="5.5" fontWeight="700" fill="#AAA" textAnchor="middle">Le Loi Avenue</text>
          <text x="74" y="115" fontFamily="system-ui,sans-serif" fontSize="5.5" fontWeight="700" fill="#AAA" textAnchor="end" transform="rotate(-90,74,115)">Dong Khoi St</text>
          <text x="204" y="70" fontFamily="system-ui,sans-serif" fontSize="5.5" fontWeight="700" fill="#AAA" textAnchor="end" transform="rotate(-90,204,70)">Ham Nghi St</text>
          {/* Grid overlay */}
          <rect width="400" height="250" fill="url(#mapgrid)" opacity="0.06" />
        </svg>
        {/* Map pins */}
        <MapPin className="absolute text-indigo-500 drop-shadow-lg w-5 h-5" style={{ top: '15%', left: '12%' }} />
        <MapPin className="absolute text-indigo-300 w-4 h-4" style={{ top: '38%', left: '58%' }} />
        <MapPin className="absolute text-indigo-500 drop-shadow-lg w-5 h-5" style={{ top: '58%', left: '76%' }} />
        <MapPin className="absolute text-indigo-300 w-4 h-4" style={{ top: '68%', left: '28%' }} />

        {/* Pulse ring */}
        <div className="absolute" style={{ top: '10%', left: '7%' }}>
          <div className="w-8 h-8 rounded-full bg-indigo-400/20 animate-ping" />
        </div>

        {/* Center pill */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white border border-[#E8E8E4] rounded-full px-5 py-2.5 flex items-center gap-2.5 shadow-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500" />
            </span>
            <span className="text-xs font-bold text-[#111]">Scanning Area...</span>
          </div>
        </div>

        {/* Match badge */}
        <div className="absolute top-3 right-3 bg-white rounded-xl px-2.5 py-1.5 shadow-md border border-[#E8E8E4]">
          <p className="text-[9px] font-black text-[#111]">AI Match</p>
          <p className="text-[10px] font-black text-emerald-500">83%</p>
        </div>
      </div>

      <button className="flex items-center gap-1.5 text-indigo-500 hover:text-indigo-600 text-sm font-bold transition-colors duration-200 group mt-auto">
        Learn about AI Matching
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
      </button>
    </div>
  )
}

function ConnectAndRecoverCard() {
  return (
    <div className="bg-white rounded-[1.5rem] p-6 lg:p-8 shadow-sm border border-[#E8E8E4] h-full flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center">
          <Lock className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-500 text-xs font-bold px-3 py-1 rounded-full">
          <CheckCircle className="w-3 h-3" />
          End-to-end encrypted
        </div>
      </div>

      <h2 className="text-xl lg:text-2xl font-black text-[#111] mb-2 tracking-tight">Connect &amp; Recover</h2>
      <p className="text-[#777] text-sm lg:text-base leading-relaxed mb-5">
        Chat securely with finders. Arrange a safe handover without ever
        sharing your personal phone number or email.
      </p>

      {/* Chat bubbles */}
      <div className="flex-1 rounded-xl p-4 space-y-3 mb-5" style={{ backgroundColor: '#F4F3F0' }}>
        {CHAT_MESSAGES.map((msg) =>
          msg.isReceived ? (
            <div key={msg.id} className="flex items-end gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ccc] to-[#bbb] flex-shrink-0" />
              <div className="bg-white rounded-2xl rounded-bl-md px-3.5 py-2.5 max-w-[80%] shadow-sm border border-[#E8E8E4]">
                <p className="text-xs text-[#555]">{msg.text}</p>
              </div>
            </div>
          ) : (
            <div key={msg.id} className="flex items-end gap-2 justify-end">
              {/* Sent messages → Indigo */}
              <div className="rounded-2xl rounded-br-md px-3.5 py-2.5 max-w-[80%] shadow-sm"
                style={{ background: 'linear-gradient(135deg,#4F46E5,#6366F1)' }}>
                <p className="text-xs text-white font-medium">{msg.text}</p>
              </div>
              <div className="w-7 h-7 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#6366F1,#4F46E5)' }} />
            </div>
          )
        )}
        {/* Typing indicator */}
        <div className="flex items-end gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ccc] to-[#bbb] flex-shrink-0" />
          <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-[#E8E8E4] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#aaa] animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#aaa] animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#aaa] animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>

      <button className={
        'w-full flex items-center justify-center gap-2 border-2 border-[#111] ' +
        'hover:bg-[#0F0F0F] hover:text-white active:scale-95 ' +
        'text-[#111] font-black py-3.5 px-6 rounded-full transition-all duration-200 mt-auto text-sm tracking-wide'
      }>
        <MessageCircle className="w-4 h-4" />
        Start Secure Chat
      </button>
    </div>
  )
}

export function HowItWorksSection() {
  return (
    <section className="w-full" style={{ backgroundColor: 'var(--background)' }}>
      <div className="px-5 lg:px-10 py-14 lg:py-20 w-full max-w-md lg:max-w-screen-xl mx-auto">
        {/* Section label */}
        <div className="mb-6 lg:mb-8">
          <p className="text-xs font-black text-[#bbb] uppercase tracking-widest mb-1">How it works</p>
          <h2 className="text-2xl lg:text-4xl font-black text-[#111] tracking-tight">Reunite anything, anywhere.</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 lg:items-start">
          <SmartAIRecoveryCard />
          <ConnectAndRecoverCard />
        </div>
      </div>
    </section>
  )
}
