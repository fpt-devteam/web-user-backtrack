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
    <div className="bg-white rounded-[1.5rem] p-6 lg:p-8 shadow-sm border border-[#e5e5e5] h-full flex flex-col">
      {/* Header badges */}
      <div className="flex items-center gap-2 mb-4">
        <span className="bg-[#00D2FE] text-[#111] text-[10px] font-black px-3 py-1 rounded-full tracking-wide uppercase">
          New
        </span>
        <span className="text-[#0099BB] text-[11px] font-bold uppercase tracking-widest">
          Beta Feature
        </span>
      </div>

      <div className="flex items-start gap-3 mb-3">
        <div className="w-11 h-11 bg-[#00D2FE]/15 rounded-xl flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-[#0099BB]" />
        </div>
        <div>
          <h2 className="text-xl lg:text-2xl font-black text-[#111] leading-snug tracking-tight">Smart AI Recovery</h2>
          <p className="text-[#777] text-sm leading-relaxed mt-1">
            Lost something without a tag? Our AI matches items with 80%+ accuracy
            using smart maps &amp; image recognition.
          </p>
        </div>
      </div>

      {/* Map visual — grid pattern instead of dark gradient */}
      <div className="relative w-full flex-1 min-h-44 lg:min-h-56 rounded-xl overflow-hidden mb-5 bg-[#f5f5f5] bg-grid-pattern">
        {/* Map pins */}
        <MapPin className="absolute text-[#0099BB] drop-shadow-lg w-5 h-5" style={{ top: '15%', left: '12%' }} />
        <MapPin className="absolute text-[#00D2FE] w-4 h-4" style={{ top: '38%', left: '58%' }} />
        <MapPin className="absolute text-[#0099BB] drop-shadow-lg w-5 h-5" style={{ top: '58%', left: '76%' }} />
        <MapPin className="absolute text-[#00D2FE] w-4 h-4" style={{ top: '68%', left: '28%' }} />

        {/* Pulse ring around main pin */}
        <div className="absolute" style={{ top: '10%', left: '7%' }}>
          <div className="w-8 h-8 rounded-full bg-[#00D2FE]/20 animate-ping" />
        </div>

        {/* Center pill */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white border border-[#e5e5e5] rounded-full px-5 py-2.5 flex items-center gap-2.5 shadow-lg">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D2FE] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00D2FE]" />
            </span>
            <span className="text-xs font-bold text-[#111]">Scanning Area...</span>
          </div>
        </div>

        {/* Match badge */}
        <div className="absolute top-3 right-3 bg-white rounded-xl px-2.5 py-1.5 shadow-md border border-[#e5e5e5]">
          <p className="text-[9px] font-black text-[#111]">AI Match</p>
          <p className="text-[10px] font-black text-green-500">83%</p>
        </div>
      </div>

      <button className="flex items-center gap-1.5 text-[#0099BB] hover:text-[#007799] text-sm font-bold transition-colors duration-200 group mt-auto">
        Learn about AI Matching
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
      </button>
    </div>
  )
}

function ConnectAndRecoverCard() {
  return (
    <div className="bg-white rounded-[1.5rem] p-6 lg:p-8 shadow-sm border border-[#e5e5e5] h-full flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center">
          <Lock className="w-5 h-5 text-green-600" />
        </div>
        <div className="flex items-center gap-1.5 bg-[#00D2FE]/10 text-[#0099BB] text-xs font-bold px-3 py-1 rounded-full">
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
      <div className="flex-1 bg-[#f5f5f5] rounded-xl p-4 space-y-3 mb-5">
        {CHAT_MESSAGES.map((msg) =>
          msg.isReceived ? (
            <div key={msg.id} className="flex items-end gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ccc] to-[#bbb] flex-shrink-0" />
              <div className="bg-white rounded-2xl rounded-bl-md px-3.5 py-2.5 max-w-[80%] shadow-sm border border-[#e5e5e5]">
                <p className="text-xs text-[#555]">{msg.text}</p>
              </div>
            </div>
          ) : (
            <div key={msg.id} className="flex items-end gap-2 justify-end">
              {/* Sent messages → Cyan (Moneda style) */}
              <div className="bg-[#00D2FE] rounded-2xl rounded-br-md px-3.5 py-2.5 max-w-[80%] shadow-sm">
                <p className="text-xs text-[#111] font-medium">{msg.text}</p>
              </div>
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00D2FE] to-[#0099BB] border-2 border-white shadow-sm flex-shrink-0" />
            </div>
          )
        )}
        {/* Typing indicator */}
        <div className="flex items-end gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ccc] to-[#bbb] flex-shrink-0" />
          <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-[#e5e5e5] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#aaa] animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#aaa] animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-[#aaa] animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>

      <button className="w-full flex items-center justify-center gap-2 border-2 border-[#111] hover:bg-[#00D2FE] hover:border-[#00D2FE] hover:text-[#111] active:scale-95 text-[#111] font-black py-3.5 px-6 rounded-full transition-all duration-200 mt-auto text-sm tracking-wide">
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
        <p className="text-xs font-black text-[#aaa] uppercase tracking-widest mb-1">How it works</p>
        <h2 className="text-2xl lg:text-4xl font-black text-[#111] tracking-tight">Reunite anything, anywhere.</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 lg:items-start">
        <SmartAIRecoveryCard />
        <ConnectAndRecoverCard />
      </div>
    </section>
  )
}
