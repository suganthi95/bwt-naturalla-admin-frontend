// import { CircleCheck, Crown } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
// import { Button } from "../ui/button"
import { isPastDate, RemainingDays } from "@/lib/utils";
import { ASSETS } from "@/assets/assets";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
interface Props {
  planName: string;
  planEndDate: Date;
  clickEvent: () => void;
}

function UpgradeToProDialog({ planName, planEndDate, clickEvent }: Props) {
  const [modal, setModal] = useState<boolean>(false);

  const isFreeTrialEnd = isPastDate(planEndDate);

  const balanceDays = RemainingDays(planEndDate);

  const showPopup = () => {
    if (balanceDays > 0 && planName == "free trial") {
      const lastShown = localStorage.getItem("lastDialogShown");

      if (!lastShown || dayjs().isAfter(dayjs(lastShown), "day")) {
        setModal(true);
        localStorage.setItem("lastDialogShown", dayjs().format("YYYY-MM-DD"));
      }
    }
  };
  
  useEffect(() => {
    showPopup();
  }, [balanceDays, planEndDate]);

  return (
    <AlertDialog open={planName == "standard plan" ? isFreeTrialEnd : modal}>
      <AlertDialogContent>
        <div className="bg-[#FFF7F0] h-72 ">
          <img
            src={ASSETS.FREE_TRIAL_IMG}
            className="h-full w-full object-contain"
          />
        </div>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-2xl text-[#141618]">
            {planName == "free trial" ? (
              <h1>Your free trial ends in {balanceDays} Days</h1>
            ) : (
              <h1>Your free trial ends today!</h1>
            )}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <div className="text-[#141618] space-y-3 text-base text-center">
              <p>
                Your 7-day free trial has now expired. You no longer have access
                to the Intelliresponse dashboard.{" "}
              </p>
              <p>So, upgrade now to continue enjoying the pro plan services.</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex flex-col md:flex-row justify-center items-center gap-y-4 gap-x-16">
          <AlertDialogAction
            onClick={clickEvent}
            className={`${
              !modal ? "mx-auto" : ""
            } bg-primary   p-2 px-8 hover:bg-primary/50`}
          >
            Upgrade Now
          </AlertDialogAction>
          {planName == "free trial" && (
            <AlertDialogAction
              onClick={() => setModal(false)}
              className="mx-auto"
            >
              Cancel
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default UpgradeToProDialog;
