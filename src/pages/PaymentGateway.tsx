import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { PaymentProviders, togglePayment } from "@/lib/apis";
import { useMutation, useQuery } from "@tanstack/react-query";

import {
  Check,
  Clock5,
  EllipsisVertical,
  IndianRupee,
  LineChart,
  Loader2,
  Smartphone,
} from "lucide-react";

function PaymentGateway() {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["payments"],
    queryFn: () => PaymentProviders(),
    select: (data) => data?.data?.data,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
  const { mutate, isPending } = useMutation({
    mutationKey: ["togglepayment"],
    mutationFn: ({
      provider_id,
      enabled,
      user_id,
    }: {
      provider_id: string;
      enabled: boolean;
      user_id: number;
    }) => togglePayment({ provider_id, enabled, user_id }),
  });
  if (isLoading || isFetching) {
    return (
      <li className="border rounded-lg p-4 mt-4 flex items-center justify-between animate-pulse">
        <div className="flex items-center gap-x-3">
          <Skeleton className="size-14 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="flex items-center gap-x-3">
          <Skeleton className="h-6 w-20 rounded-xl" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </li>
    );
  }
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
          {data?.map((payment: any, index: number) => {
            return (
              <li
                key={index}
                className="border rounded-lg p-4 mt-4 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-x-3">
                  <div className="size-14 rounded-md grid place-items-center bg-[#9333EA]/10">
                    <Smartphone className="text-2xl text-[#9333EA]" />
                  </div>
                  <div>
                    <h2 className="font-medium capitalize">
                      {payment?.provider_name}
                    </h2>
                    <p className="text-sm text-[#697078]">
                      {payment?.provider_name} Payment
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-x-3">
                  <div
                    className={`rounded-xl px-4 py-1 text-sm font-medium ${
                      payment?.enabled
                        ? "bg-[#E9FFEF] text-[#166534]"
                        : "bg-[#FFF3F3] text-[#9F1239]"
                    }`}
                  >
                    {payment?.enabled ? "Active" : "Inactive"}
                  </div>

                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <EllipsisVertical className="text-gray-600" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-2 shadow-xl border rounded-md bg-white">
                      <div>
                        <p
                          className="cursor-pointer px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                          onClick={() => {
                            if (payment?.enabled) {
                              mutate({
                                enabled: false,
                                provider_id: payment.id,
                                user_id: payment.user_id,
                              });
                            } else {
                              mutate({
                                enabled: true,
                                provider_id: payment.id,
                                user_id: payment.user_id,
                              });
                            }
                          }}
                        >
                          {isPending ? (
                            <Loader2 className="animate-spin" />
                          ) : payment?.enabled ? (
                            "Set Inactive"
                          ) : (
                            "Set Active"
                          )}
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </li>
            );
          })}

          {/* <li className="border p-4 mt-4 flex items-center justify-between">
            <div className="flex items-center gap-x-3">
              <div className="size-14  rounded-md grid place-items-center bg-[#9333EA]/10">
                <Smartphone className=" !text-2xl text-[#9333EA]" />
              </div>
              <div>
                <h2 className="font-medium">PhonePe</h2>
                <p className="text-[#697078]">PhonePe Payment </p>
              </div>
            </div>
            <div className="flex items-center gap-x-2">
              <div className="bg-[#E9FFEF] rounded-xl  px-4  font-medium text-[#166534]">
                Active
              </div>
              <EllipsisVertical />
            </div>
          </li> */}
        </ul>
      </div>
    </div>
  );
}

export default PaymentGateway;
