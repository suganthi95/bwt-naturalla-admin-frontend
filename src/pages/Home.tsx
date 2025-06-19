import { Icons } from "@/assets/icons";
import Earnings from "@/components/home/Earnings";
import OrdersLists from "@/components/home/OrdersLists";
import ProductOverview from "@/components/home/ProductOverview";
import TopComments from "@/components/home/TopComments";
import { Card } from "@/components/ui/card";

function Home() {
  return (
    <div className="flex flex-col p-4 gap-3 md:p-2 w-full h-screen overflow-y-scroll md:pb-20 bg-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
        <Card className="p-3 rounded-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
          <Icons.Order/>
          <div className="flex items-center gap-x-2">
            <Icons.Grow/>
            <span className="text-[#94A3B8] text-sm font-bold">1.56%</span>
          </div>
            </div>
            <div className="flex flex-row items-center justify-between">
              <h1 className="text-sm font-medium text-slate-500">
                Total Orders
              </h1>
              <p className="text-lg text-secondary font-bold text-primary-black">18,098</p>
            </div>
          </div>
        </Card>
      <Card className="p-3 rounded-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
          <Icons.Sales/>
          <div className="flex items-center gap-x-2">
            <Icons.Grow/>
            <span className="text-[#94A3B8] text-sm font-bold">1.56%</span>
          </div>
            </div>
            <div className="flex flex-row items-center justify-between">
              <h1 className="text-sm font-medium text-slate-500">
               Total Sales
              </h1>
              <p className="text-lg text-secondary font-bold text-primary-black">18,098</p>
            </div>
          </div>
        </Card>
           <Card className="p-3 rounded-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
          <Icons.Icome/>
          <div className="flex items-center gap-x-2">
            <Icons.Loss/>
            <span className="text-[#94A3B8] text-sm font-bold">1.56%</span>
          </div>
            </div>
            <div className="flex flex-row items-center justify-between">
              <h1 className="text-sm font-medium text-slate-500">
              Total Income
              </h1>
              <p className="text-lg text-secondary font-bold text-primary-black">18,098</p>
            </div>
          </div>
        </Card>
          <Card className="p-3 rounded-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
          <Icons.Product/>
          <div className="flex items-center gap-x-2">
            <Icons.Grow/>
            <span className="text-[#94A3B8] text-sm font-bold">1.56%</span>
          </div>
            </div>
            <div className="flex flex-row items-center justify-between">
              <h1 className="text-sm font-medium text-slate-500">
             Sales by Product
              </h1>
              <p className="text-lg text-secondary font-bold text-primary-black">18,098</p>
            </div>
          </div>
        </Card>


          <Card className="p-3 rounded-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
          <Icons.Category/>
          <div className="flex items-center gap-x-2">
            <Icons.Grow/>
            <span className="text-[#94A3B8] text-sm font-bold">1.56%</span>
          </div>
            </div>
            <div className="flex flex-row items-center justify-between">
              <h1 className="text-sm font-medium text-slate-500">
            Sales by Category
              </h1>
              <p className="text-lg text-secondary font-bold text-primary-black">18,098</p>
            </div>
          </div>
        </Card>

         <Card className="p-3 rounded-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
          <Icons.Visitor/>
          <div className="flex items-center gap-x-2">
            <Icons.Grow/>
            <span className="text-[#94A3B8] text-sm font-bold">1.56%</span>
          </div>
            </div>
            <div className="flex flex-row items-center justify-between">
              <h1 className="text-sm font-medium text-slate-500">
            Total Visitor
              </h1>
              <p className="text-lg text-secondary font-bold text-primary-black">18,098</p>
            </div>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-2 gap-x-5">
        <Earnings/>
        <ProductOverview/>
      </div>
      <div>
        <OrdersLists/>
      </div>
      <div>
        <TopComments/>
      </div>
    </div>
  );
}

export default Home;
