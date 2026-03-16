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
    <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-blue-100 h-full flex flex-col">
      {/* Header badges */}
      <div className="flex items-center gap-2 mb-4">
        <span className="bg-blue-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg tracking-wide uppercase">
          New
        </span>
        <span className="text-blue-500 text-[11px] font-semibold uppercase tracking-widest">
          Beta Feature
        </span>
      </div>

      <div className="flex items-start gap-3 mb-3">
        <div className="w-11 h-11 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 leading-snug">Smart AI Recovery</h2>
          <p className="text-gray-500 text-sm leading-relaxed mt-1">
            Lost something without a tag? Our AI matches items with 80%+ accuracy
            using smart maps &amp; image recognition.
          </p>
        </div>
      </div>

      {/* Map visual */}
      <div className="relative w-full flex-1 min-h-44 lg:min-h-56 rounded-2xl overflow-hidden mb-5 bg-gradient-to-br from-slate-800 via-slate-700 to-teal-800">
        {/* Grid overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="map-grid" width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#map-grid)" />
        </svg>

        {/* Road lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="40%" x2="100%" y2="55%" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
          <line x1="30%" y1="0" x2="45%" y2="100%" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
          <line x1="0" y1="70%" x2="100%" y2="70%" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        </svg>

        {/* Map pins */}
        <MapPin className="absolute text-orange-400 drop-shadow-lg w-5 h-5" style={{ top: '15%', left: '12%' }} />
        <MapPin className="absolute text-orange-300 w-4 h-4" style={{ top: '38%', left: '58%' }} />
        <MapPin className="absolute text-orange-400 drop-shadow-lg w-5 h-5" style={{ top: '58%', left: '76%' }} />
        <MapPin className="absolute text-orange-300 w-4 h-4" style={{ top: '68%', left: '28%' }} />

        {/* Pulse ring around main pin */}
        <div className="absolute" style={{ top: '10%', left: '7%' }}>
          <div className="w-8 h-8 rounded-full bg-orange-400/20 animate-ping" />
        </div>

        {/* Center pill */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-full px-5 py-2.5 flex items-center gap-2.5 shadow-xl">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500" />
            </span>
            <span className="text-xs font-semibold text-gray-700">Scanning Area...</span>
          </div>
        </div>

        {/* Match badge */}
        <div className="absolute top-3 right-3 bg-white rounded-xl px-2.5 py-1.5 shadow-lg">
          <p className="text-[9px] font-bold text-gray-900">AI Match</p>
          <p className="text-[10px] font-extrabold text-green-500">83%</p>
        </div>
      </div>

      <button className="flex items-center gap-1.5 text-blue-500 text-sm font-semibold hover:text-blue-600 transition-colors duration-200 group mt-auto">
        Learn about AI Matching
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
      </button>
    </div>
  )
}

function ConnectAndRecoverCard() {
  return (
    <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-blue-100 h-full flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className="w-11 h-11 bg-green-100 rounded-2xl flex items-center justify-center">
          <Lock className="w-5 h-5 text-green-600" />
        </div>
        <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-full">
          <CheckCircle className="w-3 h-3" />
          End-to-end encrypted
        </div>
      </div>

      <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Connect &amp; Recover</h2>
      <p className="text-gray-500 text-sm lg:text-base leading-relaxed mb-5">
        Chat securely with finders. Arrange a safe handover without ever
        sharing your personal phone number or email.
      </p>

      {/* Chat bubbles */}
      <div className="flex-1 bg-gray-50 rounded-2xl p-4 space-y-3 mb-5">
        {CHAT_MESSAGES.map((msg) =>
          msg.isReceived ? (
            <div key={msg.id} className="flex items-end gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex-shrink-0" />
              <div className="bg-white rounded-2xl rounded-bl-md px-3.5 py-2.5 max-w-[80%] shadow-sm border border-gray-100">
                <p className="text-xs text-gray-700">{msg.text}</p>
              </div>
            </div>
          ) : (
            <div key={msg.id} className="flex items-end gap-2 justify-end">
              <div className="bg-blue-500 rounded-2xl rounded-br-md px-3.5 py-2.5 max-w-[80%] shadow-sm shadow-blue-100">
                <p className="text-xs text-white">{msg.text}</p>
              </div>
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 border-2 border-white shadow-sm flex-shrink-0" />
            </div>
          )
        )}
        {/* Typing indicator */}
        <div className="flex items-end gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex-shrink-0" />
          <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>

      <button className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 active:scale-95 text-gray-900 font-semibold py-3.5 px-6 rounded-2xl transition-all duration-200 mt-auto">
        <MessageCircle className="w-4 h-4" />
        Start Secure Chat
      </button>
    </div>
  )
}

export function HowItWorksSection() {
  return (
    <section className="px-5 lg:px-10 pb-8 lg:pb-16 w-full max-w-md lg:max-w-screen-xl mx-auto">
      {/* Section label */}
      <div className="mb-6 lg:mb-8">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">How it works</p>
        <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900">Reunite anything, anywhere.</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 lg:items-start">
        <SmartAIRecoveryCard />
        <ConnectAndRecoverCard />
      </div>
    </section>
  )
}
