import React from "react";

const AdvancedSentimentSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col w-full p-4 border rounded-md border-slate-200 ">
      {/* Header Skeleton */}
      <div className="h-6 w-48 bg-slate-300 rounded mb-4" />

      <div className="flex flex-col sm:flex-row w-full justify-center items-center gap-6">
        {/* Positive Circle Skeleton */}
        <div className="relative w-60 h-60 rounded-full bg-slate-200 shadow-sm" />

        {/* Negative Circle Skeleton */}
        <div className="relative w-60 h-60 rounded-full bg-slate-200 shadow-sm" />
      </div>
    </div>
  );
};

export default AdvancedSentimentSkeleton;
