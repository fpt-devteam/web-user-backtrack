import { MapPin, Lock, CheckCircle, ArrowRight } from 'lucide-react'

interface ChatMessage {
  id: number
  text: string
  isReceived: boolean
}

const CHAT_MESSAGES: ChatMessage[] = [
  { id: 1, text: 'Hi! I found your keys at the park bench.', isReceived: true },
  { id: 2, text: 'Oh wow, thank you so much! Are you still there?', isReceived: false },
]

function SmartAIRecoveryCard() {
  return (
    <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 h-full">
      {/* Badge row */}
      <div className="flex items-center gap-2 mb-3">
        <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wide uppercase">
          New
        </span>
        <span className="text-blue-500 text-[11px] font-semibold uppercase tracking-widest">
          Beta Feature
        </span>
      </div>

      <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Smart AI Recovery</h2>
      <p className="text-gray-500 text-sm lg:text-base leading-relaxed mb-5">
        Lost something without a tag? Our semantic AI matches items with 80%+
        accuracy using smart maps and image recognition.
      </p>

      {/* Map visual */}
      <div className="relative w-full h-36 lg:h-52 rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-teal-800 to-teal-600">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="map-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path
                d="M 24 0 L 0 0 0 24"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="0.8"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#map-grid)" />
        </svg>

        <MapPin className="absolute text-orange-400 w-5 h-5" style={{ top: '18%', left: '15%' }} />
        <MapPin className="absolute text-orange-400 w-4 h-4" style={{ top: '35%', left: '60%' }} />
        <MapPin className="absolute text-orange-400 w-5 h-5" style={{ top: '55%', left: '78%' }} />
        <MapPin className="absolute text-orange-400 w-4 h-4" style={{ top: '65%', left: '30%' }} />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-full px-5 py-2.5 flex items-center gap-2.5 shadow-lg">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500" />
            </span>
            <span className="text-sm font-medium text-gray-700">Scanning Area...</span>
          </div>
        </div>
      </div>

      <button className="flex items-center gap-1.5 text-blue-500 text-sm font-semibold hover:text-blue-600 transition-colors duration-200 group">
        Learn about AI Matching
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
      </button>
    </div>
  )
}

function ConnectAndRecoverCard() {
  return (
    <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 h-full">
      <div className="flex items-start justify-between mb-3">
        <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center">
          <Lock className="w-5 h-5 text-green-600" />
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
          Verified
        </div>
      </div>

      <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">Connect & Recover</h2>
      <p className="text-gray-500 text-sm lg:text-base leading-relaxed mb-5">
        Chat securely with finders. Arrange a safe handover without ever sharing
        your personal phone number or email.
      </p>

      {/* Chat bubbles */}
      <div className="space-y-3 mb-5">
        {CHAT_MESSAGES.map((msg) =>
          msg.isReceived ? (
            <div key={msg.id} className="flex items-end gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
              <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[78%]">
                <p className="text-sm text-gray-700">{msg.text}</p>
              </div>
            </div>
          ) : (
            <div key={msg.id} className="flex items-end gap-2 justify-end">
              <div className="bg-blue-500 rounded-2xl rounded-br-md px-4 py-2.5 max-w-[78%]">
                <p className="text-sm text-white">{msg.text}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white shadow-sm flex-shrink-0" />
            </div>
          )
        )}
      </div>

      <button className="w-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-95 text-gray-900 font-semibold py-3.5 px-6 rounded-2xl transition-all duration-200">
        Start Secure Chat
      </button>
    </div>
  )
}

export function HowItWorksSection() {
  return (
    <section className="px-5 lg:px-10 pb-5 lg:pb-12 w-full max-w-md lg:max-w-screen-xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 lg:items-start">
        <SmartAIRecoveryCard />
        <ConnectAndRecoverCard />
      </div>
    </section>
  )
}
