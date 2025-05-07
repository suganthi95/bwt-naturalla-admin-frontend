import { CircleAlert, CircleCheck, CircleX, Clock, Gift } from "lucide-react"
import { Dialog, DialogContent } from "../ui/dialog"
import { useNavigate } from "react-router-dom"
import { ASSETS } from "@/assets/assets"
import { Switch } from "../ui/switch"
import { Button } from "../ui/button"
import { Icons } from "@/assets/icons"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { createSubscription, fetchSubscriptionPlans, PAYMENT_KEY, verifySubscription } from "@/lib/apis"
import { useAppContext } from "@/contexts/AuthContext"
import { SubscriptionPlanType } from "@/types"
import useRazorpay, { RazorpayOptions } from "react-razorpay"
import { AxiosError } from "axios"
import { toast } from "sonner"
import Loader from "../ui/Loader"
import { planFeatures } from "@/lib/utils"
import { trackEvent } from "@/lib/google_analytics"

function SubscriptionModal({ triggerPaymentDialog, setTriggerPaymentDialog }: { triggerPaymentDialog: boolean, setTriggerPaymentDialog: Dispatch<SetStateAction<boolean>> }) {


    const { auth } = useAppContext();
    

    const [Razorpay] = useRazorpay();
    const navigate = useNavigate();
    const [ openSubscriptionModal, setOpenSubscriptionModal ] = useState<boolean>(false);

    const [ planType, setPlanType ] = useState("monthly");

    const handleModal = () => {
        setOpenSubscriptionModal(true)
        trackEvent('Button','Click','upgrade button click',auth?.data.email)
    }

    useEffect(() => {
        if(triggerPaymentDialog){
            handleModal();
        }
    }, [triggerPaymentDialog])

    const { isSuccess, isLoading, data } = useQuery({
        queryKey: [ "fetchSubscriptionPlans" ],
        queryFn: () => fetchSubscriptionPlans({ 
            token: auth?.token as string,
            country: localStorage.getItem("loc") as string
        }),
        refetchOnWindowFocus: false,
        select: (data): SubscriptionPlanType[] => data.data,
        retry: 1,
        enabled: openSubscriptionModal,
    });

   
    const { mutate: verifySubscriptionMutate } = useMutation({
        mutationKey: ["verifySubscription"],
        mutationFn: verifySubscription,
        onSuccess: (data) => {
          console.log(data);
    
          if (data.data.success) {
            navigate("/payment-success");
          } else {
            navigate("/payment-failure");
          }
        },
        onError: (error) => {
          console.log(error);
          navigate("/payment-failure");
        },
    });

    const { mutate, isPending } = useMutation({
        mutationKey: ["createSubscription"],
        mutationFn: createSubscription,
        onSuccess: (data) => {
            setOpenSubscriptionModal(false);
            const { subscription_id } = data?.data?.data;
        
            const options = {
                key: PAYMENT_KEY,
                subscription_id: subscription_id,
                name: "IntelliResponse",
                description: "Subscription Plan",
                image: "https://ik.imagekit.io/zshycew5c/intelliresponse/intelli-response-logo.svg?updatedAt=1719985223239", // Your logo
                handler: function (response: any) {
                verifySubscriptionMutate({
                    token: auth?.token as string,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    razorpay_subscription_id: subscription_id,
                });
                },
                modal: {
                    backdropclose: false, // Prevent closing modal on backdrop click
                    ondismiss: function () {
                        window.location.reload();
                    },
                },
                theme: {
                    color: "#3399cc",
                },
            };
        
            const rzp = new Razorpay(options as RazorpayOptions);
            rzp.open();
        },
        onError: (error: AxiosError<any>) => {
          toast.error("Request Failed", {
            description: error?.response?.data?.message,
          });
        },
    });

    const buyNowOnclick = (planId: number, country: string) => {
        mutate({
            token: auth?.token as string,
            country,
            planId
        })
    }

    let plans;

    if(isLoading){
        plans = <div className="mx-auto"><Loader/></div>
    }

    if(isPending){
        plans = <div className="mx-auto"><Loader/></div>
    }

    if(isSuccess && !isPending){

        const [ standardPlanData ] = data.filter(item => item.period === planType && item.plan_name === "standard plan");
        const [ proPlanData ] = data.filter(item => item.period === planType && item.plan_name === "pro-plan");

        plans = (
            <>
                <div className="flex flex-row items-center gap-3 mx-auto">
                    <img src={ASSETS.LOGO} alt="logo" />
                    <div>
                        <p className="font-bold text-lg md:text-2xl text-primary">
                        Intelli<span className="text-secondary">Response</span>
                        </p>
                        <span className="text-slate-500 text-xs md:text-sm">
                        Turning Reviews Into Insights
                        </span>
                    </div>
                </div>

                <p className="text-center text-xs md:text-sm text-slate-500">Experience the full capabilities of IntelliResponse without any commitment.</p>
                <div className="text-center flex flex-row items-center gap-2 font-medium mx-auto dark:text-white">
                    <p>Monthly</p>
                    <Switch
                        checked={planType === "yearly"}
                        onCheckedChange={() => setPlanType(prev => prev === "monthly" ? "yearly" : "monthly")}
                    />
                    <div className="flex flex-row items-center gap-2">
                        <p>Yearly</p>
                        <div className="px-3 py-1 bg-[#59C204] rounded-3xl text-white">
                            <p>Save 40%</p>
                        </div>
                    </div>
                </div>

                <div className=" grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 overflow-y-scroll">
                    <div className="flex flex-col justify-between rounded-xl p-1 md:p-2 xl:p-5 w-full dark:border">
                        <div className="flex flex-row items-center gap-3">
                            <Icons.standardIcon className="h-10 w-10"/>

                            <div className="text-md">
                                <p className="text-slate-500">For Beginners</p>
                                <h2 className="text-secondary font-bold text-lg">Standard Plan</h2>
                            </div>
                        </div>

                        <div className="mt-2">
                            <h1 className="text-lg md:text-2xl text-secondary font-bold">{standardPlanData.currency_symbol} {standardPlanData.period === "monthly" ? standardPlanData.plan_amount : standardPlanData.price_per_month} <span className="text-slate-500 font-normal line-through text-lg">{standardPlanData.strike_through_price}</span> <span className="text-sm text-slate-500 font-normal">/ {standardPlanData.period === "monthly" ? "Monthly" : "Monthly, Billed Anually"}</span></h1>
                        </div>

                        <div className="flex flex-col gap-2 text-xs xl:text-sm mt-3">
                            {planFeatures.standard.map(item => (
                                <div key={`standard-${item.text}`} className="flex flex-row gap-3 items-start md:items-center">
                                    <div className="h-5 w-5">
                                        {/* <CircleCheck className="fill-green-400 stroke-white h-5 w-5" /> */}
                                        {item.icon === "success" && <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />}
                                        {item.icon === "error" && <CircleX className="fill-red-400 stroke-white h-5 w-5" />}
                                        {item.icon === "coming soon" && <Clock className="fill-blue-400 stroke-white h-5 w-5" />}
                                    </div>
                                    <p className="text-slate-600 font-bold">{item.text}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-2">
                            {auth?.data?.email !== "demo@embrais.com" && <Button disabled={isPending} onClick={() => buyNowOnclick(standardPlanData.plan_id, standardPlanData.country)} size="lg" className="w-full dark:bg-primary hover:dark:bg-primary/80 dark:text-white">Buy Now</Button>}
                            {auth?.data?.email === "demo@embrais.com" && <Button disabled={isPending} onClick={() => buyNowOnclick(15, standardPlanData.country)} size="lg" className="w-full dark:bg-primary hover:dark:bg-primary/80 dark:text-white">Buy Now</Button>}
                            
                        </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-xl p-1 md:p-2 xl:p-5 w-full bg-[#FFFAF5] border border-primary">
                        <div className="flex flex-row items-center gap-3">
                            <Icons.proIcon className="h-12 w-12"/>

                            <div className="flex flex-col gap-y-2 md:flex-row items-center justify-between w-full">
                                <div className="text-md">
                                    <p className="text-slate-500">For Professionals</p>
                                    <h2 className="text-secondary font-bold text-lg flex flex-row items-center gap-2">Pro Plan <Icons.diamondIcon className="h-5 w-5"/></h2>
                                </div>
                                <div>
                                    <Button  className="bg-[#59C204] hover:bg-[#59C204] md:p-2 xl:px-4 text-xs lg:text-balance rounded-xl text-white font-bold">Best Value</Button>
                                </div>
                            </div>

                        </div>

                        <div className="mt-2">
                            <h1 className="text-lg md:text-2xl text-primary font-bold">{proPlanData.currency_symbol} { proPlanData.period === "monthly" ? proPlanData.plan_amount : proPlanData.price_per_month} <span className="text-slate-500 font-normal line-through text-lg">{proPlanData.strike_through_price}</span> <span className="text-sm text-slate-500 font-normal">/ {proPlanData.period === "monthly" ? "Monthly" : "Monthly, Billed Anually"}</span></h1>
                        </div>

                        <div className="flex flex-col gap-2 text-xs xl:text-sm mt-3">
                            {planFeatures.pro.map(item => (
                                <div key={`pro-${item.text}`} className="flex flex-row gap-3 items-start md:items-center">
                                    <div className="h-5 w-5">
                                        {/* <CircleCheck className="fill-green-400 stroke-white h-5 w-5" /> */}
                                        {item.icon === "success" && <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />}
                                        {item.icon === "error" && <CircleX className="fill-red-400 stroke-white h-5 w-5" />}
                                        {item.icon === "coming soon" && <Clock className="fill-blue-400 stroke-white h-5 w-5" />}
                                    </div>
                                    <p className="text-slate-600 font-bold">{item.text}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-2">
                            {auth?.data?.email !== "demo@embrais.com" && <Button disabled={isPending} onClick={() => buyNowOnclick(proPlanData.plan_id, proPlanData.country)} size="lg" className="w-full dark:bg-primary hover:dark:bg-primary/80 dark:text-white bg-primary hover:bg-primary/80">Buy Now</Button>}
                            {auth?.data?.email === "demo@embrais.com" && <Button disabled={isPending} onClick={() => buyNowOnclick(17, proPlanData.country)} size="lg" className="w-full bg-primary hover:bg-primary/80 dark:bg-primary hover:dark:bg-primary/80 dark:text-white">Buy Now</Button>}
                        </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-xl p-1 md:p-2 xl:p-5 w-full dark:border">
                        <div className="flex flex-row items-center gap-3">
                            <Icons.enterpriseIcon className="h-10 w-10"/>

                            <div className="text-md">
                                <p className="text-slate-500">For Multiple Business</p>
                                <h2 className="text-secondary font-bold text-lg">Enterprise Plan</h2>
                            </div>
                        </div>

                        <div className="mt-6">

                            <h1 className="text-lg md:text-2xl text-secondary font-bold">Contact Sales</h1>
                        </div>

                        <div className="flex flex-col gap-2 text-xs xl:text-sm mt-3">
                            {planFeatures.enterprise.map(item => (
                                <div key={`enterprise-${item.text}`} className="flex flex-row gap-3 items-start md:items-center">
                                    <div className="h-5 w-5">
                                        {/* <CircleCheck className="fill-green-400 stroke-white h-5 w-5" /> */}
                                        {item.icon === "success" && <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />}
                                        {item.icon === "warning" && <CircleAlert className="fill-orange-400 stroke-white h-5 w-5" />}
                                        {item.icon === "error" && <CircleX className="fill-red-400 stroke-white h-5 w-5" />}
                                        {item.icon === "coming soon" && <Clock className="fill-blue-400 stroke-white h-5 w-5" />}
                                    </div>
                                    <p className="text-slate-600 font-bold">{item.text}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-2">
                            <Button onClick={() => window.open("https://intelliresponse.ai/en/#contact-us")} disabled={isPending} size="lg" className="w-full dark:bg-primary hover:dark:bg-primary/80 dark:text-white">Contact Us</Button>
                        </div>
                    </div>

                </div>
            </>
        )
    }
    

  return (
    <>
    <button onClick={() => handleModal()} className="flex items-center gap-2 bg-gradient-to-r from-[#CD84F1] to-[#7158E2] text-white py-1 px-2 rounded-lg">
        <Gift className="h-5 w-5" />
        <span className="text-xs">Upgrade</span>
    </button>
    <Dialog     
        open={openSubscriptionModal} 
        onOpenChange={() => {
            setOpenSubscriptionModal(prev => !prev);
            setTriggerPaymentDialog(false);
            window.location.reload();
        }}>
        <DialogContent className="h-full xl:h-auto w-10/12 md:max-w-7xl dark:text-white">
            {plans}
        </DialogContent>
    </Dialog>
    </>
  )
}

export default SubscriptionModal