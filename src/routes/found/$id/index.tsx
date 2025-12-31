import { createFileRoute } from '@tanstack/react-router'
import { ItemCard } from '@/components/found-item/item-card'
import { ContactDetails } from '@/components/found-item/contact-detail'
import { BacktrackHeader } from '@/components/shared/backtrack-header'
import { useGetQrByPublicCode } from '@/hooks/use-qr'
import { StartChatButton } from '@/components/found-item/start-chat-button'
import { Skeleton } from '@/components/ui/skeleton'
import { InlineMessage } from '@/components/ui/inline-message'
import { getErrorMessage } from '@/lib/utils'
import { Card } from '@/components/ui/card'

export const Route = createFileRoute('/found/$id/')({
  component: FoundItemDetails,
})


function FoundItemDetails() {
  const { id } = Route.useParams()
  const { data, isLoading, error, isFetching } = useGetQrByPublicCode(id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <BacktrackHeader />

      {/* Main Content */}
      <main className="px-6 py-6 max-w-md mx-auto">
        {/* Loading State */}
        {(isLoading || isFetching) && (
          <>
            {/* Item Card Skeleton */}
            <Card className="p-6 mb-6">
              <Skeleton className="h-6 w-24 mb-4" />
              <Skeleton className="h-64 w-full rounded-xl mb-4" />
              <Skeleton className="h-8 w-48 mb-3" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </Card>

            {/* Contact Details Skeleton */}
            <Card className="p-6 mb-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-2/3" />
              </div>
            </Card>

            {/* Button Skeleton */}
            <Skeleton className="h-12 w-full rounded-lg" />
          </>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <InlineMessage variant="error" title="Error Loading Item">
            {getErrorMessage(error)}
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
