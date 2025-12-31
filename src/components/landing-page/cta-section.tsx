import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { QRScanner } from '@/components/qr-scanner/qr-scanner'

interface CTASectionProps {
  readonly showScanner: boolean
  readonly onScannerToggle: (show: boolean) => void
}

export function CTASection({ showScanner, onScannerToggle }: CTASectionProps) {
  return (
    <div className="mb-12">
      {showScanner ? (
        <QRScanner onClose={() => onScannerToggle(false)} />
      ) : (
        <div className="space-y-4">
          <Button
            onClick={() => onScannerToggle(true)}
            size="lg"
            className="w-full max-w-sm h-14 rounded-full text-base font-semibold shadow-lg mx-auto block items-center justify-center"
          >
            {/* <ScanLine className="w-15 h-15" /> */}
            Scan BackTrack QR Code
          </Button>
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
      )}
    </div>
  )
}
