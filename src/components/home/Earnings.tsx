import { Icons } from '@/assets/icons'
import { Ellipsis } from 'lucide-react'
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

export default function Earnings() {
     const chartOptions:ApexOptions = {
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
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ],
    },
     yaxis: {
    labels: {
      show: false, 
    },
  },
    
    colors: ["#3B82F6","#93C5FD"], 
  };

  const chartSeries = [
   
      {
      name: "Sales",
      data: [200, 100, 300, 100, 200, 50, 250, 130, 320, 420, 50, 250],
    },
     {
      name: "Sales",
      data: [400, 300, 500, 200, 600, 350, 450, 300, 400, 500, 250, 550],
    },
  ];
  return (
    <div className='bg-white p-4 rounded-xl'>
        <div className='flex items-center justify-between'>
            <h2 className='font-semibold text-primary-black'>Earnings</h2>
            <Ellipsis/>
        </div>
        <ul className='flex mt-4 space-x-5'>
            <li>
                <p className='text-lead text-sm flex items-center gap-x-1'> <div className='size-3 rounded-full bg-blue-600'></div> Revenue </p>
                <div className='flex items-center gap-x-3'>
                    <h2 className='text-[22px] font-bold '>₹ 37,802</h2>
                    <Icons.Grow/>
                    <p className='text-[#575864]'>0.56%</p>
                </div>
            </li>
             <li>
                <p className='text-lead text-sm items-center flex gap-x-1'> <div className='size-3 rounded-full bg-[#D3E4FE]'></div> Revenue </p>
                <div className='flex items-center gap-x-3'>
                    <h2 className='text-[22px] font-bold '>₹ 37,802</h2>
                    <Icons.Grow/>
                    <p className='text-[#575864]'>0.56%</p>
                </div>
            </li>
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
  )
}
