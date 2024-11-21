import PaymentTable from "@/components/billing/PaymentTable"
import CancelSubscription from "@/components/ui/CancelSubscription"
import { Card } from "@/components/ui/card"
import Loader from "@/components/ui/Loader"
import { Separator } from "@/components/ui/separator"
import { useAppContext } from "@/contexts/AuthContext"
import { getBillings, getPaymentHistoryTable } from "@/lib/apis"
import { BillingResponse, PaymentHistoryResponseType } from "@/types"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime";

function Billing() {

    dayjs.extend(relativeTime);

    const { auth } = useAppContext();
    const { isSuccess, isError, isLoading, data, error } = useQuery({
        queryKey: [ "getBillings" ],
        queryFn: () => getBillings({ token: auth?.token as string }),
        select: (data): BillingResponse => data?.data, 
        refetchOnWindowFocus: false,
        retry: 1
    });

    const { isLoading: isPaymentHistoryLoading, isError: isPaymentHistoryError, isSuccess: isPaymentHistorySuccess, data: paymentHistoryData } = useQuery({
        queryKey: [ "getPaymentHistoryTable" ],
        queryFn: () => getPaymentHistoryTable({ token: auth?.token as string }),
        select: (data):PaymentHistoryResponseType[] => data?.data, 
        refetchOnWindowFocus: false,
        retry: 1
    });

    let content;

    if(isLoading || isPaymentHistoryLoading){
        content = <Loader/>
    }

    if(isError || isPaymentHistoryError){
        content = <p className="mt-[10%] mx-auto text-center text-secondary font-bold">{error?.message}</p>
    }

    if(isSuccess && isPaymentHistorySuccess && Array.isArray(paymentHistoryData)){
        content = (
            <>
            <div className="py-2 text-md font-medium">
                <p>Current Plan</p>
            </div>

            <div className="grid grid-cols-4 gap-5">
                <Card className="p-4">
                    <h1 className="text-md text-primary capitalize">{data?.plan_name}: {data?.period}</h1>
                    <Separator className="my-2" />

                    <div className="space-y-1 mt-2">
                        <p className="text-sm text-slate-400">Subscription renewal date</p>
                        <p className="font-medium">{dayjs(data?.next_due).format("MMMM DD, YYYY")} ({dayjs(data?.next_due).fromNow()})</p>
                    </div>

                    <div className="space-y-1 mt-2">
                        <p className="text-sm text-slate-400">what you’ll be charged</p>
                        <p className="font-medium">USD $ 29.00</p>
                    </div>

                    <div className="space-y-1 mt-4">
                        <CancelSubscription/>
                    </div>
                </Card>
                {/* <Card className="p-4">
                    <h1 className="text-md text-primary capitalize">Credits</h1>
                    <Separator className="my-2" />

                    <div className="space-y-1 mt-2">
                        <p className="text-sm text-slate-400">Total credits bought this month</p>
                        <p className="font-medium">{data.total_credits}</p>
                    </div>

                    <div className="space-y-1 mt-2">
                        <p className="text-sm text-slate-400">Credits used</p>
                        <p className="font-medium">{data.used_credits}</p>
                    </div>
                </Card> */}
            </div>
            <div>
                <PaymentTable data={paymentHistoryData as PaymentHistoryResponseType[]}/>
            </div>
            </>
        )
    }

  return (
    <div className="p-2 flex flex-col flex-1 overflow-y-scroll pb-10">
        <div className="flex flex-row items-center justify-between py-1">
            <h1 className="font-semibold">Billing</h1>
        </div>

       {content}
    </div>
  )
}

export default Billing