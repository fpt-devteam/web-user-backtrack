import { createFileRoute } from '@tanstack/react-router'
import { ItemCard } from '@/components/found-item/item-card'
import { ContactDetails } from '@/components/found-item/contact-detail'
import { BacktrackHeader } from '@/components/shared/backtrack-header'
import { useGetQrByPublicCode } from '@/hooks/use-qr'
import { StartChatButton } from '@/components/found-item/start-chat-button'
import { Spinner } from '@/components/ui/spinner'
import { InlineMessage } from '@/components/ui/inline-message'

export const Route = createFileRoute('/found/$id/')({
  component: FoundItemDetails,
})


function FoundItemDetails() {
  const { id } = Route.useParams()
  const { data, isLoading, error, refetch, isFetching } = useGetQrByPublicCode(id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <BacktrackHeader />

      {/* Main Content */}
      <main className="px-6 py-6 max-w-md mx-auto">
        {/* Loading State */}
        {(isLoading || isFetching) && (
          <Spinner size="md" />
        )}

        {/* Error State */}
        {error && (
          <InlineMessage variant="error" title="Error Loading Item">
            <p>There was an error loading the item details. Please try again.</p>
          </InlineMessage>
        )}


        {/* Data Loaded */}
        {data && (
          <>
            {/* Item Card */}
            <ItemCard
              name={data.item.name}
              id={data.qrCode.publicCode}
              imageUrl={data.item.imageUrls[0]}
              description={data.item.description}
            />

            {/* Contact Details */}
            <ContactDetails
              email={data.owner.email}
              displayName={data.owner.displayName}
            />

            {/* Start Chat Button */}
            <StartChatButton partnerId={data.owner.id} itemName={data.item.name} />
          </>
        )}

      </main>
    </div>
  )
}
