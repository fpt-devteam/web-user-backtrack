import { AlertTriangle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ItemCardProps {
  readonly name: string
  readonly id: string
  readonly imageUrl: string
  readonly description: string
}

export function ItemCard({ name, id, imageUrl, description }: ItemCardProps) {
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
      <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{name}</h3>


      {/* Description */}
      {description && (
        <div className="text-gray-600 bg-gray-50 p-4 rounded-lg">
          <p className="text-sm leading-relaxed">{description}</p>
        </div>
      )}
    </Card>
  )
}
