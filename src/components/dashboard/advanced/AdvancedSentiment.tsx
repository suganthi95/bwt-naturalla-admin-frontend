import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

type Props = {
  value1: number; // between 0 and 1
  value2: number; // between 0 and 1
};

const COLORS = ["#605BFF", "#E5E7EB"];
const COLORS2 = ["#FFC327", "#E5E7EB"];


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
  <h2 className="text-[#242424] text-start font-bold mb-4 text-base sm:text-lg">
    Sentiment Distribution Chart
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
</div>

  );
};

export default AdvancedSentiment;
