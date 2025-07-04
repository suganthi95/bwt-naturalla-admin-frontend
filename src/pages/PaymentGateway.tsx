import { Card, CardHeader } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppContext } from "@/contexts/AuthContext";
import { PaymentProviders, togglePayment } from "@/lib/apis";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {

  EllipsisVertical,

  Loader2,
  Smartphone,
} from "lucide-react";

function PaymentGateway() {
  const {auth} = useAppContext()
  const queryClient = useQueryClient();
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["payments"],
    queryFn: () => PaymentProviders(auth?.token ?? ""),
    select: (data) => data?.data,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["togglepayment"],
    mutationFn: ({
      token,
      provider_id,
      enabled,
      user_id,
    }: {
      token:string;
      provider_id: string;
      enabled: boolean;
      user_id: number;
    }) => togglePayment({token, provider_id, enabled, user_id }),
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

      <div className="grid grid-cols-3 gap-5">
        <Card>
          <CardHeader>
            <div className="text-xl text-primary-black flex flex-row items justify-between">
              <h1>Total Transactions</h1>
              <h1 className="text-2xl font-bold">
                {data?.dashboard[0]?.transaction_count}
              </h1>
            </div>
          </CardHeader>
          {/* <CardContent>
            <div className="flex items-center gap-2">
              <LineChart className="stroke-blue-400 h-5 w-5" />
              <p>last 30 days</p>
            </div>
          </CardContent> */}
        </Card>
        <Card>
          <CardHeader>
            <div className="text-xl text-primary-black flex flex-row items justify-between">
              <h1>Success Rate</h1>
              <h1 className="text-2xl font-bold">{data?.dashboard[0]?.success_count}</h1>
            </div>
          </CardHeader>
         
        </Card>
        <Card>
          <CardHeader>
            <div className="text-xl text-primary-black flex flex-row items justify-between">
              <h1>Revenue</h1>
              <h1 className="text-2xl font-bold">
                ₹ {data?.dashboard[0]?.transaction_amount}
              </h1>
            </div>
          </CardHeader>
        
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
          {data?.data?.map((payment: any, index: number) => {
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
                              mutate(
                                {
                                  token:auth?.token ?? "",
                                  enabled: false,
                                  provider_id: payment.id,
                                  user_id: payment.user_id,
                                },
                                {
                                  onSuccess() {
                                    queryClient.invalidateQueries({
                                      queryKey: ["payments"],
                                    });
                                  },
                                }
                              );
                            } else {
                              mutate(
                                {
                                  token:auth?.token ?? "",
                                  enabled: true,
                                  provider_id: payment.id,
                                  user_id: payment.user_id,
                                },
                                {
                                  onSuccess() {
                                    queryClient.invalidateQueries({
                                      queryKey: ["payments"],
                                    });
                                  },
                                }
                              );
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
