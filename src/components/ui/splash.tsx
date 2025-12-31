import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface SplashProps {
  onComplete?: () => void
  duration?: number
  className?: string
}

export function Splash({ onComplete, duration = 20500, className }: SplashProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isFadingOut, setIsFadingOut] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true)
    }, duration - 500)

    const completeTimer = setTimeout(() => {
      setIsVisible(false)
      onComplete?.()
    }, duration)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(completeTimer)
    }
  }, [duration, onComplete])

  if (!isVisible) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-primary/70 transition-opacity duration-500',
        isFadingOut && 'opacity-0',
        className
      )}
    >
      <div className="relative flex flex-col items-center gap-8">
        {/* Animated circles background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute h-32 w-32 animate-ping rounded-full bg-white/10" />
          <div className="absolute h-48 w-48 animate-pulse rounded-full bg-white/5" />
        </div>

        {/* Logo/Brand */}
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="flex items-center justify-center">
            <div className="relative">
              {/* Animated logo container */}
              <div className="animate-bounce-slow">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white shadow-2xl">
                  <svg
                    className="h-16 w-16 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Glowing effect */}
              <div className="absolute inset-0 -z-10 animate-pulse rounded-2xl bg-white/20 blur-xl" />
            </div>
          </div>

          {/* App name */}
          <h1 className="animate-fade-in text-4xl font-bold tracking-tight text-white">
            Backtrack
          </h1>

          <p className="animate-fade-in-delay text-lg text-white/80">
            Find what matters
          </p>
        </div>

        {/* Loading indicator */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="flex gap-2">
            <div className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.3s]" />
            <div className="h-2 w-2 animate-bounce rounded-full bg-white [animation-delay:-0.15s]" />
            <div className="h-2 w-2 animate-bounce rounded-full bg-white" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.3s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}

// Simple variant without auto-close
export function SplashScreen({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600',
        className
      )}
    >
      <div className="relative flex flex-col items-center gap-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute h-32 w-32 animate-ping rounded-full bg-white/10" />
          <div className="absolute h-48 w-48 animate-pulse rounded-full bg-white/5" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white shadow-2xl">
            <svg
              className="h-16 w-16 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white">
            Backtrack
          </h1>
        </div>

        <div className="relative z-10">
          <div className="h-1 w-48 overflow-hidden rounded-full bg-white/20">
            <div className="h-full w-1/2 animate-loading-bar rounded-full bg-white" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes loading-bar {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(300%);
          }
        }

        .animate-loading-bar {
          animation: loading-bar 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
