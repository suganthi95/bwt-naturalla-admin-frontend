import { Badge } from "@/components/ui/badge"

const positiveInsights = [
  'Efficient',
  'Extensive',
  'Customization',
  'Curated',
  'Excellent Selection',
];

const negativeInsights = [
  'Slow Delivery',
  'Limited Support',
  'High Cost',
  'Complex Setup',
  'Few Integrations',
];

export default function KeyInsights() {
  return (
    <div className="flex flex-col gap-6 w-full p-4 border rounded-lg">
   <h2 className="text-[#242424] text-start font-bold mb-4">
            Key Insights
      </h2>

      {/* Positive Section */}
      <div className="space-y-2 w-full">
        <div className="flex items-center gap-2">
          <div className="size-3 sm:size-4  bg-[#119E29]" />
          <p className="text-sm font-medium text-[##727272]">Positive</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {positiveInsights.map((item, i) => (
            <Badge key={i} className="bg-[#119E29] text-white px-3 py-1 text-xs sm:text-sm rounded-full">
              {item}
            </Badge>
          ))}
        </div>
      </div>

      {/* Negative Section */}
      <div className="space-y-2 w-full">
        <div className="flex items-center gap-2">
          <div className="size-3 sm:size-4  bg-[#F02800]" />
          <p className="text-sm  font-medium text-[#727272] ">Negative</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {negativeInsights.map((item, i) => (
            <Badge key={i} className="bg-[#F02800] text-white px-3 py-1 text-xs sm:text-sm rounded-full">
              {item}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
