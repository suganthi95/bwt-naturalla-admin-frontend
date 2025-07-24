import AllOrders from "@/components/order_history/AllOrders";
import LastMonth from "@/components/order_history/LastMonth";
import LastWeek from "@/components/order_history/LastWeek";
import ThisYear from "@/components/order_history/ThisYear";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/contexts/AuthContext";
import { getUserHistory, getUserHistoryByYear } from "@/lib/apis";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, ChevronLeft, CircleUserRound, Mail } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UserHistory() {
  const { auth } = useAppContext();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const years =
    currentYear < 2025
      ? Array.from({ length: currentYear - 2024 }, (_, i) => String(2025 + i))
      : ["2025"];
  const [selectedYeear, setSelectedYear] = useState(String(currentYear));
  const { id } = useParams();
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["getuserhistory", id],
    queryFn: () => getUserHistory(auth?.token ?? "", id ?? ""),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    select: (data) => data?.data,
  });

  const { data: YearData } = useQuery({
    queryKey: ["getuserHistoryByYear", id, selectedYeear],
    queryFn: () =>
      getUserHistoryByYear(auth?.token ?? "", id ?? "", selectedYeear ?? ""),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    select: (data) => data?.data,
  });
  console.log(YearData);

  const [tabValue, setTabValue] = useState("all");
  function exportMergedOrdersAsCSV(userData: any) {
    const headers = [
      "User ID",
      "User Name",
      "Email",
      "Order ID",
      "Order Date",
      "Total Amount",
      "Status",
    ];

    const mergedOrders = [
      ...userData.all_orders,
      ...userData.last_week_orders,
      ...userData.last_month_orders,
      ...userData.this_year_orders,
    ];

    const uniqueOrdersMap = new Map<number, any>();
    for (const order of mergedOrders) {
      uniqueOrdersMap.set(order.order_id, order);
    }

    const uniqueOrders = Array.from(uniqueOrdersMap.values());

    const rows = uniqueOrders.map((order) => [
      userData.user_id,
      userData.user_name,
      userData.email,
      order.order_id,
      order.order_date,
      order.total_amount,
      order.order_status,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((val) => `"${String(val)}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "merged-orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="flex flex-col p-4 gap-3 md:p-4 w-full h-screen overflow-y-scroll md:pb-20 bg-slate-100">
      <div className="flex flex-row items-center justify-between">
        <div className="flex items-start gap-x-1">
          <p
            className="flex items-center gap-x-1 mt-1 cursor-pointer"
            onClick={() => {
              navigate("/users");
            }}
          >
            <ChevronLeft />
          </p>{" "}
          <div className="flex flex-col">
            <h1 className="text-xl   font-semibold">Order History</h1>
            <ul className="flex items-center gap-x-3">
              <li className="text-[#4B5563] text-[13px] flex items-center gap-x-1">
                <CircleUserRound className="w-4 h-4" />
                {data?.user_name}
              </li>
              <li className="text-[#4B5563] text-[13px]  flex items-center gap-x-1">
                <Mail className="w-4 h-4" /> {data?.email}
              </li>
              <li className="text-[#4B5563] text-[13px]  flex items-center gap-x-1">
                <Briefcase className="w-4 h-4" />
                {data?.total_orders} Total Orders
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-row items-center gap-5">
          <Button
            onClick={() => exportMergedOrdersAsCSV(data)}
            variant="outline"
            className="px-6"
          >
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
              {["all", "last_week", "this_month"].map((value) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="rounded-md px-4 py-2 text-sm font-medium border transition-colors duration-200 ease-in-out data-[state=active]:bg-[#007AFF]/10 data-[state=active]:text-[#007AFF]"
                >
                  {
                    {
                      all: "All Orders",
                      last_week: "Last Week",
                      this_month: "Last Month",
                    }[value]
                  }
                </TabsTrigger>
              ))}
              <TabsTrigger
                value="this_year"
                className="group data-[state=active]:bg-[#007AFF]/10 data-[state=active]:text-[#007AFF] px-0 py-0 border-none"
              >
                <Select
                  value={selectedYeear}
                  onValueChange={setSelectedYear}
                  defaultValue="2026"
                >
                  <SelectTrigger className="w-[120px] px-4 py-2 text-sm font-medium border rounded-md transition-colors duration-200 ease-in-out group-data-[state=active]:bg-[#007AFF]/10 group-data-[state=active]:text-[#007AFF]">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TabsTrigger>
            </TabsList>
          </div>

          {isLoading || isFetching ? (
            <div className=" text-center">Loading...</div>
          ) : (
            <>
              <TabsContent value="all">
                <AllOrders orderHistory={data?.all_orders ?? []} />
              </TabsContent>
              <TabsContent value="last_week">
                <LastWeek orderHistory={data?.last_week_orders ?? []} />
              </TabsContent>
              <TabsContent value="this_month">
                <LastMonth orderHistory={data?.last_month_orders ?? []} />
              </TabsContent>
              <TabsContent value="this_year">
                <ThisYear orderHistory={YearData?.orders ?? []} />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
}
