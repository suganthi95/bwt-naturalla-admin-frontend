import { ASSETS } from "@/assets/assets";
import { Icons } from "@/assets/icons";
import AdvancedSentimentSkeleton from "@/common/AdvancedSentimentSkeleton";
import ImprovementContentSkeleton from "@/common/ImprovementContentSkeleton";
import KeyInsightsSkeleton from "@/common/KeyInsightsSkeleton";
import OverviewChartCardSkeleton from "@/common/OverviewChartCardSkeleton";
import AdvancedSentiment from "@/components/dashboard/advanced/AdvancedSentiment";
import ImporvementContent from "@/components/dashboard/advanced/ImporvementContent";
import KeyInsights from "@/components/dashboard/advanced/KeyInsights";
import OverviewCard from "@/components/dashboard/advanced/OverviewCard";
import AverageSentiment from "@/components/dashboard/AverageSentiment";
import ResponseRate from "@/components/dashboard/ResponseRate";
import ReviewLengthAnalysis from "@/components/dashboard/ReviewLengthAnalysis";
import ReviewsActiveTime from "@/components/dashboard/ReviewsActiveTime";
import SentimentDistributionGraph from "@/components/dashboard/SentimentDistributionGraph";
import SentimentDistributionOvertime from "@/components/dashboard/SentimentDistributionOvertime";
import TotalReviewsCard from "@/components/dashboard/TotalReviewsCard";
import { Button } from "@/components/ui/button";
import ContactUs from "@/components/ui/ContactUs";
import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/contexts/AuthContext";
import {
  createSubscription,
  fetchSubscriptionPlans,
  getAdvanceDashboard,
  PAYMENT_KEY,
  verifySubscription,
} from "@/lib/apis";
import { initializeGA, trackpPageView } from "@/lib/google_analytics";
import { planFeatures } from "@/lib/utils";
import {
  BusinessList,
  SubscriptionPlanType,
  ValidateUserType,
  WorkspaceList,
} from "@/types";
import { Dialog } from "@radix-ui/react-dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { CircleAlert, CircleCheck, CircleX, Clock, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { Trans } from "react-i18next";
import useRazorpay, { RazorpayOptions } from "react-razorpay";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
function Home() {
  const location = useLocation();
  const { auth } = useAppContext();
  const navigate = useNavigate();
  const [planType, setPlanType] = useState("monthly");

  const [dashboardValue, setDashboardValue] = useState<"basic" | "advanced">(
    "basic"
  );
  const [Razorpay] = useRazorpay();

  useEffect(() => {
    initializeGA();
    trackpPageView(location.pathname, auth?.data?.email ?? "");
  }, []);
  const queryClient = useQueryClient();

  const { isSuccess, isLoading, data } = useQuery({
    queryKey: ["fetchSubscriptionPlans"],
    queryFn: () =>
      fetchSubscriptionPlans({
        token: auth?.token as string,
        country: localStorage.getItem("loc") as string,
      }),
    refetchOnWindowFocus: false,
    select: (data): SubscriptionPlanType[] => data.data,
    retry: 1,
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
      // SubscriptionModal(false);
      const { subscription_id } = data?.data?.data;

      const options = {
        key: PAYMENT_KEY,
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
      planId,
    });
  };

  let plans;

  if (isLoading) {
    plans = (
      <div className="mx-auto">
        <Loader />
      </div>
    );
  }

  if (isPending) {
    plans = (
      <div className="mx-auto">
        <Loader />
      </div>
    );
  }

  if (isSuccess && !isPending) {
    const [standardPlanData] = data.filter(
      (item) => item.period === planType && item.plan_name === "standard plan"
    );
    const [proPlanData] = data.filter(
      (item) => item.period === planType && item.plan_name === "pro-plan"
    );

    plans = (
      <>
        <div className="flex flex-row items-center gap-3 mx-auto">
          <img src={ASSETS.LOGO} alt="logo" />
          <div>
            <p className="font-bold text-lg md:text-2xl text-primary">
              Intelli<span className="text-secondary">Response</span>
            </p>
            <span className="text-slate-500 text-xs md:text-sm">
              {/* Turning Reviews Into Insights */}
              <Trans i18nKey={"title"} />
            </span>
          </div>
        </div>

        <p className="text-center text-xs md:text-sm text-slate-500">
          {/* Experience the full capabilities of IntelliResponse without any
          commitment. */}
          <Trans i18nKey={"fullExperience"} />
        </p>
        <div className="text-center flex flex-row items-center gap-2 font-medium mx-auto dark:text-white">
          <p>
            {/* Monthly */}
            <Trans i18nKey={"monthly"} />
          </p>
          <Switch
            checked={planType === "yearly"}
            onCheckedChange={() =>
              setPlanType((prev) => (prev === "monthly" ? "yearly" : "monthly"))
            }
          />
          <div className="flex flex-row items-center gap-2">
            <p>
              {/* Yearly */}
              <Trans i18nKey={"yearly"} />
            </p>
            <div className="px-3 py-1 bg-[#59C204] rounded-3xl text-white">
              <p>
                <Trans i18nKey={"save"} /> 40%
              </p>
            </div>
          </div>
        </div>

        <div className="group grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 overflow-y-scroll">
          <div
            className={`peer flex flex-col justify-between rounded-xl p-1 md:p-2 xl:p-5 w-full dark:border hover:border hover:border-primary hover:bg-[#FFFAF5] transition-all ease-in duration-75 ${
              standardPlanData.active_plan &&
              "bg-green-100 hover:bg-green-100 hover:border-none"
            }`}
          >
            <div className="flex flex-row items-center gap-3">
              <Icons.standardIcon className="h-10 w-10" />

              <div className="flex flex-col gap-y-2 md:flex-row items-center justify-between w-full">
                <div className="text-md">
                  <p className="text-slate-500">
                    <Trans i18nKey={"plans.beginner"} />
                  </p>
                  <h2 className="text-secondary font-bold text-lg">
                    <Trans i18nKey={"plans.standard"} />
                  </h2>
                </div>
                {standardPlanData.active_plan && (
                  <div>
                    <Button className="bg-[#bcbf28] hover:bg-[#bcbf28] md:p-2 xl:px-4 text-xs lg:text-balance rounded-xl text-white font-bold">
                      <Trans i18nKey={"plans.active_plan"} />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-2">
              <h1 className="text-lg md:text-2xl text-secondary font-bold">
                {standardPlanData.currency_symbol}{" "}
                {standardPlanData.period === "monthly"
                  ? standardPlanData.plan_amount
                  : standardPlanData.price_per_month}{" "}
                <span className="text-slate-500 font-normal line-through text-lg">
                  {standardPlanData.strike_through_price}
                </span>{" "}
                <span className="text-sm text-slate-500 font-normal">
                  /{" "}
                  {standardPlanData.period === "monthly" ? (
                    <Trans i18nKey={"monthly"} />
                  ) : (
                    <Trans i18nKey={"monthlyBilledAnnually"} />
                  )}
                </span>
              </h1>
            </div>

            <div className="flex flex-col gap-2 text-xs xl:text-sm mt-3">
              {planFeatures.standard.map((item) => (
                <div
                  key={`standard-${item.text}`}
                  className="flex flex-row gap-3 items-start md:items-center"
                >
                  <div className="h-5 w-5">
                    {/* <CircleCheck className="fill-green-400 stroke-white h-5 w-5" /> */}
                    {item.icon === "success" && (
                      <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                    )}
                    {item.icon === "error" && (
                      <CircleX className="fill-red-400 stroke-white h-5 w-5" />
                    )}
                    {item.icon === "coming soon" && (
                      <Clock className="fill-blue-400 stroke-white h-5 w-5" />
                    )}
                  </div>
                  <p className="text-slate-600 font-bold">
                    <Trans i18nKey={item.text} />
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-2">
              <Button
                disabled={isPending || standardPlanData.active_plan}
                onClick={() =>
                  buyNowOnclick(
                    standardPlanData.plan_id,
                    standardPlanData.country
                  )
                }
                size="lg"
                className="w-full dark:bg-primary hover:dark:bg-primary/80 dark:text-white"
              >
                <Trans i18nKey={"buyNow"} />
              </Button>
            </div>
          </div>

          <div
            className={`flex flex-col justify-between rounded-xl p-1 md:p-2 xl:p-5 w-full bg-[#FFFAF5] border border-primary ${
              proPlanData.active_plan &&
              "bg-green-100 hover:bg-green-100 border-none hover:border-none"
            }`}
          >
            <div className="flex flex-row items-center gap-3">
              <Icons.proIcon className="h-12 w-12" />

              <div className="flex flex-col gap-y-2 md:flex-row items-center justify-between w-full">
                <div className="text-md">
                  <p className="text-slate-500">
                    <Trans i18nKey={"plans.professional"} />
                  </p>
                  <h2 className="text-secondary font-bold text-lg flex flex-row items-center gap-2">
                    <Trans i18nKey={"plans.pro"} />{" "}
                    <Icons.diamondIcon className="h-5 w-5" />
                  </h2>
                </div>

                {proPlanData.active_plan ? (
                  <div>
                    <Button className="bg-[#bcbf28] hover:bg-[#bcbf28] md:p-2 xl:px-4 text-xs lg:text-balance rounded-xl text-white font-bold">
                      <Trans i18nKey={"plans.active_plan"} />
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Button className="bg-[#59C204] hover:bg-[#59C204] md:p-2 xl:px-4 text-xs lg:text-balance rounded-xl text-white font-bold">
                      <Trans i18nKey={"plans.best_value"} />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-2">
              <h1 className="text-lg md:text-2xl text-primary font-bold">
                {proPlanData.currency_symbol}{" "}
                {proPlanData.period === "monthly"
                  ? proPlanData.plan_amount
                  : proPlanData.price_per_month}{" "}
                <span className="text-slate-500 font-normal line-through text-lg">
                  {proPlanData.strike_through_price}
                </span>{" "}
                <span className="text-sm text-slate-500 font-normal">
                  /{" "}
                  {/* {proPlanData.period === "monthly"
                    ? "Monthly"
                    : "Monthly, Billed Anually"} */}
                  {proPlanData.period === "monthly" ? (
                    <Trans i18nKey={"monthly"} />
                  ) : (
                    <Trans i18nKey={"monthlyBilledAnnually"} />
                  )}
                </span>
              </h1>
            </div>

            <div className="flex flex-col gap-2 text-xs xl:text-sm mt-3">
              {planFeatures.pro.map((item) => (
                <div
                  key={`pro-${item.text}`}
                  className="flex flex-row gap-3 items-start md:items-center"
                >
                  <div className="h-5 w-5">
                    {/* <CircleCheck className="fill-green-400 stroke-white h-5 w-5" /> */}
                    {item.icon === "success" && (
                      <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                    )}
                    {item.icon === "error" && (
                      <CircleX className="fill-red-400 stroke-white h-5 w-5" />
                    )}
                    {item.icon === "coming soon" && (
                      <Clock className="fill-blue-400 stroke-white h-5 w-5" />
                    )}
                  </div>
                  <p className="text-slate-600 font-bold">
                    <Trans i18nKey={item.text} />
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-2">
              <Button
                disabled={isPending || proPlanData.active_plan}
                onClick={() =>
                  buyNowOnclick(proPlanData.plan_id, proPlanData.country)
                }
                size="lg"
                className="w-full dark:bg-primary hover:dark:bg-primary/80 dark:text-white bg-primary hover:bg-primary/80"
              >
                <Trans i18nKey={"buyNow"} />
              </Button>
            </div>
          </div>

          <div className="peer flex flex-col justify-between rounded-xl p-1 md:p-2 xl:p-5 w-full dark:border hover:border hover:border-primary hover:bg-[#FFFAF5] transition-all ease-in duration-75">
            <div className="flex flex-row items-center gap-3">
              <Icons.enterpriseIcon className="h-10 w-10" />

              <div className="text-md">
                <p className="text-slate-500">
                  {" "}
                  <Trans i18nKey={"plans.enterprise"} />
                </p>
                <h2 className="text-secondary font-bold text-lg">
                  <Trans i18nKey={"plans.enterprisePlan"} />
                </h2>
              </div>
            </div>

            <div className="mt-6">
              <h1 className="text-lg md:text-2xl text-secondary font-bold">
                <Trans i18nKey={"plans.contact_sales"} />
              </h1>
            </div>

            <div className="flex flex-col gap-2 text-xs xl:text-sm mt-3">
              {planFeatures.enterprise.map((item) => (
                <div
                  key={`enterprise-${item.text}`}
                  className="flex flex-row gap-3 items-start md:items-center"
                >
                  <div className="h-5 w-5">
                    {/* <CircleCheck className="fill-green-400 stroke-white h-5 w-5" /> */}
                    {item.icon === "success" && (
                      <CircleCheck className="fill-green-400 stroke-white h-5 w-5" />
                    )}
                    {item.icon === "warning" && (
                      <CircleAlert className="fill-orange-400 stroke-white h-5 w-5" />
                    )}
                    {item.icon === "error" && (
                      <CircleX className="fill-red-400 stroke-white h-5 w-5" />
                    )}
                    {item.icon === "coming soon" && (
                      <Clock className="fill-blue-400 stroke-white h-5 w-5" />
                    )}
                  </div>
                  <p className="text-slate-600 font-bold">
                    <Trans i18nKey={item.text} />
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-2">
              <ContactUs />
            </div>
          </div>
        </div>
      </>
    );
  }
  const validateUser = queryClient.getQueryData<
    AxiosResponse<{ data: ValidateUserType }>
  >(["validateUser"]);
  const [activeWorkspace] = validateUser?.data?.data?.workspaceList.filter(
    (item) => item.workspace_id === validateUser?.data?.data?.active_workspace
  ) as WorkspaceList[];
  const [activeBusiness] = validateUser?.data?.data?.businessList.filter(
    (item) => item.place_id === activeWorkspace.active_business
  ) as BusinessList[];

  if (!activeBusiness?.place_id) {
    return (
      <div className="flex flex-col items-center justify-center p-2 flex-1 overflow-hidden">
        <h1 className="text-xl font-semibold">
          <Trans i18nKey={"no_business_added"} />
        </h1>
        <p className="text-slate-300">
          <Trans i18nKey={"search_or_add_business"} />
        </p>
      </div>
    );
  }
  const {
    data: AdvanceDashboard,
    isSuccess: AdvanceDashboardSuccess,
    isError: AdvanceDashboardError,
  } = useQuery({
    queryKey: ["advancedashboard"],
    queryFn: () =>
      getAdvanceDashboard(
        activeBusiness.place_id,
        auth?.token ?? "",
        auth?.data?.email ?? ""
      ),
    retry: 2,
    staleTime: 1000 * 60 * 5,
    select: (data) => data?.data,
  });
  console.log(AdvanceDashboard);

  return (
    <div className="flex flex-col w-full gap-6 p-4 md:p-2  relative overflow-y-auto md:pb-20">
      <TotalReviewsCard placeId={activeBusiness?.place_id} />
      <div className="flex  justify-between items-start ">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="flex gap-2 mb-4 bg-transparent w-fit  dark:bg-transparent">
            {" "}
            {/* Flex instead of grid for tighter buttons */}
            <TabsTrigger
              onClick={() => {
                setDashboardValue("basic");
              }}
              value="basic"
              className="px-6 py-2  data-[state=active]:bg-primary  data-[state=active]:text-white rounded-lg text-sm font-medium border border-muted bg-transparent hover:bg-muted/30 transition"
            >
              {/* Basic */}
              <Trans i18nKey={"basic"} />
            </TabsTrigger>
            <TabsTrigger
              onClick={() => {
                setDashboardValue("advanced");
              }}
              value="advanced"
              className="px-6 py-2 rounded-lg data-[state=active]:bg-primary  data-[state=active]:text-white text-sm font-medium border border-muted bg-transparent hover:bg-muted/30 transition"
            >
              <Trans i18nKey={"advanced"} />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className=" ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <ReviewLengthAnalysis placeId={activeBusiness?.place_id} />
              <ReviewsActiveTime placeId={activeBusiness?.place_id} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <SentimentDistributionGraph placeId={activeBusiness?.place_id} />
              <AverageSentiment placeId={activeBusiness?.place_id} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <SentimentDistributionOvertime
                placeId={activeBusiness?.place_id}
              />
              <ResponseRate placeId={activeBusiness?.place_id} />
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="w-full space-y-4">
            {validateUser?.data?.data?.plan_name === "pro-plan" &&
            AdvanceDashboardSuccess &&
            !AdvanceDashboardError ? (
              <>
                <div>
                  <ImporvementContent
                    data={AdvanceDashboard?.negative_insights?.areas_to_improve}
                  />
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
                  <OverviewCard
                    monthly={AdvanceDashboard?.sentiment_trend?.monthly}
                    yearly={AdvanceDashboard?.sentiment_trend?.yearly}
                  />
                  <AdvancedSentiment
                    value1={
                      AdvanceDashboard?.metadata?.sentiment_distribution
                        ?.negative
                    }
                    value2={
                      AdvanceDashboard?.metadata?.sentiment_distribution
                        ?.positive
                    }
                  />
                </div>
                <div>
                  <KeyInsights
                    negativeInsights={
                      AdvanceDashboard?.negative_insights?.keywords
                    }
                    positiveInsights={
                      AdvanceDashboard?.positive_insights?.key_strengths
                    }
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <ImprovementContentSkeleton />
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
                  <OverviewChartCardSkeleton />
                  <AdvancedSentimentSkeleton />
                </div>
                <div>
                  <KeyInsightsSkeleton />
                </div>
              </>
            )}
            {/* <>
              <div>
                <ImporvementContent data={AdvanceDashboard?.negative_insights?.areas_to_improve} />
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
                <OverviewCard monthly={AdvanceDashboard?.sentiment_trend?.monthly} yearly={AdvanceDashboard?.sentiment_trend?.yearly} />
                <AdvancedSentiment
                  value1={
                    AdvanceDashboard?.metadata?.sentiment_distribution?.negative
                  }
                  value2={
                    AdvanceDashboard?.metadata?.sentiment_distribution?.positive
                  }
                />
              </div>
              <div>
                <KeyInsights negativeInsights={AdvanceDashboard?.negative_insights?.keywords} positiveInsights={AdvanceDashboard?.positive_insights?.key_strengths} />
              </div>
             
            </> */}
          </TabsContent>
        </Tabs>
      </div>
      {dashboardValue === "advanced" &&
        validateUser?.data?.data?.plan_name === "standard plan" && (
          <Dialog>
            <DialogTrigger className="flex absolute right-4 top-[30.6rem] md:top-44 lg:top-32 ">
              <Button className="  bg-[#0F344E]/10 text-[#0F344E] rounded-3xl flex items-center hover:bg-transparent gap-x-2 border border-black font-semibold">
                <Icons.Lock />
               <Trans i18nKey={'unlock'}/>
              </Button>
            </DialogTrigger>
            <DialogContent className="h-full xl:h-auto w-10/12 md:max-w-7xl dark:text-white">
              {plans}
            </DialogContent>
          </Dialog>
        )}
    </div>
  );
}

export default Home;
