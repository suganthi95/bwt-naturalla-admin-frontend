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
import { Trans } from "react-i18next"

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

                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-x-5">

                    <div className="py-2 text-md font-medium">
                        <p><Trans i18nKey={'current_plan'}/></p>
                    </div>

                    {data.future_subscription &&
                        <div className="py-2 text-md font-medium">
                            <p><Trans i18nKey={'future_plan'}/></p>
                        </div>
                    }

                    <div className="py-2 text-md font-medium">
                        <p><Trans i18nKey={'credits_plan'}/></p>
                    </div>

                    <div></div>

                    {!data.future_subscription && <div></div>}

                    <Card className="p-4">
                        {data.started_subscription ? 
                            <h1 className="text-md text-primary capitalize">{data?.plan_name}: {data?.period}</h1>  :
                            <h1 className="text-md text-primary capitalize"><Trans i18nKey={'subscription_in_progress'}/></h1> 
                        }
                        <Separator className="my-2" />

                        {data.started_subscription && !data.cancel_subscription && <div className="space-y-1 mt-2">
                            <p className="text-sm text-slate-400"><Trans i18nKey={'subscription_renewal_date'}/></p>
                            <p className="font-medium">{dayjs(data?.next_due).format("MMMM DD, YYYY")} ({dayjs(data?.next_due).fromNow()})</p>
                        </div>}

                        {data.started_subscription ?
                            <>
                                {!data.cancel_subscription && <div className="space-y-1 mt-2">
                                    <p className="text-sm text-slate-400"><Trans i18nKey={'what_you_will_be_charged'}/></p>
                                    <p className="font-medium">{data.currency_symbol} {data?.amount}</p>
                                </div>}
                                {data.cancel_subscription && <p className="text-sm text-slate-400"><Trans i18nKey={'subscription_cancelled'}/> ({dayjs(data?.next_due).format("MMMM DD, YYYY")})</p>}
                                {!data.cancel_subscription && 
                                    <div className="space-y-1 mt-4">
                                        <CancelSubscription Canceled = {data.cancel_subscription}/>
                                    </div>
                                }
                            </> :
                            <div className="space-y-1 mt-2">
                                <p className="text-sm text-slate-900 font-bold"><Trans i18nKey={'subscription_activation_message'}/></p>
                            </div>
                        }

                        
                    </Card>
                    {data.future_subscription &&
                            
                        <Card className="p-4">
                            {data.started_subscription ? 
                                <h1 className="text-md text-primary capitalize">{data?.future_sub_plan_name}</h1>  :
                                <h1 className="text-md text-primary capitalize"><Trans i18nKey={'subscription_in_progress'}/></h1> 
                            }
                            <Separator className="my-2" />

                            {data.future_subscription && <div className="space-y-1 mt-2">
                                <p className="text-sm text-slate-400"><Trans i18nKey={'your_next_plan'}/> ({data?.future_sub_plan_name}) <Trans i18nKey={'will_start_on'}/></p>
                                <p className="font-medium">{dayjs(data?.future_sub_start_date).format("MMMM DD, YYYY")} ({dayjs(data?.future_sub_start_date).fromNow()})</p>
                            </div>}

                            
                        </Card>
                    }
                        
                    <Card className="p-4">
                        <h1 className="text-md text-primary capitalize"><Trans i18nKey={'instant_credits_left'}/>{data.instant_credits.remaining_instant_credits ?? 0} / {data.instant_credits.total_credits ?? 0}</h1>
                        <Separator className="my-2" />

                        <div className="space-y-1 mt-2">
                            <p className="text-sm text-slate-400"><Trans i18nKey={'last_payment_made'}/> {dayjs(data?.instant_credits.started_at).fromNow()}</p>
                            <p className="font-medium">{data.instant_credits.currency_symbol} {data?.instant_credits.order_amount ?? 0}</p>
                        </div>
                    </Card>
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
            <h1 className="font-semibold"><Trans i18nKey={'billing'}/></h1>
        </div>

       {content}
    </div>
  )
}

export default Billing