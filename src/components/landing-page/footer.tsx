export function Footer() {
  return (
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
  )
}
