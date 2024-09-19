import { useMutation } from "@tanstack/react-query"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./alert-dialog"
import { Button } from "./button"
import { cancelSubscription } from "@/lib/apis"
import { toast } from "sonner"
import { AxiosError } from "axios"
import { useAppContext } from "@/contexts/AuthContext"

function CancelSubscription() {

    const { auth } = useAppContext();
    const { mutate } = useMutation({
        mutationKey: [ "cancelSubscription" ],
        mutationFn: cancelSubscription,
        onSuccess: (data) => {
            toast.success("Request Success", { description: data?.data?.message });
        },
        onError: (error: AxiosError<any>) => {
            toast.error("Request Failed", { description: error?.response?.data?.message })
        }
    });


  return (
    <AlertDialog>
        <AlertDialogTrigger>
            <Button className="bg-red-500 hover:bg-red-500/80">Cancel Subscription</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                <div>
                    This action cannot be undone. This will permanently cancel your subscription.
                </div>
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel asChild>
                    <Button variant="secondary">Cancel</Button>
                </AlertDialogCancel>
                <AlertDialogAction type='submit' asChild>
                    <Button onClick={() => mutate({ token: auth?.token as string })} variant="destructive">Continue</Button>
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default CancelSubscription