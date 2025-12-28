import { createFileRoute, Link } from '@tanstack/react-router'
import { Lock, QrCode, ScanLine, Shield, } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BacktrackHeader } from '@/shared/components/BacktrackHeader'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const steps = [
    {
      icon: <ScanLine className="w-6 h-6 text-blue-500" />,
      title: 'Scan or Report',
      description:
        'Scan the QR code on the item to notify the owner instantly.',
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-500" />,
      title: 'Connect Safely',
      description:
        'Chat securely to arrange a return. We never share your phone number.',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <BacktrackHeader />

      {/* Hero Section */}
      <section className="px-6 pb-8 text-center max-w-md mx-auto">
        {/* Illustration */}
        <div className="mb-8">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiUUWkYYL-YycAwX4u5TdCbmn9Z-t77l3qW6tvMbkzIweQrkK22Ni0idf-vf_vluQ73lw6e4E-uWyynyQ5kg4DY3X-jmXRGPHkXACI46YZIg57yTECuN8FLP5uKMnok0eXRsDg21K2TL9GjlfYgz1jZXBh7lavZbyBo3QB61Sx7xZ-a2IKpJZYfJUqk5KQMUB4oIaFjVNQQm9gZ1DKq4wkPSDH6y7F5FuuT6v4qfzi79XWee0AuqsSV_qrxfxTwpw6xZVspD_67wgH"
            alt="Two hands protecting an item"
            className="w-full max-w-sm mx-auto rounded-3xl shadow-lg hover:shadow-xl transition-shadow"
          />
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight tracking-tight">
          You Found Something!
        </h2>
        <p className="text-base text-gray-600 leading-relaxed mb-8 font-medium">
          Thank you for being a good samaritan. Let us help you return this item
          safely.
        </p>

        {/* CTA Buttons */}
        <div className="space-y-4 mb-12">
          <Link to="/found/$id" params={{ id: '829-442' }} className="block">
            <Button
              size="lg"
              className="w-full max-w-sm h-14 rounded-full text-base font-semibold shadow-lg mx-auto"
            >
              <QrCode className="w-5 h-5" />
              Scan BackTrack QR Code
            </Button>
          </Link>
          <Link to="/download" className="block">
            <Button
              variant="outline"
              size="lg"
              className="w-full max-w-sm h-14 rounded-full text-base font-semibold mx-auto block"
            >
              Report Item (No QR Code)
            </Button>
          </Link>
        </div>

        {/* How it works Section */}
        <Card className="bg-gradient-to-br from-gray-50 to-white p-8 mb-8 border-2 border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-left tracking-tight">
            How it works
          </h3>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center shadow-sm">
                  {step.icon}
                </div>
                <div className="flex-1 text-left">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1 tracking-tight">
                    {step.title}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Privacy Note */}
          <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-center gap-2 text-sm text-gray-600 bg-white py-3 px-4 rounded-xl">
            <Lock className="w-4 h-4 text-blue-500" />
            <span className="font-medium">Your privacy is our priority.</span>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center">
        <div className="flex items-center justify-center gap-8 mb-4 text-sm text-gray-600">
          <a href="/privacy" className="hover:text-gray-900 transition-colors">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-gray-900 transition-colors">
            Terms of Service
          </a>
        </div>
        <p className="text-xs text-gray-500">
          © 2024 BackTrack Inc. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
