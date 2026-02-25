export function SubscriptionSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-5 animate-pulse space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-6 w-40 rounded-full bg-gray-200" />
        <div className="h-5 w-16 rounded-full bg-gray-200" />
      </div>
      <div className="h-10 w-32 rounded-full bg-gray-200" />
      <div className="h-4 w-48 rounded-full bg-gray-200" />
      <div className="border-t border-gray-100 pt-4">
        <div className="h-3 w-28 rounded-full bg-gray-200 mb-3" />
        <div className="h-8 w-full rounded-xl bg-gray-200" />
      </div>
    </div>
  )
}
