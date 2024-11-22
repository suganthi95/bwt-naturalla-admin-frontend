import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"
import { isPastDate } from "@/lib/utils";
import { ASSETS } from "@/assets/assets";
interface Props {
    planName: string,
    planEndDate: Date,
    clickEvent: () => void
}

function UpgradeToProDialog({planName, planEndDate, clickEvent}: Props) {

    console.log(planName)
    const isFreeTrialEnd = isPastDate(planEndDate)

  return (
    <AlertDialog open={isFreeTrialEnd}>
        <AlertDialogContent >
            <div className="bg-[#FFF7F0] h-72 ">
                <img src={ASSETS.FREE_TRIAL_IMG} className="h-full w-full object-contain" />
            </div>
            <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-2xl text-[#141618]">
                <h1>Your free trail ended  today!</h1>
            </AlertDialogTitle>
            <AlertDialogDescription>
                <div className="text-[#141618] space-y-3 text-base text-center">
                    <p>Your 7-day free trial has now expired. You no longer have access to the Intelliresponse dashboard. </p>
                    <p>So, upgrade now to continue enjoying the pro plan services.</p>
                </div>
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogAction onClick={clickEvent} className="bg-primary mx-auto p-2 px-8 hover:bg-primary/50">Upgrade Now</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>



  )
}

export default UpgradeToProDialog