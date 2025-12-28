import { MapPin, Briefcase, AlertTriangle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ItemCardProps {
  readonly name: string
  readonly id: string
  readonly imageUrl: string
  readonly location: string
}

export function ItemCard({ name, id, imageUrl, location }: ItemCardProps) {
  return (
    <Card className="p-6 mb-6 hover:shadow-lg transition-all duration-200">
      {/* Lost Item Badge */}
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="destructive" className="gap-2 text-sm font-semibold px-3 py-1.5">
          <AlertTriangle className="w-4 h-4" />
          Lost Item
        </Badge>
      </div>

      {/* Item Image */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden mb-4 shadow-inner">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Item Details */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">{name}</h3>
          <p className="text-sm text-gray-500 font-medium">ID: #{id}</p>
        </div>
        <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center shadow-sm">
          <Briefcase className="w-5 h-5 text-blue-600" />
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-lg">
        <MapPin className="w-4 h-4 text-blue-500" />
        <span className="text-sm font-medium">Last seen near {location}</span>
      </div>
    </Card>
  )
}
