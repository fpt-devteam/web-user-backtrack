import { createFileRoute } from '@tanstack/react-router'
import { ItemCard } from '@/components/found-item/ItemCard'
import { ContactDetails } from '@/components/found-item/ContactDetails'
import { NoteForm } from '@/components/found-item/NoteForm'
import { BacktrackHeader } from '@/shared/components/BacktrackHeader'

export const Route = createFileRoute('/found/$id/')({
  component: FoundItemDetails,
})

// Mock data - In a real app, this would come from an API based on the ID
const mockItems: Record<string, any> = {
  '829-442': {
    name: 'Blue Backpack',
    id: '829-442',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=987&auto=format&fit=crop',
    location: 'Central Park',
    owner: {
      email: 's***h@gmail.com',
      phone: '+1(5**) ***-8922',
    },
  },
}

function FoundItemDetails() {
  const { id } = Route.useParams()
  const item = mockItems[id] || mockItems['829-442'] // Fallback to default

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <BacktrackHeader />

      {/* Main Content */}
      <main className="px-6 py-6 max-w-md mx-auto">
        {/* Item Card */}
        <ItemCard
          name={item.name}
          id={item.id}
          imageUrl={item.imageUrl}
          location={item.location}
        />

        {/* Contact Details */}
        <ContactDetails
          email={item.owner.email}
          phone={item.owner.phone}
        />

        {/* Note Form */}
        <NoteForm itemId={id} />
      </main>
    </div>
  )
}
