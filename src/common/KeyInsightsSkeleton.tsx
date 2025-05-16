export default function KeyInsightsSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full p-4 border rounded-lg border-slate-200">
      {/* Title Skeleton */}
      <div className="h-6 w-32 bg-slate-300 rounded" />

      {/* Positive Section */}
      <div className="space-y-2 w-full">
        <div className="flex items-center gap-2">
          <div className="size-3 sm:size-4 bg-slate-300 rounded-full" />
          <div className="h-4 w-20 bg-slate-300 rounded" />
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-6 w-24 bg-slate-300 rounded-full" />
          ))}
        </div>
      </div>

      {/* Negative Section */}
      <div className="space-y-2 w-full">
        <div className="flex items-center gap-2">
          <div className="size-3 sm:size-4 bg-slate-300 rounded-full" />
          <div className="h-4 w-20 bg-slate-300 rounded" />
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-6 w-28  bg-slate-300 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
