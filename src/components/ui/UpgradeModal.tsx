import { Check, CircleCheck, Gift, X } from "lucide-react"
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "./alert-dialog"
import { ASSETS } from "@/assets/assets"
import { Button } from "./button"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { RadioGroup, RadioGroupItem } from "./radio-group"
import dayjs from "dayjs"

function UpgradeModal() {

    const [ openPaymentDialog, setOpenPaymentDialog ] = useState(false);
    const [ proceedToPay, setProceedToPay ] = useState(false);

    const { register, watch, control } = useForm({
        defaultValues: {
            plan: "annual"
        }
    });

    const paymentScreenOne = (
        <div className="flex flex-1 flex-col p-5 gap-3">
            <h1 className="text-secondary text-2xl font-bold">Try <span className="text-primary">IntelliResponse</span> Pro</h1>
            <p className="text-slate-500">Experience the full capabilities of IntelliResponse without any commitment.</p>

            <div className="border-t border-b flex flex-col gap-5 py-5">
                <p className="text-secondary text-md">Here's what you will get in Pro:</p>

                <div className="flex flex-row gap-3 items-center">
                    <div className="p-5 rounded-lg bg-slate-300"></div>
                    <p><span className="font-bold">AI-Generated Responses:</span> Generate  context aware responses to your customer reviews.</p>
                </div>
                <div className="flex flex-row gap-3 items-center">
                    <div className="p-5 rounded-lg bg-slate-300"></div>
                    <p><span className="font-bold">Analytics Dashboard:</span> Gain insights into customer sentiment and review trends.</p>
                </div>
                <div className="flex flex-row gap-3 items-center">
                    <div className="p-5 rounded-lg bg-slate-300"></div>
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
    )

    const paymentScreenTwo = (
        <div className="flex flex-1 flex-col p-5 gap-3">
            <Controller
                name='plan'
                control={control}
                render={({ field }) => (
                    <RadioGroup 
                        value={field.value} 
                        onValueChange={(val) => field.onChange(val)} 
                        className="flex flex-row flex-wrap items-center mt-3 gap-5 capitalize"
                        {...register("plan")}
                    >
                        <div className="flex items-center w-full">
                            <RadioGroupItem className="hidden" type="button" value="annual" id="annual" />
                            <label 
                                className={watch("plan") === "annual" ? "flex flex-row items-center justify-between border border-primary bg-primary/5 text-xl p-3 w-full font-bold cursor-pointer rounded-lg" : "flex flex-row items-center justify-between border border-black text-xl font-bold p-3 w-full rounded-lg cursor-pointer" }
                                htmlFor="annual"
                            >
                                <div>
                                    Annual plan 
                                    <p className="font-light text-slate-500 text-sm mt-1">Pay $359 per year after 7 days trial</p>
                                </div>
                                {watch("plan") === "annual" && <CircleCheck className="fill-primary stroke-white" />}
                            </label>
                        </div>
                        <div className="flex items-center w-full">
                            <RadioGroupItem className="hidden" type="button" value="monthly" id="monthly" />
                            <label 
                                className={watch("plan") === "monthly" ? "flex flex-row items-center justify-between border border-primary bg-primary/5 text-xl p-3 w-full font-bold cursor-pointer rounded-lg" : "flex flex-row items-center justify-between border border-black text-xl font-bold p-3 w-full rounded-lg cursor-pointer" }
                                htmlFor="monthly"
                            >
                                <div>
                                    Monthly plan
                                    <p className="font-light text-slate-500 text-sm mt-1">Pay $29 per month after 7 days trial <span>(at just a dollar day)</span></p>
                                </div>
                                {watch("plan") === "monthly" && <CircleCheck className="fill-primary stroke-white" />}
                            </label>
                        </div>
                    </RadioGroup>
                )}  
            />

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
                    <p className="text-xl font-bold">{watch("plan") === "monthly" ? "$ 29" : "$ 359"}</p>
                </div>
            </div>

            <div className="flex flex-row items-center gap-3">
                <Button className="bg-primary hover:bg-primary/50 font-thin">
                    Next
                </Button>
            </div>
        </div>
    )

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
                
                <div className="bg-sandal flex flex-1 relative">
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