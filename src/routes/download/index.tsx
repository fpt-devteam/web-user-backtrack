import { createFileRoute } from '@tanstack/react-router'

import { DownloadCtaSection } from '@/components/landing-page/download-cta-section'

export const Route = createFileRoute('/download/')({
  component: DownloadAppPage,
})

function DownloadAppPage() {
  return (
    <div className="min-h-screen">

      <DownloadCtaSection />
    </div>
  )
}
