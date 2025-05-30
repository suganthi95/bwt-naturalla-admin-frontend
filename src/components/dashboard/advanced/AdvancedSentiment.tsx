import React from "react";
import { Trans } from "react-i18next";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

type Props = {
  value1: number; // between 0 and 1
  value2: number; // between 0 and 1
};

const COLORS = ["#119E29", "#E5E7EB"]; // Green + Gray
const COLORS2 = ["#F02800", "#E5E7EB"]; // Red + Gray

const createChartData = (value: number) => {
  const percentage = Math.min(Math.max(value, 0), 1) * 100;
  return [
    { name: "Filled", value: percentage },
    { name: "Remaining", value: 100 - percentage },
  ];
};

const AdvancedSentiment: React.FC<Props> = ({ value1, value2 }) => {
  const data1 = createChartData(value1);
  const data2 = createChartData(value2);

  return (
    <div className="flex flex-col w-full p-4 border rounded-md">
      <h2 className="text-[#242424] text-start font-bold mb-4 dark:text-white text-base sm:text-lg">
     <Trans i18nKey={'sentiment_distribution'}/>
      </h2>

      <div className="flex flex-col sm:flex-row w-full justify-center items-center gap-6">
        {/* Positive Circle */}
        <div className="relative w-60 h-60 sm:w-72 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data1}
                innerRadius={90}
                outerRadius={120}
                dataKey="value"
                startAngle={-40}
                endAngle={-410}
                isAnimationActive={false}
              >
                {data1.map((_, index) => (
                  <Cell
                    key={`pie1-${index}`}
                    fill={index === 0 ? COLORS[0] : COLORS[1]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl sm:text-3xl font-bold text-[#00C49F]">
              {Math.round(value1 * 100)}%
            </span>
          </div>
        </div>

        {/* Negative Circle */}
        <div className="relative w-60 h-60 sm:w-72 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data2}
                innerRadius={90}
                outerRadius={120}
                dataKey="value"
                startAngle={-40}
                endAngle={-410}
                isAnimationActive={false}
              >
                {data2.map((_, index) => (
                  <Cell
                    key={`pie2-${index}`}
                    fill={index === 0 ? COLORS2[0] : COLORS[1]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl sm:text-3xl font-bold text-[#FF8042]">
              {Math.round(value2 * 100)}%
            </span>
          </div>
        </div>
      </div>

     
      <div className="mt-6 flex justify-center gap-8 flex-wrap text-sm sm:text-base">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-[#119E29]" />
          <span className="text-neutral-700 text-sm dark:text-neutral-200">Positive Sentiment</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-[#F02800]" />
          <span className="text-neutral-700 text-sm dark:text-neutral-200">Negative Sentiment</span>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSentiment;
