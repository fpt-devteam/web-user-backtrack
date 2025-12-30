import { Mail, User } from 'lucide-react'

interface ContactDetailsProps {
  email: string
  displayName: string | null
}

export function ContactDetails({ email, displayName }: ContactDetailsProps) {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 tracking-tight">
        Owner Contact Details
      </h3>
      <div className="space-y-3">
        {/* Display Name */}
        {displayName && (
          <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Owner Name</p>
              <p className="text-base font-semibold text-gray-900">{displayName}</p>
            </div>
          </div>
        )}

        {/* Email */}
        <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email</p>
            <p className="text-base font-semibold text-gray-900">{email}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
