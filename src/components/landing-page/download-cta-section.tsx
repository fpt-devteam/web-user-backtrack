import { useState, useEffect } from 'react'
import AppleIcon from '@/assets/icons/apple.svg?react'
import GooglePlayIcon from '@/assets/icons/google-play.svg?react'

/* ─── Richer palette (no raw cyan) ─── */
const COLORS = [
  '#4F46E5', // indigo
  '#7C3AED', // violet
  '#0F172A', // navy
  '#059669', // emerald
  '#DC2626', // red
  '#D97706', // amber
  '#0369A1', // sky-blue
  '#BE185D', // pink
]

/* ─── QR code with animated colour background ─── */
function QRCodeMark() {
  const [colorIdx, setColorIdx] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setColorIdx((prev) => (prev + 1) % COLORS.length)
    }, 600)
    return () => clearInterval(timer)
  }, [])

  return (
    <div
      className="w-40 lg:w-52 mx-auto rounded-[24px] flex flex-col items-center justify-center overflow-hidden shadow-2xl shadow-black/20"
      style={{
        backgroundColor: COLORS[colorIdx],
        padding: '14px 14px 10px',
        transition: 'background-color 0.7s ease-in-out',
      }}
    >
      <img src="/qr-code.svg" alt="Backtrack QR code" className="w-full h-auto block" />
      <span className="text-[11px] lg:text-[13px] font-black tracking-[0.2em] text-white uppercase mt-2">
        BACKTRACK
      </span>
    </div>
  )
}

/* ─── App Store button (pill) ─── */
function AppStoreButton() {
  return (
    <button
      className="min-w-[180px] flex items-center justify-center gap-3 text-white hover:scale-[1.02] active:scale-[0.97] transition-all duration-150 rounded-full px-6 py-3.5 shadow-lg shadow-black/20"
      style={{ background: 'var(--btn-dark-gradient)' }}
      aria-label="Download on the App Store"
    >
      <AppleIcon className="w-5 h-5 shrink-0 fill-white" aria-hidden="true" />
      <div className="flex flex-col items-start leading-none gap-1">
        <span className="text-[10px] font-medium text-white/60 tracking-widest">Download on the</span>
        <span className="text-[18px] font-bold tracking-tight">App Store</span>
      </div>
    </button>
  )
}

/* ─── Google Play button (pill) ─── */
function GooglePlayButton() {
  return (
    <button
      className="min-w-[180px] flex items-center justify-center gap-3 text-white hover:scale-[1.02] active:scale-[0.97] transition-all duration-150 rounded-full px-6 py-3.5 shadow-lg shadow-black/20"
      style={{ background: 'var(--btn-dark-gradient)' }}
      aria-label="Get it on Google Play"
    >
      <GooglePlayIcon className="w-5 h-5 shrink-0 fill-white" aria-hidden="true" />
      <div className="flex flex-col items-start leading-none gap-1">
        <span className="text-[10px] font-medium text-white/60 uppercase tracking-widest">Get it on</span>
        <span className="text-[18px] font-bold tracking-tight">Google Play</span>
      </div>
    </button>
  )
}

/* ─── Main section ─── */
export function DownloadCtaSection() {
  return (
    <section id="download-cta" className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
      <div className="px-5 py-10 w-full max-w-xl mx-auto flex flex-col items-center text-center gap-7">

        {/* QR / brand mark */}
        <QRCodeMark />

        {/* Headline */}
        <h2 className="text-2xl lg:text-4xl font-black text-[#111] leading-snug max-w-lg tracking-tight">
          The universal solution to protect and recover what matters.
        </h2>

        {/* Subline */}
        <p className="text-[#777] text-sm max-w-sm leading-relaxed -mt-3 font-medium">
          Join thousands who trust Backtrack to keep their belongings safe — worldwide.
        </p>

        {/* Store buttons side by side */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <AppStoreButton />
          <GooglePlayButton />
        </div>

      </div>
    </section>
  )
}
