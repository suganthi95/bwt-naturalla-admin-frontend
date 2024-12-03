import {
  Check,
  Circle,
  CircleCheck,
  Crown,
  Gift,
  LoaderCircle,
  X,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "./alert-dialog";
import { ASSETS } from "@/assets/assets";
import { Button } from "./button";
import { Dispatch, SetStateAction, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import dayjs from "dayjs";
import { Icons } from "@/assets/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createSubscription,
  fetchSubscriptionPlans,
  verifySubscription,
} from "@/lib/apis";
import { useAppContext } from "@/contexts/AuthContext";
import { toast } from "sonner";
import useRazorpay, { RazorpayOptions } from "react-razorpay";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

interface Props {
  plan:string,
  openPaymentDialog: boolean;
  setOpenPaymentDialog: Dispatch<SetStateAction<boolean>>;
}

function UpgradeModal({ plan, openPaymentDialog, setOpenPaymentDialog }: Props) {
  const { auth } = useAppContext();
  const navigate = useNavigate();
  const [proceedToPay, setProceedToPay] = useState(false);
  const [Razorpay] = useRazorpay();
  const { register, watch, control, } = useForm({
    defaultValues: {
      plan: null,
    },
  });

  const { isSuccess, data } = useQuery({
    queryKey: ["fetchSubscriptionPlans", auth?.token],
    queryFn: () => fetchSubscriptionPlans({ token: auth?.token as string }),
    refetchOnWindowFocus: false,
    retry: 1,
    select: (data) => data?.data,
    enabled: Boolean(auth?.token),
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
      setOpenPaymentDialog(false);
      const { subscription_id } = data?.data?.data;

      const options = {
        key: "rzp_test_xSZldxULopihDB",
        subscription_id: subscription_id,
        name: "IntelliResponse",
        description: "Subscription Plan",
        image:
          "https://ik.imagekit.io/zshycew5c/intelliresponse/intelli-response-logo.svg?updatedAt=1719985223239", // Your logo
        handler: function (response: any) {
          verifySubscriptionMutate({
            token: auth?.token as string,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            razorpay_subscription_id: subscription_id,
          });
        },
        // prefill: {
        //     name: 'John Doe',
        //     email: 'john@example.com',
        //     contact: '9999999999',
        // },
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

  const initiatePayment = () => {
    if (watch("plan") === null) {
      return;
    }

    mutate({
      planId: watch("plan"),
      token: auth?.token as string,
    });
  
  };

  const paymentScreenOne = (
    <div className="flex flex-1 overflow-y-scroll    md:w-6/12 flex-col p-2 md:p-5 gap-3">
      {plan === 'pro-plan'? <h1 className="text-secondary text-2xl font-bold">
        Try <span className="text-primary">IntelliResponse</span>
        </h1>:
        <h1 className="text-secondary  md:text-2xl font-bold">
        Subscribe to <span className="text-primary">IntelliResponse</span>
        </h1>
      }
    
      <p className="text-sm md:text-base text-slate-500">
        Experience the full capabilities of IntelliResponse without any
        commitment.
      </p>
      <div className="border-t border-b flex flex-col gap-5 py-5">
        <p className="text-secondary text-md">Here's what you will get:</p>

        <div className="flex flex-row gap-3 items-center">
          <div>
            <Icons.aiIcon />
          </div>
          <p className="text-xs md:text-base">
            <span className="text-xs md:text-base font-bold">AI-Generated Responses:</span> Generate
            context aware responses to your customer reviews.
          </p>
        </div>
        <div className="flex flex-row gap-3 items-center">
          <div>
            <Icons.analyticsIcon />
          </div>
          <p className="text-sm md:text-base">
            <span className="text-xs md:text-base font-bold">Analytics Dashboard:</span> Gain
            insights into customer sentiment and review trends.
          </p>
        </div>
        <div className="flex flex-row gap-3 items-center">
          <div>
            <Icons.languageIcon />
          </div>
          <p className="text-sm md:text-base">
            <span className="text-xs md:text-base font-bold">Multilingual Support:</span> Respond to
            reviews in multiple languages seamlessly.
          </p>
        </div>
      </div>

      <div>
        <p className="text-sm md:text-base text-slate-500">
          Cancel anytime. We'll remind you 2 days before your trial ends.
        </p>
      </div>

      <div className="flex flex-row items-center gap-3">
        <Button
          onClick={() => setProceedToPay(true)}
          className="bg-primary hover:bg-primary/50 font-semibold text-white"
        >
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


  if (isSuccess) {
    const standardPlan = data.filter(
      (item: any) => item.plan_name === "standard plan"
    );
    console.log(standardPlan);

    const proPlan = data.filter((item: any) => item.plan_name === "pro-plan");

    paymentScreenTwo = (
      <div className="flex flex-1 flex-col p-2 md:p-5 gap-3">
        <div>
          <Controller
            name="plan"
            control={control}
            rules={{
              required: "Please select a subscription plan.", // Custom error message
            }}
            render={({ field }) => (
              <RadioGroup
                value={field.value ?? ""}
                onValueChange={(val) =>{
                   field.onChange(val)
                  }
                }
                className="grid grid-cols-1 items-center mt-1 gap-3 capitalize"
              
                {...register("plan")}
              >
                <button className="flex items-center gap-2 bg-gradient-to-r from-primary/70 to-primary text-white py-1 px-2 rounded-3xl w-fit">
                  <span className="text-xs">Standard Plan</span>
                </button>
                {/* {standardPlan?.slice().reverce().map((item: any) => (
                                    <div className="h-full">
                                        <RadioGroupItem className="hidden" type="button" value={item.plan_id} id={item.plan_id} />
                                        <label 
                                            className={watch("plan") === item.plan_id ? "flex flex-row items-center gap-2 border border-primary bg-primary/5 text-lg p-3 w-full font-bold cursor-pointer rounded-lg" : "flex flex-row items-center gap-2 border border-black text-lg font-bold p-3 w-full rounded-lg cursor-pointer" }
                                            htmlFor={item.plan_id}
                                        >
                                            {watch("plan") === item.plan_id ? <CircleCheck className="fill-primary stroke-white" /> : <Circle className="fill-white stroke-slate-400 h-5 w-5" />}
                                            <div className="flex  flex-row items-center justify-between w-full">
                                                <p>{item.period} plan</p>
                                                <p className="text-slate-600 text-sm">₹ {(item.plan_amount / 100).toFixed(2)} ($ {item.amount_to_usd.toFixed(2)})</p>
                                            </div>
                                        </label>
                                    </div>
                                  
                                ))}  */}
                {standardPlan
                  ?.slice()
                  .reverse()
                  .map((item: any) => (
                    <div className="h-full" key={item.plan_id}>
                      <RadioGroupItem
                        className="hidden"
                        type="button"
                        value={item.plan_id}
                        id={item.plan_id}
                      />
                      <label
                        className={
                          watch("plan") === item.plan_id
                            ? "flex flex-row items-center gap-2 border border-primary bg-primary/5 text-lg p-3 w-full font-bold cursor-pointer rounded-lg"
                            : "flex flex-row items-center gap-2 border border-black text-lg font-bold p-3 w-full rounded-lg cursor-pointer"
                        }
                        htmlFor={item.plan_id}
                      >
                        {watch("plan") === item.plan_id ? (
                          <CircleCheck className="fill-primary stroke-white" />
                        ) : (
                          <Circle className="fill-white stroke-slate-400 h-5 w-5" />
                        )}
                        <div className="flex flex-row items-center justify-between w-full">
                          <p className="text-sm md:text-base">{item.period} plan</p>
                          <p className="text-slate-600 text-sm">
                            ₹ {(item.plan_amount / 100).toFixed(2)} (${" "}
                            {item.amount_to_usd.toFixed(2)})
                          </p>
                        </div>
                      </label>
                    </div>
                  ))}

                <button className="flex items-center gap-2 bg-gradient-to-r from-[#7158E2]/70 to-[#7158E2] text-white py-1 px-2 rounded-3xl w-fit">
                  <span className="text-xs">Pro Plan</span>
                </button>
                {proPlan?.map((item: any) => (
                  <div className="h-full">
                    <RadioGroupItem
                      className="hidden"
                      type="button"
                      value={item.plan_id}
                      id={item.plan_id}
                    />
                    <label
                      className={
                        watch("plan") === item.plan_id
                          ? "flex flex-row items-center gap-2 border border-primary bg-primary/5 text-lg p-3 w-full font-bold cursor-pointer rounded-lg"
                          : "flex flex-row items-center gap-2 border border-black text-lg font-bold p-3 w-full rounded-lg cursor-pointer"
                      }
                      htmlFor={item.plan_id}
                    >
                      {watch("plan") === item.plan_id ? (
                        <CircleCheck className="fill-primary stroke-white" />
                      ) : (
                        <Circle className="fill-white stroke-slate-400 h-5 w-5" />
                      )}
                      <div className="flex flex-row items-center justify-between w-full">
                        <div className="flex flex-row text-sm md:text-base items-center gap-1">
                          <p>{item.period} plan</p>
                          <Crown className="h-5 w-5 stroke-primary" />
                        </div>
                        <p className="text-slate-600 text-sm">
                          ₹ {(item.plan_amount / 100).toFixed(2)} (${" "}
                          {item.amount_to_usd.toFixed(2)})
                        </p>
                      </div>
                    </label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        </div>

        <div className="flex flex-col gap-2 py-2 text-xs">
          <div className="flex  gap-3 items-start md:items-start">
            <Check className="stroke-green-400" />
            <p>
              <span className="font-bold">AI-Powered Responses:</span> Generate
              professional replies to reviews with ease.
            </p>
          </div>
          <div className="flex gap-3 items-start md:items-start">
            <Check className="stroke-green-400" />
            <p>
              <span className="font-bold">Sentiment Analysis:</span> Understand
              customer emotions and feedback.
            </p>
          </div>
          <div className="flex flex-row gap-3 items-start md:items-start">
            <Check className="stroke-green-400" />
            <p>
              <span className="font-bold">Analytics Dashboard:</span> Gain
              insights from detailed data visualizations.
            </p>
          </div>
          <div className="flex flex-row gap-3 items-start md:items-start">
            <Check className="stroke-green-400" />
            <p>
              <span className="font-bold">Multilingual Support:</span> Respond
              to reviews in multiple languages.
            </p>
          </div>
          <div className="flex flex-row gap-3 items-start md:items-start">
            <Check className="stroke-green-400" />
            <p>Flexible cancellation policy</p>
          </div>
          <div className="flex flex-row gap-3 items-start md:items-start">
            <Check className="stroke-green-400 " />
            <p>Reminders before each billing cycle</p>
          </div>
          
          <p className="text-xs">By upgrading your plan, your current active plan will be deactivated, and the new plan will be activated immediately. You'll gain access to all the features of the new plan.</p>

        
        </div>

        <div className="pb-2 md:p-0 flex flex-row items-center justify-between">
          <div className="flex flex-row items-center justify-between text-sm">
            <div>
              <p className="font-semibold text-lg">Due today</p>
              <p className="text-slate-500">
                {dayjs(new Date()).format("ddd, MMM DD YYYY")}
              </p>
            </div>
            <div>
              <p className="text-xl font-bold">
                {
                  data?.filter(
                    (item: any) => item.place_id === watch("plan")
                  )[0]?.plan_amount
                }
              </p>
            </div>
          </div>

          <div className="flex pb-2 md:pb-0   flex-row items-center gap-3">
            <Button
              disabled={isPending}
              onClick={initiatePayment}
              className="bg-primary hover:bg-primary/50 font-thin"
            >
              {isPending ? (
                <LoaderCircle className="h-5 w-5 animate-spin" />
              ) : (
                "Next"
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AlertDialog open={openPaymentDialog} onOpenChange={setOpenPaymentDialog} >
      <AlertDialogTrigger asChild>
        <button className="flex items-center gap-2 bg-gradient-to-r from-[#CD84F1] to-[#7158E2] text-white py-1 px-2 rounded-lg">
          <Gift className="h-5 w-5" />
          <span className="text-xs">Upgrade</span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-0 overflow-y-scroll  w-11/12 h-4/5 md:h-auto   md:max-w-5xl">
        <div className="  h-screen   p-2 flex flex-row">
        <Button
              onClick={() => setOpenPaymentDialog(false)}
              className=" md:hidden   absolute top-3 right-3"
              variant="secondary"
              size="icon"
            >
              <X className="h-3 w-3" />
            </Button>
          {proceedToPay ? paymentScreenTwo : paymentScreenOne}

          <div className="hidden md:flex bg-sandal flex-1 relative">
            <Button
              onClick={() => setOpenPaymentDialog(false)}
              className="p-1 absolute top-3 right-3"
              variant="secondary"
              size="icon"
            >
              <X className="h-5 w-5" />
            </Button>
            <img
              className="h-full w-full object-contain"
              src={ASSETS.PAYMENT_BG_IMG}
              alt="img"
            />
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default UpgradeModal;
