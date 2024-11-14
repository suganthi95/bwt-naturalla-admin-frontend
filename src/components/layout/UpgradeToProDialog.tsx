import { CircleCheck, Crown } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog"
import { Button } from "../ui/button"
import { isPastDate } from "@/lib/utils";

interface Props {
    planName: string,
    planEndDate: Date,
    clickEvent: () => void
}

function UpgradeToProDialog({planName, planEndDate, clickEvent}: Props) {

    const features = [ "Awesome Features", "Added Benefits", "Better Value", "Let's try it!" ];
    console.log(planName)
    const isFreeTrialEnd = isPastDate(planEndDate)

  return (
    <AlertDialog open={isFreeTrialEnd}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle className="space-y-2">
                <Button size="icon" className="rounded-full" variant="secondary"><Crown className="h-5 w-5 stroke-primary" /></Button>
                <h1>Upgrade to Pro</h1>
            </AlertDialogTitle>
            <AlertDialogDescription>
                <div className="grid grid-cols-2 gap-3 py-4">
                    {features.map(item => (
                        <div className="flex flex-row items-center gap-2 font-bold">
                            <div><CircleCheck className="fill-primary stroke-white"/></div>
                            <p>{item}</p>
                        </div>
                    ))}
                </div>
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogAction onClick={clickEvent} className="bg-primary hover:bg-primary/50">Upgrade</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default UpgradeToProDialog