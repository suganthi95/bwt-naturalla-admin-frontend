import { Badge } from "@/components/ui/badge";
import { Trans } from "react-i18next";

// const positiveInsights = [
//   "Efficient",
//   "Extensive",
//   "Customization",
//   "Curated",
//   "Excellent Selection",
// ];

// const negativeInsights = [
//   "Slow Delivery",
//   "Limited Support",
//   "High Cost",
//   "Complex Setup",
//   "Few Integrations",
// ];
 type Props = {
  positiveInsights:string[]
  negativeInsights:string[]
 }

export default function KeyInsights({negativeInsights,positiveInsights}:Props) {
  return (
    <div className="flex flex-col gap-6 w-full p-4 border rounded-lg">
      <h2 className="text-[#242424] text-lg md:text-balance  text-start font-bold mb-4 dark:text-white">
        <Trans i18nKey={'key_insights_section'}/>
      </h2>

      {/* Positive Section */}
      <div className="space-y-2 w-full">
        <div className="flex items-center gap-2">
          <div className="size-3 sm:size-4 bg-green-600 rounded-full" />
          <p className="text-sm font-medium text-[#727272] dark:text-gray-300">
            <Trans i18nKey={'positive'}/>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {positiveInsights.map((item, i) => (
            <Badge
              key={i}
              className="bg-green-600 dark:hover:bg-transparent text-white px-3 py-1 text-xs dark:text-white sm:text-sm rounded-full dark:bg-green-500"
            >
              {item}
            </Badge>
          ))}
        </div>
      </div>

      {/* Negative Section */}
      <div className="space-y-2 w-full">
        <div className="flex items-center gap-2">
          <div className="size-3 sm:size-4 bg-red-600 rounded-full dark:bg-red-500" />
          <p className="text-sm font-medium text-[#727272] dark:text-gray-300">
            <Trans i18nKey={'negative'}/>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {negativeInsights.map((item, i) => (
            <Badge
              key={i}
              className="bg-red-600 dark:hover:bg-transparent text-white px-3  py-1 text-xs sm:text-sm rounded-full dark:text-white/80 dark:bg-red-500"
            >
              {item}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
