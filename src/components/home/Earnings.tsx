import { Ellipsis } from "lucide-react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

type RevenueByMonth = {
  month: string;           
  total_revenue: number;   
};

interface Props {
  Data: RevenueByMonth[];
}

export default function Earnings({ Data }: Props) {
 if (!Array.isArray(Data)) return null;

  const sortedData = Data?.map((item) => {
      const [month, year] = item.month.trim().split(/\s+/);
      return {
        label: `${month.slice(0, 3)} ${year}`,
        total: item.total_revenue,
        sortKey: new Date(`${month} 1, ${year}`).getTime(),
      };
    })
    .sort((a, b) => a.sortKey - b.sortKey);

  

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
        <Ellipsis />
      </div>
      <ul className="flex mt-4 space-x-5">
        <li>
          <p className="text-lead text-sm flex items-center gap-x-1">
            <div className="size-3 rounded-full bg-blue-600" />
            Revenue
          </p>
          <div className="flex items-center gap-x-3">
            <h2 className="text-[22px] font-bold">₹ {totalRevenue.toLocaleString()}</h2>
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
