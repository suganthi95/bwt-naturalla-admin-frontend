
// const data = [
//     { name: '2020', uv: 4000, pv: 2400, amt: 0 },
//     { name: '2021', uv: 3000, pv: 1398, amt: 5 },
//     { name: '2022', uv: 2000, pv: 9800, amt: 10 },
//     { name: '2023', uv: 2780, pv: 3908, amt: 15 },
//     { name: '2024', uv: 1890, pv: 4800, amt: 20 },
//   ];
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Rectangle,
  } from "recharts";
  
  const data = [
    { name: '2020', uv: 4000, pv: 2400, amt: 0 },
    { name: '2021', uv: 3000, pv: 1398, amt: 5 },
    { name: '2022', uv: 2000, pv: 9800, amt: 10 },
    { name: '2023', uv: 2780, pv: 3908, amt: 15 },
    { name: '2024', uv: 1890, pv: 4800, amt: 20 },
  ];
  
  export default function OverviewChartCard() {
    return (
      <div className="w-full p-2 md:p-4 border rounded-md flex flex-col">
        <h2 className="text-[#242424] font-bold mb-4 text-base sm:text-lg">
          Overview Cards
        </h2>
  
        <div className="w-full h-[250px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              {/* <CartesianGrid strokeDasharray="3 3" /> */}
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar
                dataKey="pv"
                fill="#F02800"
                activeBar={<Rectangle fill="pink" stroke="blue" />}
                barSize={20}
              />
              <Bar
                dataKey="uv"
                fill="#119E29"
                activeBar={<Rectangle fill="gold" stroke="purple" />}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
  