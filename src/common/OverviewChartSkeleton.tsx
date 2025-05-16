export default function OverviewChartSkeleton() {
  return (
    <div className="w-full p-2 md:p-4 border rounded-md flex flex-col">
      <div className="h-5 w-36 bg-gray-200 rounded mb-4" />

      <div className="w-full h-[250px] sm:h-[300px] flex items-end gap-2 px-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="w-6 bg-gray-300 rounded-sm" style={{ height: `${60 + i * 20}px` }} />
            <div className="w-6 h-2 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
