import { createFileRoute } from '@tanstack/react-router'
import { BacktrackHeader } from '@/components/shared/backtrack-header'
import { HeroSection } from '@/components/landing-page/hero-section'
import { CTASection } from '@/components/landing-page/cta-section'
import { HowItWorksSection } from '@/components/landing-page/how-it-work-section'
import { Footer } from '@/components/landing-page/footer'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <BacktrackHeader />
      <main>
        <HeroSection />
        <CTASection />
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  )
}
