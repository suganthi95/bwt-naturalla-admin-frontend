import { CircleCheck, Gift } from "lucide-react"
import { Dialog, DialogContent } from "../ui/dialog"
import { useNavigate } from "react-router-dom"
import { ASSETS } from "@/assets/assets"
import { Switch } from "../ui/switch"
import { Button } from "../ui/button"
import { Icons } from "@/assets/icons"
import { useEffect, useState } from "react"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"
import { useMutation, useQuery } from "@tanstack/react-query"
import { createSubscription, fetchSubscriptionPlans, PAYMENT_KEY, verifySubscription } from "@/lib/apis"
import { useAppContext } from "@/contexts/AuthContext"
import { SubscriptionPlanType } from "@/types"
import useRazorpay, { RazorpayOptions } from "react-razorpay"
import { AxiosError } from "axios"
import { toast } from "sonner"
import Loader from "../ui/Loader"

function SubscriptionModal() {


    const { auth } = useAppContext();
    const [Razorpay] = useRazorpay();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ openSubscriptionModal, setOpenSubscriptionModal ] = useState<boolean>(false);
    const [ geoLocation, setGeoLocation ] = useState<{ latitude: null | number, longitude: null | number }>({ latitude: null, longitude: null });

    const [ planType, setPlanType ] = useState("monthly");

    const handleModal = () => {
        if ('permissions' in navigator) {
            navigator.permissions.query({ name: 'geolocation' as PermissionName }).then((result) => {
                if (result.state === 'denied' || result.state === 'prompt') {
                    setIsModalOpen(true);
                }else{
                    setOpenSubscriptionModal(true)
                }
            });
        } else {
            // Default to showing modal if permissions API isn't available
            setIsModalOpen(true);
        }
    }

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setGeoLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude })
            },
            (error) => {
                console.error('Error enabling geolocation:', error);
            }
        );
    }, [])

    const { isSuccess, isLoading, data } = useQuery({
        queryKey: [ "fetchSubscriptionPlans" ],
        queryFn: () => fetchSubscriptionPlans({ 
            token: auth?.token as string,
            latitude: geoLocation.latitude,
            longitude: geoLocation.longitude
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

    const buyNowOnclick = (planId: number) => {
        mutate({
            token: auth?.token as string,

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
                <div className="text-center flex flex-row items-center gap-2 font-medium mx-auto">
                    <p>Monthly</p>
                    <Switch
                        checked={planType === "yearly"}
                        onCheckedChange={() => setPlanType(prev => prev === "monthly" ? "yearly" : "monthly")}
                    />
                    <p>Yearly</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3 place-items-center gap-5 h-full overflow-y-scroll ">
                    <div className="rounded-xl p-1  md:p-2 xl:p-5  w-full group">
                        <div className="flex flex-row items-center gap-3">
                            <Icons.standardIcon className="h-10 w-10"/>

                            <div className="text-md">
                                <p className="text-slate-500">For Beginners</p>
                                <h2 className="text-secondary font-bold text-lg">Standard Plan</h2>
                            </div>
                        </div>

                        <div className="mt-3">
                            <h1 className="text-lg md:text-2xl text-secondary font-bold">{standardPlanData.currency_symbol} {standardPlanData.plan_amount} <span className="text-sm md:text-lg text-slate-500 font-normal">/ Per {standardPlanData.period === "monthly" ? "Month" : "Year"}</span></h1>
                        </div>

                        <div className="flex flex-col gap-2 py-2 text-xs xl:text-sm mt-5">
                            <div className="flex  gap-3 items-start md:items-center">
                                <div className="h-5 w-5">
                                    <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-bold">AI-Powered Responses</p>
                                    <p className="text-slate-600">
                                        Generate professional replies to reviews with ease.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start md:items-center">
                                <div className="h-5 w-5">
                                    <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                                </div>

                                <div>
                                    <p className="font-bold">Sentiment Analysis</p>
                                    <p className="text-slate-600">
                                        Understand customer emotions and feedback.
                                    </p>
                                </div>
                                
                            </div>
                            <div className="flex flex-row gap-3 items-start md:items-center">
                                <div className="h-5 w-5">
                                    <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                                </div>

                                <div>
                                    <p className="font-bold">Analytics Dashboard</p>
                                    <p className="text-slate-600">
                                        Gain insights from detailed data visualizations.
                                    </p>
                                </div>
                                
                            </div>
                            <div className="flex flex-row gap-3 items-start md:items-center">
                                <div className="h-5 w-5">
                                    <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                                </div>

                                <div>
                                    <p className="font-bold">Multilingual Support</p>
                                    <p className="text-slate-600">
                                        Respond to reviews in multiple languages.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-row gap-3 items-start md:items-center">
                                <div className="h-5 w-5">
                                    <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                                </div>
                                <p className="text-slate-600">Flexible cancellation policy</p>
                            </div>
                            <div className="flex flex-row gap-3 items-center">
                                <div className="h-5 w-5">
                                    <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                                </div>
                                <p className="text-slate-600">Reminders before each billing cycle</p>
                            </div>
                            
                        </div>

                        <div className="mt-2">
                            <Button disabled={isPending} onClick={() => buyNowOnclick(standardPlanData.plan_id)} size="lg" className="w-full">Buy Now</Button>
                        </div>
                    </div>

                    <div className="rounded-xl p-1  md:p-2 xl:p-5 w-full bg-[#FFFAF5] group">
                        <div className="flex flex-row items-center gap-3">
                            <Icons.proIcon className="h-12 w-12"/>

                            <div className="flex flex-col gap-y-2 md:flex-row items-center justify-between w-full">
                                <div className="text-md">
                                    <p className="text-slate-500">For Professionals</p>
                                    <h2 className="text-secondary font-bold text-lg flex flex-row items-center gap-2">Pro Plan <Icons.diamondIcon className="h-5 w-5"/></h2>
                                </div>
                                <div>
                                    <Button  className="bg-[#59C204] hover:bg-[#59C204] md:p-2 xl:px-4 text-xs lg:text-balance rounded-xl">Recommended</Button>
                                </div>
                            </div>

                        </div>

                        <div className="mt-3">
                            <h1 className="text-lg md:text-2xl text-primary font-bold">{proPlanData.currency_symbol} {proPlanData.plan_amount} <span className="text-sm md:text-lg text-slate-500 font-normal">/ Per {proPlanData.period === "monthly" ? "Month" : "Year"}</span></h1>
                        </div>

                        <div className="flex flex-col gap-2 py-2 text-xs md:text-sm mt-5">
                            <div className="flex  gap-3 items-start md:items-center">
                                <div className="h-5 w-5">
                                    <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-bold">AI-Powered Responses</p>
                                    <p className="text-slate-600">
                                        Generate professional replies to reviews with ease.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start md:items-center">
                                <div className="h-5 w-5">
                                    <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                                </div>

                                <div>
                                    <p className="font-bold">Sentiment Analysis</p>
                                    <p className="text-slate-600">
                                        Understand customer emotions and feedback.
                                    </p>
                                </div>
                                
                            </div>
                            <div className="flex flex-row gap-3 items-start md:items-center">
                                <div className="h-5 w-5">
                                    <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                                </div>

                                <div>
                                    <p className="font-bold">Analytics Dashboard</p>
                                    <p className="text-slate-600">
                                        Gain insights from detailed data visualizations.
                                    </p>
                                </div>
                                
                            </div>
                            <div className="flex flex-row gap-3 items-start md:items-center">
                                <div className="h-5 w-5">
                                    <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                                </div>

                                <div>
                                    <p className="font-bold">Multilingual Support</p>
                                    <p className="text-slate-600">
                                        Respond to reviews in multiple languages.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-row gap-3 text-xs md:text-sm items-start md:items-center">
                                <div className="h-5 w-5">
                                    <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                                </div>
                                <p className="text-slate-600">Flexible cancellation policy</p>
                            </div>
                            <div className="flex flex-row gap-3 items-center">
                                <div className="h-5 w-5">
                                    <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                                </div>
                                <p className="text-slate-600">Reminders before each billing cycle</p>
                            </div>
                            
                        </div>

                        <div className="mt-2">
                            <Button disabled={isPending} onClick={() => buyNowOnclick(proPlanData.plan_id)} size="lg" className="w-full bg-primary hover:bg-primary/80">Buy Now</Button>
                        </div>
                    </div>

                    <div className="rounded-xl p-1 md:p-2 xl:p-5 w-full group xl:mb-7">
                        <div className="flex flex-row items-center gap-3">
                            <Icons.enterpriseIcon className="h-10 w-10"/>

                            <div className="text-md">
                                <p className="text-slate-500">For Multiple Business</p>
                                <h2 className="text-secondary font-bold text-lg">Enterprise Plan</h2>
                            </div>
                        </div>

                        <div className="mt-3">
                            <h1 className="text-lg md:text-2xl text-secondary font-bold">Contact Sales</h1>
                        </div>

                        <div className="flex flex-col gap-2 py-2 text-sm mt-5">
                            <div className="flex  gap-3 items-start md:items-center">
                                <div className="h-5 w-5">
                                    <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-bold">AI-Powered Responses</p>
                                    <p className="text-slate-600">
                                        Generate professional replies to reviews with ease.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-3 items-start md:items-center">
                                <div className="h-5 w-5">
                                    <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                                </div>

                                <div>
                                    <p className="font-bold">Sentiment Analysis</p>
                                    <p className="text-slate-600">
                                        Understand customer emotions and feedback.
                                    </p>
                                </div>
                                
                            </div>
                            <div className="flex flex-row gap-3 items-start md:items-center">
                                <div className="h-5 w-5">
                                    <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                                </div>

                                <div>
                                    <p className="font-bold">Analytics Dashboard</p>
                                    <p className="text-slate-600">
                                        Gain insights from detailed data visualizations.
                                    </p>
                                </div>
                                
                            </div>
                            <div className="flex flex-row gap-3 items-start md:items-center">
                                <div className="h-5 w-5">
                                    <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                                </div>

                                <div>
                                    <p className="font-bold">Multilingual Support</p>
                                    <p className="text-slate-600">
                                        Respond to reviews in multiple languages.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-row gap-3 items-start md:items-center">
                                <div className="h-5 w-5">
                                    <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                                </div>
                                <p className="text-slate-600">Flexible cancellation policy</p>
                            </div>
                            <div className="flex flex-row gap-3 items-center">
                                <div className="h-5 w-5">
                                    <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                                </div>
                                <p className="text-slate-600">Reminders before each billing cycle</p>
                            </div>
                            
                        </div>

                        <div className="mt-2">
                            <Button disabled={isPending} size="lg" className="w-full">Contact Us</Button>
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
    <Dialog open={openSubscriptionModal} onOpenChange={() => setOpenSubscriptionModal(prev => !prev)}>
        <DialogContent className="h-full mt-10   w-10/12 md:max-w-7xl">

            {plans}
        </DialogContent>
    </Dialog>
    <AlertDialog open={isModalOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Enable Geolocation</AlertDialogTitle>
            <AlertDialogDescription>
                Your location is required for a better experience. Please enable it in your browser settings.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsModalOpen(false)}>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  )
}

export default SubscriptionModal