export function TicketDetailSkeleton() {
  return (
    <div className="col-span-2 w-full mx-auto bg-white dark:bg-slate-900 shadow rounded-lg space-y-6 animate-pulse">
      <div className="border-b">
        <div className="flex p-6 items-center justify-between pb-3">
          <div className="h-5 w-2/3 bg-gray-200 dark:bg-slate-700 rounded" />
          <div className="h-6 w-24 bg-yellow-200 rounded-full" />
        </div>
      </div>

      <div className="space-y-2 border-b pb-4">
        <div className="flex p-4 items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-slate-700" />
            <div className="space-y-2">
              <div className="h-4 w-40 bg-gray-200 dark:bg-slate-700 rounded" />
              <div className="h-3 w-32 bg-gray-200 dark:bg-slate-700 rounded" />
            </div>
          </div>
          <div className="h-4 w-28 bg-gray-200 dark:bg-slate-700 rounded" />
        </div>
      </div>

      <div className="p-4 space-y-2">
        <div className="h-4 w-24 bg-gray-300 dark:bg-slate-600 rounded" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-200 dark:bg-slate-700 rounded" />
          <div className="h-3 w-11/12 bg-gray-200 dark:bg-slate-700 rounded" />
          <div className="h-3 w-3/4 bg-gray-200 dark:bg-slate-700 rounded" />
        </div>
      </div>
      <div className="space-y-3 p-4">
        <div className="space-y-1">
          <div className="h-4 w-24 bg-gray-300 dark:bg-slate-600 rounded" />
          <div className="h-24 w-full bg-gray-100 dark:bg-slate-800 rounded" />
        </div>

        <div className="flex items-center justify-between">
          <div className="h-10 w-[180px] bg-gray-200 dark:bg-slate-700 rounded-md" />
          <div className="h-10 w-24 bg-gray-300 dark:bg-slate-600 rounded-md" />
        </div>
      </div>
    </div>
  );
}
