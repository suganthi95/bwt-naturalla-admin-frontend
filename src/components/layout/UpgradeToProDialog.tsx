// import { CircleCheck, Crown } from "lucide-react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
// import { Button } from "../ui/button"
import { ASSETS } from "@/assets/assets";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
interface Props {
  isUpgradedUser: boolean,
  clickEvent: () => void;
}

function UpgradeToProDialog({ isUpgradedUser, clickEvent }: Props) {

  const [modal, setModal] = useState<boolean>(false);

  // const isFreeTrialEnd = isPastDate(planEndDate);

  // const balanceDays = RemainingDays(planEndDate);
  

  // const showPopup = () => {
  //   if (balanceDays > 0 && planName == "free trial") {
  //     const lastShown = localStorage.getItem("lastDialogShown");
  //     if (!lastShown || dayjs().isAfter(dayjs(lastShown), "day")) {
  //       setModal(true);
  //       localStorage.setItem("lastDialogShown", dayjs().format("YYYY-MM-DD"));
  //     }
  //   }
  // };
  
  // useEffect(() => {
  //   showPopup();
  // }, [balanceDays, planEndDate]);


  // if(planName == "free trial" && balanceDays > 0){
  //   dialogContent = (
  //     <AlertDialogHeader>
  //       <AlertDialogTitle className="text-center text-2xl text-[#141618]">
  //           <h1>Your free trial ends in {balanceDays} Days</h1>
  //       </AlertDialogTitle>
  //       <AlertDialogDescription>
  //       <div className="text-[#141618] space-y-3 text-base text-center">
  //           <p>
  //             Your 7-day free trial has expiry soon 
  //           </p>
  //           <p>So, upgrade now to continue enjoying the pro plan services.</p>
  //         </div>
  //       </AlertDialogDescription>
  //     </AlertDialogHeader>
  //   )
  // }

  // if(planName == "free trial" && balanceDays === 0){
  //   dialogContent = (
  //     <AlertDialogHeader>
  //       <AlertDialogTitle className="text-center text-2xl text-[#141618]">
  //         <h1>Your free trial ends today!</h1>
  //       </AlertDialogTitle>
  //       <AlertDialogDescription>
  //         <div className="text-[#141618] space-y-3 text-base text-center">
  //           <p>
  //             Your 7-day free trial has now expired. You no longer have access
  //             to the Intelliresponse dashboard.{" "}
  //           </p>
  //           <p>So, upgrade now to continue enjoying the pro plan services.</p>
  //         </div>
  //       </AlertDialogDescription>
  //     </AlertDialogHeader>
  //   )
  // }

  // if(planName == "free trial" && balanceDays <= 0){
  //   dialogContent = (
  //     <AlertDialogHeader>
  //       <AlertDialogTitle className="text-center text-2xl text-[#141618]">
  //         <h1>Your free trial ended</h1>
  //       </AlertDialogTitle>
  //       <AlertDialogDescription>
  //         <div className="text-[#141618] space-y-3 text-base text-center">
  //           <p>
  //             Your 7-day free trial has expired. You no longer have access
  //             to the Intelliresponse dashboard.{" "}
  //           </p>
  //           <p>So, upgrade now to continue enjoying the pro plan services.</p>
  //         </div>
  //       </AlertDialogDescription>
  //     </AlertDialogHeader>
  //   )
  // }

  useEffect(() => {
    if(!isUpgradedUser){
      setModal(true)
    }
  }, [])

  return (
    <AlertDialog open={modal}>
      <AlertDialogContent>
        <div className="bg-[#FFF7F0] h-72 ">
          <img
            src={ASSETS.FREE_TRIAL_IMG}
            className="h-full w-full object-contain"
          />
        </div>
        
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-2xl text-[#141618]">
              <h1>Subscribe to Intelliresponse</h1>
          </AlertDialogTitle>
          <AlertDialogDescription>
            <div className="text-[#141618] space-y-3 text-base text-center">
              <p>
                Unlock the full potential of our app with a subscription! Gain exclusive access to premium features, personalized experiences, and priority support. Join now and elevate your experience to the next level! 🚀
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <div className="w-full flex flex-row items-center justify-center gap-5">
            <Button
              onClick={() => {
                setModal(false)
                clickEvent()
              }}
              className={`bg-primary p-2 px-8 hover:bg-primary/50`}
            >
              Upgrade Now
            </Button>
            {/* {planName == "free trial" && balanceDays > 0 &&
              <Button
                onClick={() => setModal(false)}
                className="p-2 px-8"
              >
                Maybe Later
              </Button>
            } */}
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default UpgradeToProDialog;
