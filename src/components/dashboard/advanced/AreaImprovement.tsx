import { Trans } from "react-i18next";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Store Layout Optimization: 30% implemented", value: 30 },
  { name: "Technical Issues: 50% addressed", value: 30 },
  { name: "Billing Counter Management: 30% resolved", value: 40 },
];

// const COLORS = ["#EAB308", "#5687F2", "#EA3A88"];
const COLORS = ["#119E29", "#F02800", "#EAB308"];



export default function AreaImprovement() {
  return (
    <div className="flex flex-col  w-full p-4 border justify-start items-start">
      <h2 className="text-[#242424] text-start font-bold mb-4 dark:text-white">     <Trans i18nKey={'areas_for_improvements'}/>
    </h2>

    <div className="w-full  mx-auto flex flex-col items-center gap-4 p-4">
     

      {/* Pie Chart */}
      <div className="w-72 h-72 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              innerRadius={90}
              outerRadius={140} // bigger border
              paddingAngle={0}
              stroke="none"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
   
      </div>
      <div className="flex flex-wrap md:flex-nowrap items-start  justify-start md:justify-center gap-x-4 md:items-center w-full">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-sm"
              style={{ backgroundColor: COLORS[index] }}
            />
            <span className="text-sm text-neutral-700 font-medium dark:text-slate-300">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
