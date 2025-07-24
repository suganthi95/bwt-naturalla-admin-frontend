import { Skeleton } from "@/components/ui/skeleton";

export function ReviewListSkeleton() {
  return (
    <ul className="pt-4 space-y-6">
      {[...Array(4)].map((_, index) => (
        <li
          key={index}
          className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
        >
          <div className="flex gap-x-4">
            <Skeleton className="w-24 h-24 rounded-md" />
            <div className="w-full space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>

              <div className="flex items-center gap-2 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="w-5 h-5 rounded" />
                ))}
              </div>

              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />

              <div className="flex items-center gap-2 mt-2">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
