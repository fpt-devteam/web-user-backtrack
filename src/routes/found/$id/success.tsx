import { createFileRoute, Link } from '@tanstack/react-router'
import { MailCheck, MessageCircle, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BacktrackHeader } from '@/shared/components/BacktrackHeader'

export const Route = createFileRoute('/found/$id/success')({
  component: SuccessPage,
})

function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <BacktrackHeader />

      {/* Main Content */}
      <main className="px-6 py-12 max-w-md mx-auto text-center">
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center shadow-lg">
            <MailCheck className="w-16 h-16 text-blue-600" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
          Note Sent to Owner!
        </h1>

        <p className="text-base text-gray-600 leading-relaxed mb-12 font-medium max-w-sm mx-auto">
          The owner has received your note and location (if shared). They will
          contact you via the app.
        </p>

        {/* Start Chat Card */}
        <Button
          size="lg"
          className="w-full h-14 mb-8 rounded-full text-base font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <MessageCircle className="w-5 h-5" />
          Start Anonymous Chat
        </Button>

        {/* Privacy Message */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-white py-4 px-6 rounded-xl">
          <Shield className="w-4 h-4 text-blue-500" />
          <span className="font-medium">Your privacy is our priority.</span>
        </div>

        {/* Back to Home Link */}
        <Link
          to="/"
          className="inline-block mt-8 text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          Return to Home
        </Link>
      </main>
    </div>
  )
}
