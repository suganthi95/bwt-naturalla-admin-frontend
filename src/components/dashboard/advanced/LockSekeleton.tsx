
export default function LockSekeleton() {
  return (
    <div className="flex flex-col gap-8 p-4 w-full animate-pulse">
      {/* Top Section: 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Sentiment Circles */}
        <div className="flex flex-wrap gap-6 justify-start items-center">
          {[1, 2].map((i) => (
            <div key={i} className="w-40 h-40 relative">
              <div className="rounded-full w-full h-full border-[10px] border-gray-300"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-6 w-10 bg-gray-300 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Key Insights Skeleton */}
        <div className="flex flex-col gap-6 w-full p-4 border rounded-md">
          <div className="h-6 w-32 bg-gray-300 rounded" />
          {[1, 2].map((row) => (
            <div key={row} className="space-y-3">
              <div className="flex items-center gap-x-2">
                <div className="size-4 rounded-sm bg-gray-300" />
                <div className="h-4 w-20 bg-gray-300 rounded" />
              </div>
              <div className="flex gap-2 flex-wrap">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-6 w-24 bg-gray-300 rounded-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Area Improvement Skeleton - Solo Full Width */}
      <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
        <div className="flex gap-6 justify-center flex-wrap">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 rounded-sm" />
              <div className="h-4 w-20 bg-gray-300 rounded" />
            </div>
          ))}
        </div>

        <div className="w-64 h-64 relative">
          <div className="rounded-full w-full h-full border-[20px] border-gray-300"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-6 w-12 bg-gray-300 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
