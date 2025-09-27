import { Skeleton } from '@/components/ui/skeleton';

export function OrganizationCardSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4 bg-card">
          {/* Top Row - Name and Actions */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-6 w-6 rounded" />
          </div>

          {/* Content */}
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>Role:</span>
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex items-center gap-2">
              <span>Email:</span>
              <Skeleton className="h-4 w-40" />
            </div>
            <div className="flex items-center gap-2">
              <span>Joined:</span>
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}