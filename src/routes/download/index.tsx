import { createFileRoute } from '@tanstack/react-router'
import { Smartphone, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BacktrackHeader } from '@/components/shared/backtrack-header'

export const Route = createFileRoute('/download/')({
  component: DownloadAppPage,
})

function DownloadAppPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <BacktrackHeader />

      {/* Main Content */}
      <section className="px-6 py-8 text-center max-w-md mx-auto">
        {/* Hero Illustration */}
        <Card className="mb-8 p-8 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 hover:shadow-lg transition-shadow">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgJyeq2mYayyc4JcfsQfOwdadMwL4va0AKQeuwGKwKEgFdn6AiRYoUXtKmFX2vgz-PjWVzVyrlttmIm3f9zGS3BZwJeT_q-GTINiAoS9q9P_sMo6s4hdYLrhJY63VNHY-NbDrTeFf7_WLfzuAQKp9KaOFblWvG3uQzE75QBywSsAN79ljT6VEaylUD4OKM2gPx43DA581DEvCk9L_f1Rfi0V_IKMeu711WK_-ae0Vgk_ZEmBbSr-bGdVV1SKWGMx2kZq8bFg5EUWNS"
            alt="Secure phone illustration"
            className="w-full max-w-sm mx-auto hover:scale-105 transition-transform duration-300"
          />
        </Card>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
          Get the App to Report Found Items
        </h2>

        {/* Description */}
        <p className="text-base text-gray-600 leading-relaxed mb-8 px-2 font-medium">
          For secure reporting and owner communication, please download the
          BackTrack app. It keeps your data safe while helping items find their
          way home.
        </p>

        {/* App Store Buttons */}
        <div className="space-y-4 mb-8">
          <Button
            asChild
            size="lg"
            className="w-full max-w-sm h-14 rounded-full text-base font-semibold shadow-lg mx-auto"
          >
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Smartphone className="w-6 h-6" />
              <span>Download on the App Store</span>
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            className="w-full max-w-sm h-14 rounded-full text-base font-semibold shadow-lg mx-auto"
          >
            <a
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
              <span>Get it on Google Play</span>
            </a>
          </Button>
        </div>

        {/* Privacy Section */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Lock className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-gray-900 tracking-wide">
              PRIVACY GUARANTEED
            </h3>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed font-medium">
            We process your data securely. Your location is never shared publicly
            without your explicit consent.
          </p>
        </Card>
      </section>
    </div>
  )
}
