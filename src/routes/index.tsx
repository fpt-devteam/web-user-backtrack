import { createFileRoute } from '@tanstack/react-router'
import { BacktrackHeader } from '@/components/shared/backtrack-header'
import { HeroSection } from '@/components/landing-page/hero-section'
import { CTASection } from '@/components/landing-page/cta-section'
import { HowItWorksSection } from '@/components/landing-page/how-it-work-section'
import { useState } from 'react'
import { Footer } from '@/components/landing-page/footer'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const [showScanner, setShowScanner] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      <BacktrackHeader />

      <section className="px-6 pb-8 text-center max-w-md mx-auto">
        <HeroSection />
        <CTASection
          showScanner={showScanner}
          onScannerToggle={setShowScanner}
        />
        <HowItWorksSection />
      </section>

      <Footer />
    </div>
  )
}
