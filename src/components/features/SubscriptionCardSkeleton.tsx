import { Skeleton } from '@/components/ui/skeleton';

export function SubscriptionCardSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4 bg-card">
          {/* Top row skeleton */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-5 w-5 rounded" />
          </div>

          {/* Content skeleton - no image for subscriptions */}
          <div className="space-y-3">
            {/* Amount and Merchant Name */}
            <div>
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-5 w-32 mt-1" />
            </div>

            {/* Bottom section */}
            <div className="border-t mt-3 pt-3 -mx-4">
              <div className="flex justify-between text-sm px-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
