import { Card, CardContent, CardHeader } from "@/components/ui/card";

import {
  Check,
  Clock5,
  EllipsisVertical,
  IndianRupee,
  LineChart,
  Smartphone,
} from "lucide-react";

function PaymentGateway() {
  return (
    <div className="flex flex-col p-4 gap-3 md:p-4 w-full h-screen overflow-y-scroll md:pb-20 bg-slate-100">
      <div className="flex flex-row items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Payment Gateway</h1>
          <p className="text-xs text-slate-400">
            Manage payment methods and transactions{" "}
          </p>
        </div>

        {/* <div>
          <Button>New Discount</Button>
        </div> */}
      </div>

      <div className="grid grid-cols-4 gap-5">
        <Card>
          <CardHeader>
            <div className="text-xl text-primary-black flex flex-row items justify-between">
              <h1>Total Transactions</h1>
              <h1 className="text-2xl font-bold">2,456</h1>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <LineChart className="stroke-blue-400 h-5 w-5" />
              <p>last 30 days</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="text-xl text-primary-black flex flex-row items justify-between">
              <h1>Success Rate</h1>
              <h1 className="text-2xl font-bold">12</h1>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-full grid place-items-center  bg-green-500">
                <Check className="text-white w-4" />
              </div>
              <p>Above Target</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="text-xl text-primary-black flex flex-row items justify-between">
              <h1>Revenue</h1>
              <h1 className="text-2xl font-bold">₹ 15,276</h1>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <IndianRupee className="stroke-purple-400 font-extrabold h-5 w-5" />
              <p>This month</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-xl text-primary-black flex flex-row items justify-between">
              <h1>Pending</h1>
              <h1 className="text-2xl font-bold">₹ 1,872</h1>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock5 className="fill-[#F19D02] text-white font-extrabold h-5 w-5" />
              <p>Awaiting settlement</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="border bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className=" font-semibold">Payment Gateway</h1>
            <p className="text-sm text-lead ">
              Configure your payment gateway settings{" "}
            </p>
          </div>
        </div>
        <ul className=" space-y-3 ">
          <li className="border p-4 mt-4 flex items-center justify-between">
            <div className="flex items-center gap-x-3">
              <div className="size-14  rounded-md grid place-items-center bg-[#9333EA]/10">
                <Smartphone className=" !text-2xl text-[#9333EA]" />
              </div>
              <div>
                <h2 className="font-medium">RazorPay</h2>
                <p className="text-[#697078]"> RazorPay Payment</p>
              </div>
            </div>
            <div className="flex items-center gap-x-2">
              <div className="bg-[#E9FFEF] rounded-xl  px-4  font-medium text-[#166534]">Active</div>
              <EllipsisVertical />
            </div>
          </li>
           <li className="border p-4 mt-4 flex items-center justify-between">
            <div className="flex items-center gap-x-3">
              <div className="size-14  rounded-md grid place-items-center bg-[#9333EA]/10">
                <Smartphone className=" !text-2xl text-[#9333EA]" />
              </div>
              <div>
                <h2 className="font-medium">PhonePe</h2>
                <p className="text-[#697078]">PhonePe Payment  </p>
              </div>
            </div>
            <div className="flex items-center gap-x-2">
              <div className="bg-[#E9FFEF] rounded-xl  px-4  font-medium text-[#166534]">Active</div>
              <EllipsisVertical />
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default PaymentGateway;
