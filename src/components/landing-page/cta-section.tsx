import React from 'react'
import { Printer, Bell, QrCode } from 'lucide-react'

interface FeatureCardProps {
  icon: React.ElementType
  label: string
}

const DIGITAL_ID_FEATURES: FeatureCardProps[] = [
  { icon: Printer, label: 'Unlimited Print' },
  { icon: Bell, label: 'Instant Alert' },
]

function FeatureCard({ icon: Icon, label }: FeatureCardProps) {
  return (
    <div className="bg-gray-50 hover:bg-gray-100 transition-colors duration-200 rounded-2xl p-4 flex flex-col items-center gap-2.5 cursor-default">
      <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-sm">
        <Icon className="w-5 h-5 text-blue-500" />
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
  )
}

export function CTASection() {
  return (
    <section className="px-5 lg:px-10 pb-5 lg:pb-8 w-full max-w-md lg:max-w-screen-xl mx-auto">
      <div className="bg-white rounded-3xl p-6 lg:p-10 shadow-sm border border-gray-100 lg:flex lg:gap-12 lg:items-start">

        {/* Left: icon + text */}
        <div className="lg:flex-1">
          <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
            <QrCode className="w-5 h-5 text-gray-500" />
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
            Your Item's Digital ID
          </h2>
          <p className="text-gray-500 text-sm lg:text-base leading-relaxed lg:mb-0 mb-5">
            Customizable QR codes with unlimited printing. Get instant notifications
            when your item is scanned anywhere in the world.
          </p>
        </div>

        {/* Right: feature cards */}
        <div className="grid grid-cols-2 gap-3 lg:w-60 lg:flex-shrink-0">
          {DIGITAL_ID_FEATURES.map((feat) => (
            <FeatureCard key={feat.label} {...feat} />
          ))}
        </div>

      </div>
    </section>
  )
}
