import AllOrders from "@/components/order_history/AllOrders";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/contexts/AuthContext";
import { getUserHistory } from "@/lib/apis";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, ChevronLeft, CircleUserRound, Mail } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UserHistory() {
  const { auth } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ["getuserhistory", id],
    queryFn: () => getUserHistory(auth?.token ?? "", id ?? ""),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    select: (data) => data?.data,
  });
  console.log(data);

  const [tabValue, setTabValue] = useState("all");

  return (
    <div className="flex flex-col p-4 gap-3 md:p-4 w-full h-screen overflow-y-scroll md:pb-20 bg-slate-100">
      <div className="flex flex-row items-center justify-between">
        <div className='flex items-start gap-x-1'>
          <p
          className="flex items-center gap-x-1 mt-1 cursor-pointer"
            onClick={() => {
              navigate("/users");
            }}
          >
            <ChevronLeft />
          </p>{" "}
          <div className="flex flex-col">

        <h1 className="text-xl   font-semibold">
         Order History
        </h1>
          <ul className="flex items-center gap-x-3">
            <li className="text-[#4B5563] text-[13px] flex items-center gap-x-1">
              <CircleUserRound className="w-4 h-4" />
              Courtney Henry
            </li>
            <li className="text-[#4B5563] text-[13px]  flex items-center gap-x-1">
              <Mail className="w-4 h-4" /> bava12@gmail.com
            </li>
            <li className="text-[#4B5563] text-[13px]  flex items-center gap-x-1">
              <Briefcase className="w-4 h-4" />
              11 Total Orders
            </li>
          </ul>
          </div>

        </div>

        <div className="flex flex-row items-center gap-5">
          <Button variant="outline" className="px-6">
            Export
          </Button>
          <Button onClick={() => window.print()} className="px-6">
            Print
          </Button>
        </div>
      </div>
      <div className="bg-white p-4 flex items-center">
        <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <TabsList className="flex gap-2 bg-transparent p-0">
              {["all", "last_week", "this_month", "this_year"].map((value) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="rounded-md px-4 py-2 text-sm font-medium border transition-colors duration-200 ease-in-out data-[state=active]:bg-[#007AFF]/10 data-[state=active]:text-[#007AFF]"
                >
                  {
                    {
                      all: "All Orders",
                      last_week: "Last Week",
                      this_month: "This Month",
                      this_year: "This Year",
                    }[value]
                  }
                </TabsTrigger>
              ))}
            </TabsList>

            {/* <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search orders..."
                className="pl-9 pr-4 py-2 text-sm border rounded-lg focus-visible:ring-1 focus-visible:ring-[#007AFF]"
              />
            </div> */}
          </div>

          <TabsContent value="all">
            <AllOrders />
          </TabsContent>
          <TabsContent value="last_week">Last Week's Orders</TabsContent>
          <TabsContent value="this_month">This Month's Orders</TabsContent>
          <TabsContent value="this_year">This Year's Orders</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
