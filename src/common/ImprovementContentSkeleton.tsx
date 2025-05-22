import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ImprovementContentSkeleton() {
  return (
    <div className="w-full p-4 border rounded-md">
      <Tabs defaultValue="">
        <TabsList className="mb-4 grid gap-x-3 dark:bg-transparent dark:border px-2 grid-cols-4 h-11">
          <TabsTrigger
            value="billing"
            className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary rounded data-[state=active]:text-white"
          >
            {/* Tab label placeholder */}
            <div className="h-4 w-16 bg-slate-300 dark:bg-slate-600 rounded" />
          </TabsTrigger>
          <TabsTrigger
            value="staffing"
            className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary rounded data-[state=active]:text-white"
          >
            <div className="h-4 w-16 bg-slate-300 dark:bg-slate-600 rounded" />
          </TabsTrigger>
          <TabsTrigger
            value="cleanliness"
            className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary rounded data-[state=active]:text-white"
          >
            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-600 rounded" />
          </TabsTrigger>
          <TabsTrigger
            value="collection"
            className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary rounded data-[state=active]:text-white"
          >
            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-600 rounded" />
          </TabsTrigger>
        </TabsList>

        {["billing", "staffing", "cleanliness", "collection"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="space-y-4">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 w-48 rounded" />
              <div className="h-5 bg-slate-200 dark:bg-slate-600 w-72 rounded" />
              <ul className="space-y-2 mt-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <li
                    key={index}
                    className="h-4 bg-slate-200 dark:bg-slate-600 w-full rounded"
                  />
                ))}
              </ul>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
