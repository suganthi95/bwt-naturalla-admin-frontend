export default function ImprovementContentSkeleton() {
  return (
    <div className="w-full p-4 border rounded-md">
      <div className="h-4 w-40 bg-slate-200 rounded mb-2" />
      <div className="h-5 w-64 bg-slate-300 rounded mb-4" />

      <ul className=" space-y-3">
        {[...Array(4)].map((_, index) => (
          <li key={index}>
            <div className="h-4 bg-slate-200 rounded w-full max-w-[90%]" />
          </li>
        ))}
      </ul>
    </div>
  );
}
