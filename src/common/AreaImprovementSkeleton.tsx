export default function AreaImprovementSkeleton() {
  return (
    <div className="flex flex-col w-full p-4 border rounded-md border-slate-200">
      <div className="h-6 w-48 bg-slate-300 rounded mb-4" />

      <div className="w-full mx-auto flex flex-col items-center gap-4 p-4">
        {/* Circular Skeleton (Pie Chart Placeholder) */}
        <div className="w-72 h-72 rounded-full bg-slate-200" />

        {/* Legend Skeleton */}
        <div className="flex flex-wrap md:flex-nowrap items-start justify-start md:justify-center gap-x-4 md:items-center w-full">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm bg-slate-300" />
              <div className="h-4 w-44 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
