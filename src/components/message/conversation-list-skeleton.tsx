import { Skeleton } from '@/components/ui/skeleton'

export function ConversationListSkeleton() {
  return (
    <div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-200">
          <Skeleton className="w-12 h-12 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-28 rounded" />
            <Skeleton className="h-3 w-36 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
