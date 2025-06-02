// components/InitialLoader.tsx
import { Loader2 } from "lucide-react";

const InitialLoader = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#fff] dark:bg-[#0B0F19]">
    <div className="flex items-center space-x-3">
      <Loader2 className="h-6 w-6 text-[#FD8809] animate-spin" />
      <h2 className="text-[#020817] dark:text-white text-lg font-semibold">Loading...</h2>
    </div>
    <p className="text-[#262222] dark:text-gray-400 mt-2 text-sm opacity-70">Please wait while we prepare everything for you.</p>
  </div>
  
  );
};

export default InitialLoader;
