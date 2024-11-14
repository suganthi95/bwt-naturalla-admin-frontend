import { Check, CircleCheck, Gift, LoaderCircle, X } from "lucide-react"
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "./alert-dialog"
import { ASSETS } from "@/assets/assets"
import { Button } from "./button"
import { Dispatch, SetStateAction, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { RadioGroup, RadioGroupItem } from "./radio-group"
import dayjs from "dayjs"
import { Icons } from "@/assets/icons"
import { useMutation, useQuery } from "@tanstack/react-query"
import { createSubscription, fetchSubscriptionPlans, verifySubscription } from "@/lib/apis"
import { useAppContext } from "@/contexts/AuthContext"
import { toast } from "sonner"
import useRazorpay, { RazorpayOptions } from "react-razorpay";
import { AxiosError } from "axios"
import { useNavigate } from "react-router-dom"

interface Props {
    openPaymentDialog: boolean,
    setOpenPaymentDialog: Dispatch<SetStateAction<boolean>>
}

function UpgradeModal({ openPaymentDialog, setOpenPaymentDialog }: Props) {

    const { auth } = useAppContext();
    const navigate = useNavigate()
    const [ proceedToPay, setProceedToPay ] = useState(false);
    const [ Razorpay ] = useRazorpay();

    const { register, watch, control } = useForm({
        defaultValues: {
            plan: null
        }
    });

    const { isSuccess, data } = useQuery({
        queryKey: [ "fetchSubscriptionPlans", auth?.token ],
        queryFn: () => fetchSubscriptionPlans({ token: auth?.token as string }),
        refetchOnWindowFocus: false,
        retry: 1,
        select: (data) => data?.data, 
        enabled: Boolean(auth?.token)
    });

    const { mutate: verifySubscriptionMutate } = useMutation({
        mutationKey: [ "verifySubscription" ],
        mutationFn: verifySubscription,
        onSuccess: (data) => {
            console.log(data)

            if(data.data.success){
                navigate("/payment-success")
            }else{
                navigate("/payment-failure")
            }
        },
        onError: (error) => {
            console.log(error)
            navigate("/payment-failure")
        }
    })

    const { mutate, isPending } = useMutation({
        mutationKey: [ "createSubscription" ],
        mutationFn: createSubscription,
        onSuccess: (data) => {
            setOpenPaymentDialog(false);
            const { subscription_id } = data?.data?.data;


            const options = {
                key: 'rzp_test_xSZldxULopihDB',
                subscription_id: subscription_id,
                name: 'IntelliResponse',
                description: 'Subscription Plan',
                image: 'https://ik.imagekit.io/zshycew5c/intelliresponse/intelli-response-logo.svg?updatedAt=1719985223239', // Your logo
                handler: function (response: any) {
                
                    verifySubscriptionMutate({
                        token: auth?.token as string,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature, 
                        razorpay_subscription_id: subscription_id 
                    })
                },
                // prefill: {
                //     name: 'John Doe',
                //     email: 'john@example.com',
                //     contact: '9999999999',
                // },
                theme: {
                    color: '#3399cc',
                },
            };

            const rzp = new Razorpay(options as RazorpayOptions);
            rzp.open();
        },
        onError: (error: AxiosError<any>) => {
            toast.error("Request Failed", { description: error?.response?.data?.message })
        }
    });

    const initiatePayment = () => {

        if(watch("plan") === null){
            return
        }

        mutate({
            planId: watch("plan"),
            token: auth?.token as string
        })
    }

    const paymentScreenOne = (
        <div className="flex flex-1 flex-col p-5 gap-3">
            <h1 className="text-secondary text-2xl font-bold">Try <span className="text-primary">IntelliResponse</span></h1>
            <p className="text-slate-500">Experience the full capabilities of IntelliResponse without any commitment.</p>
            <div className="border-t border-b flex flex-col gap-5 py-5">
                <p className="text-secondary text-md">Here's what you will get:</p>

                <div className="flex flex-row gap-3 items-center">
                    <div>   
                        <Icons.aiIcon/>
                    </div>
                    <p><span className="font-bold">AI-Generated Responses:</span> Generate  context aware responses to your customer reviews.</p>
                </div>
                <div className="flex flex-row gap-3 items-center">
                    <div>
                        <Icons.analyticsIcon/>
                    </div>
                    <p><span className="font-bold">Analytics Dashboard:</span> Gain insights into customer sentiment and review trends.</p>
                </div>
                <div className="flex flex-row gap-3 items-center">
                    <div>
                        <Icons.languageIcon/>
                    </div>
                    <p><span className="font-bold">Multilingual Support:</span> Respond to reviews in multiple languages seamlessly.</p>
                </div>
            </div>

            <div>
                <p className="text-slate-500">Cancel anytime. We'll remind you 2 days before your trial ends.</p>
            </div>

            <div className="flex flex-row items-center gap-3">
                <Button onClick={() => setProceedToPay(true)} className="bg-primary hover:bg-primary/50 font-thin">
                    Buy Now
                </Button>
                {/* <Button onClick={() => setOpenPaymentDialog(false)} className="font-thin flex flex-row items-center gap-2 group">
                    Start Free Trial
                    <ArrowRight className="h-5 w-5 group-hover:transition group-hover:translate-x-1 ease-linear" />
                </Button> */}
            </div>
        </div>
    );

    let paymentScreenTwo;

    if(isSuccess){

        paymentScreenTwo = (
            <div className="flex flex-1 flex-col p-5 gap-3">
    
                <div className="grid grid-cols-2 text-center">
                    <div>
                        <p className="text-secondary text-xl font-medium">Standard Plan</p>
                    </div>
                    <div>
                        <p className="text-secondary text-xl font-medium">Pro Plan</p>
                    </div>
                </div>
                <div>
                    <Controller
                        name='plan'
                        control={control}
                        render={({ field }) => (
                            <RadioGroup 
                                value={field.value ?? ""} 
                                onValueChange={(val) => field.onChange(val)} 
                                className="grid grid-cols-2 items-center mt-1 gap-3 capitalize"
                                {...register("plan")}
                            >
                                {data?.map((item: any) => (
                                    <div className="h-full">
                                        <RadioGroupItem className="hidden" type="button" value={item.plan_id} id={item.plan_id} />
                                        <label 
                                            className={watch("plan") === item.plan_id ? "flex flex-row items-center justify-between border border-primary bg-primary/5 text-xl p-3 w-full font-bold cursor-pointer rounded-lg" : "flex flex-row items-center justify-between border border-black text-xl font-bold p-3 w-full rounded-lg cursor-pointer" }
                                            htmlFor={item.plan_id}
                                        >
                                            <div>
                                                {item.period} plan
                                                {/* <p className="font-light text-slate-500 text-sm mt-1">Pay $359 per year after 7 days trial</p> */}
                                                {/* <p className="font-light text-slate-500 text-sm mt-1">{item.plan_desc}</p> */}
                                            </div>
                                            {watch("plan") === item.plan_id && <CircleCheck className="fill-primary stroke-white" />}
                                        </label>
                                    </div>
                                ))}
                            </RadioGroup>
                        )}  
                    />
                </div>
    
                <div className="flex flex-col gap-2 py-5 text-sm">
    
                    <div className="flex flex-row gap-3 items-center">
                        <Check className="stroke-green-400" />
                        <p><span className="font-bold">AI-Powered Responses:</span> Generate professional replies to reviews with ease.</p>
                    </div>
                    <div className="flex flex-row gap-3 items-center">
                        <Check className="stroke-green-400" />
                        <p><span className="font-bold">Sentiment Analysis:</span> Understand customer emotions and feedback.</p>
                    </div>
                    <div className="flex flex-row gap-3 items-center">
                        <Check className="stroke-green-400" />
                        <p><span className="font-bold">Analytics Dashboard:</span> Gain insights from detailed data visualizations.</p>
                    </div>
                    <div className="flex flex-row gap-3 items-center">
                        <Check className="stroke-green-400" />
                        <p><span className="font-bold">Multilingual Support:</span> Respond to reviews in multiple languages.</p>
                    </div>
                    <div className="flex flex-row gap-3 items-center">
                        <Check className="stroke-green-400" />
                        <p>Flexible cancellation policy</p>
                    </div>
                    <div className="flex flex-row gap-3 items-center">
                        <Check className="stroke-green-400" />
                        <p>Reminders before each billing cycle</p>
                    </div>
                    
                </div>
    
                <div className="flex flex-row items-center justify-between">
                    <div>
                        <p>Due today</p>
                        <p className="text-slate-500">{dayjs(new Date()).format("ddd, MMM DD YYYY")}</p>
                    </div>
    
                    <div>
                        <p className="text-xl font-bold">{data?.filter((item: any) => item.place_id === watch("plan"))[0]?.plan_amount}</p>
                    </div>
                </div>
    
                <div className="flex flex-row items-center gap-3">
                    <Button disabled={isPending} onClick={initiatePayment} className="bg-primary hover:bg-primary/50 font-thin">
                        {isPending ? <LoaderCircle className="h-5 w-5 animate-spin"/> : "Next"}
                    </Button>
                </div>
            </div>
        )
    
    }

    
  return (
    <AlertDialog open={openPaymentDialog} onOpenChange={setOpenPaymentDialog}>
        <AlertDialogTrigger asChild>
            <button className="flex items-center gap-2 bg-gradient-to-r from-[#CD84F1] to-[#7158E2] text-white py-1 px-2 rounded-lg">
                <Gift className="h-5 w-5" />
                <span className="text-xs">Upgrade</span>
            </button>
        </AlertDialogTrigger>
        <AlertDialogContent className="p-0 overflow-hidden max-w-5xl">
            <div className="flex flex-row">
                {proceedToPay ? paymentScreenTwo : paymentScreenOne}
                
                <div className="hidden md:flex bg-sandal flex-1 relative">
                    <Button onClick={() => setOpenPaymentDialog(false)} className="p-1 absolute top-3 right-3" variant="secondary" size="icon">
                        <X className="h-5 w-5" />
                    </Button>
                    <img className="h-full w-full object-contain" src={ASSETS.PAYMENT_BG_IMG} alt="img" />
                </div>
            </div>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default UpgradeModal