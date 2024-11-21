// import { CircleCheck, Crown } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"
// import { Button } from "../ui/button"
import { isPastDate } from "@/lib/utils";
import { ASSETS } from "@/assets/assets";
interface Props {
    planName: string,
    planEndDate: Date,
    clickEvent: () => void
}

function UpgradeToProDialog({planName, planEndDate, clickEvent}: Props) {

    // const features = [ "Awesome Features", "Added Benefits", "Better Value", "Let's try it!" ];
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
                {/* <div className="grid grid-cols-2 gap-3 py-4">
                    {features.map(item => (
                        <div className="flex flex-row items-center gap-2 font-bold">
                            <div><CircleCheck className="fill-primary stroke-white"/></div>
                            <p>{item}</p>
                        </div>
                    ))}
                </div> */}
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