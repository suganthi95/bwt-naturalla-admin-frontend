export default function OverviewChartCardSkeleton() {
  return (
    <div className="w-full p-2 md:p-4 border rounded-md flex flex-col">
      {/* Title */}
      <div className="h-5 w-40 bg-slate-200 rounded mb-4" />

      {/* Chart Skeleton */}
      <div className="w-full h-[250px] sm:h-[300px] relative">
        <div className="absolute inset-0 flex items-end justify-between px-6 pb-6">
          {/* Bars */}
          {[80, 200, 60, 250, 70].map((height, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div
                className="w-5 bg-slate-300 rounded"
                style={{ height: `${height}px` }}
              />
              <div className="w-6 h-3 bg-slate-200 rounded mt-1" />
            </div>
          ))}
        </div>

     
      </div>

      {/* Legend Skeleton */}
      <div className="flex items-center gap-4 mt-4 px-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-slate-300" />
          <div className="w-20 h-3 bg-slate-200 rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-slate-300" />
          <div className="w-20 h-3 bg-slate-200 rounded" />
        </div>
      </div>
    </div>
  );
}
