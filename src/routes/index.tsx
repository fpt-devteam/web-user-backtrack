import { createFileRoute } from '@tanstack/react-router'
import { BacktrackHeader } from '@/components/shared/backtrack-header'
import { HeroSection } from '@/components/landing-page/hero-section'
import { OrgListSection } from '@/components/landing-page/org-list-section'
import { CTASection } from '@/components/landing-page/cta-section'
import { AiMatchingSection } from '@/components/landing-page/ai-matching-section'
import { HowItWorksSection } from '@/components/landing-page/how-it-work-section'
import { ProductShowcaseSection } from '@/components/landing-page/product-showcase-section'
import { Footer } from '@/components/landing-page/footer'
import { DownloadCtaSection } from '@/components/landing-page/download-cta-section'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="min-h-screen">
      <BacktrackHeader />
      <main>
        <HeroSection />
        <ProductShowcaseSection />
        <OrgListSection />
        <AiMatchingSection />
        <CTASection />
        <HowItWorksSection />
        <DownloadCtaSection />
      </main>
      <Footer />
    </div>
  )
}
