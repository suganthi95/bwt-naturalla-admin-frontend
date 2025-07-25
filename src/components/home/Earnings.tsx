import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { LineChart } from "lucide-react";

type RevenueByMonth = {
  month: string;
  total_revenue: number;
};

interface Props {
  Data: RevenueByMonth[];
}

export default function Earnings({ Data }: Props) {
  if (!Array.isArray(Data)) return null;

  if (!Data) {
    return (
      <div className="bg-white p-4 rounded-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-primary-black">Earnings</h2>
        </div>
        <div className="flex flex-col items-center text-center py-16 opacity-60">
          <LineChart className="w-14 h-14 mb-4 text-gray-400" />
          <div className="text-lg font-medium text-gray-800">
            No Data Available
          </div>
          <div className="text-sm text-gray-500">
            There's currently no data to display.
          </div>
        </div>
      </div>
    );
  }
  const sortedData = Data?.map((item) => {
    const [month, year] = item.month.trim().split(/\s+/);
    return {
      label: `${month.slice(0, 3)} ${year}`,
      total: item.total_revenue,
      sortKey: new Date(`${month} 1, ${year}`).getTime(),
    };
  }).sort((a, b) => a.sortKey - b.sortKey);

  const labels = sortedData.map((item) => item.label);
  const values = sortedData.map((item) => item.total);

  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 1,
        columnWidth: "40%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: labels,
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    colors: ["#3B82F6", "#93C5FD"],
  };

  const chartSeries = [
    {
      name: "Revenue",
      data: values,
    },
  ];

  const totalRevenue = values.reduce((acc, curr) => acc + curr, 0);

  return (
    <div className="bg-white p-4 rounded-xl">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-primary-black">Earnings</h2>
      </div>
      <ul className="flex mt-4 space-x-5">
        <li>
          <p className="text-lead text-sm flex items-center gap-x-1">
            <div className="size-3 rounded-full bg-blue-600" />
            Revenue
          </p>
          <div className="flex items-center gap-x-3">
            <h2 className="text-[22px] font-bold">
              ₹ {totalRevenue.toLocaleString()}
            </h2>
            {/* <Icons.Grow />
            <p className="text-[#575864]">0.56%</p> */}
          </div>
        </li>
        {/* <li>
          <p className="text-lead text-sm flex items-center gap-x-1">
            <div className="size-3 rounded-full bg-[#D3E4FE]" />
            Revenue
          </p>
          <div className="flex items-center gap-x-3">
            <h2 className="text-[22px] font-bold">₹ {totalRevenue.toLocaleString()}</h2>
            <Icons.Grow />
            <p className="text-[#575864]">0.56%</p>
          </div>
        </li> */}
      </ul>
      <div className="w-full">
        <ReactApexChart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
}
