import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ImprovementContent() {
  const improvementData = {
    billing: {
      title: "1. Billing Counter Management:",
      points: [
        "Response time is slow on mobile.",
        "Navigation can be confusing.",
        "Content needs better categorization.",
        "Server and Technical Issues: Address server and technical issues promptly to avoid delays and improve customer satisfaction.",
        "Customer Feedback Management: Implement a system for managing and addressing customer feedback to improve service quality and address customer concerns.",
      ],
    },
    staffing: {
      title: "2. Staffing Issues:",
      points: [
        "Insufficient staff during peak hours.",
        "Staff training on customer service needs improvement.",
      ],
    },
    cleanliness: {
      title: "3. Cleanliness:",
      points: [
        "Restrooms require more frequent cleaning.",
        "Waste bins are overflowing in public areas.",
      ],
    },
    collection: {
      title: "4. Collection Process:",
      points: [
        "Collection counters need better signage.",
        "Long queues during peak times.",
      ],
    },
  };

  return (
    <div className="w-full p-4 border rounded-md">
      <Tabs defaultValue="billing">
        <TabsList className="mb-4 grid gap-x-3 dark:bg-transparent  dark:border px-2 grid-cols-4 h-11  ">
          <TabsTrigger value="billing"  className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary    rounded  data-[state=active]:text-white ">Billing</TabsTrigger>
          <TabsTrigger value="staffing" className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary  rounded data-[state=active]:text-white">Staffing</TabsTrigger>
          <TabsTrigger value="cleanliness" className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary  rounded  data-[state=active]:text-white">Cleanliness</TabsTrigger>
          <TabsTrigger value="collection" className="data-[state=active]:bg-primary dark:data-[state=active]:bg-primary  rounded data-[state=active]:text-white">Collection</TabsTrigger>
        </TabsList>

        {Object.entries(improvementData).map(([key, data]) => (
          <TabsContent key={key} value={key}>
            <h2 className="text-sm font-semibold dark:text-white  text-[#242424] mb-1">
              Area of Improvement
            </h2>
            <h3 className="text-[#242424] dark:text-white  font-bold text-base mb-4">
              {data.title}
            </h3>
            <ul className="list-disc list-inside dark:text-slate-300  space-y-2 text-neutral-700 text-sm">
              {data.points.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
