import { Smartphone, QrCode } from 'lucide-react'

const STEPS = [
  { step: '1', text: 'Download the Backtrack app on your phone' },
  { step: '2', text: 'Sign in with the same account' },
  { step: '3', text: 'Tap the QR tab to view and share your code' },
]

export function QrTab() {
  return (
    <section>
      <h2 className="text-[1.75rem] font-extrabold text-[#222] tracking-tight mb-8">
        My QR Code
      </h2>

      <div className="bg-white rounded-3xl border border-[#EBEBEB] shadow-[0_2px_8px_rgba(0,0,0,0.05)] overflow-hidden">
        {/* Illustration area */}
        <div className="flex flex-col items-center gap-4 px-8 py-12 text-center border-b border-[#F0F0F0]">
          <div className="relative">
            {/* Outer ring */}
            <div className="w-24 h-24 rounded-3xl bg-brand-50 border-2 border-brand-100 flex items-center justify-center">
              <QrCode className="w-12 h-12 text-brand-400" strokeWidth={1.5} />
            </div>
            {/* Phone badge */}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-[#111] flex items-center justify-center shadow-md">
              <Smartphone className="w-4 h-4 text-white" strokeWidth={1.8} />
            </div>
          </div>

          <div className="max-w-xs">
            <p className="text-base font-extrabold text-[#222] mb-2">
              View your QR code in the app
            </p>
            <p className="text-sm text-[#999] leading-relaxed">
              Your personal Backtrack QR code is only available on mobile. Open the app to view, download, and share it.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {STEPS.map(({ step, text }) => (
            <div key={step} className="flex items-center gap-4">
              <span className="w-7 h-7 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-xs font-bold text-brand-600 shrink-0">
                {step}
              </span>
              <p className="text-sm text-[#555]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
