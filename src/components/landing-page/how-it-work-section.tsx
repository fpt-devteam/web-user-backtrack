import { Lock, ScanLine, Shield } from 'lucide-react'
import { Card } from '@/components/ui/card'

const steps = [
  {
    id: 'scan-or-report',
    icon: <ScanLine className="w-6 h-6 text-blue-500" />,
    title: 'Scan or Report',
    description: 'Scan the QR code on the item to notify the owner instantly.',
  },
  {
    id: 'connect-safely',
    icon: <Shield className="w-6 h-6 text-blue-500" />,
    title: 'Connect Safely',
    description:
      'Chat securely to arrange a return. We never share your phone number.',
  },
]

export function HowItWorksSection() {
  return (
    <Card className="bg-gradient-to-br from-gray-50 to-white p-8 mb-8 border-2 border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6 text-left tracking-tight">
        How it works
      </h3>

      <div className="space-y-6">
        {steps.map((step) => (
          <div key={step.id} className="flex items-start gap-4">
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
  )
}
